import { writeFileSync } from 'fs'
import { createCanvas, loadImage } from 'canvas'
import { Complex, dft2, idft2, lowpass } from './Complex'
import {
    getLuminanceArrayFromGrayImage,
    getImageDataFromLuminanceArray,
} from './utils'

const lowpassRate = 0.5
const destPath = './out/proceed.png'
const imagePath = './samples/mypicture.jpg'

void (async () => {
    // 画像を読み込む
    const image = await loadImage(imagePath)
    const { width, height } = image
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // 画像データを取得する
    ctx.drawImage(image, 0, 0)
    const imagedata = ctx.getImageData(0, 0, width, height)

    // 画像データから輝度値の配列を取得する
    const luminanceArray = getLuminanceArrayFromGrayImage(imagedata)

    // bitmap[width][height] に複素数として輝度値を格納する
    const bitmap: Complex[][] = Array.from(Array(width), () => [])
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            bitmap[x][y] = Complex.of(luminanceArray[x + width * y])
        }
    }

    // 輝度値に2次元DFTを適用してスペクトルを求める
    const coeff = dft2(bitmap, width, height)

    // スペクトルにローパスフィルタを適用する
    lowpass(coeff, width, height, lowpassRate)

    // スペクトルに2次元IDFTを適用して輝度値を求める
    const newBitmap = idft2(coeff, width, height)

    // 得られた複素数の実数部分を整数として新しい輝度値の配列を作る
    const newLuminanceArray: number[] = []
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            newLuminanceArray[x + width * y] = newBitmap[x][y].re | 0
        }
    }

    // 得られた輝度値を画像データに変換する
    const newImageData = getImageDataFromLuminanceArray(
        newLuminanceArray,
        width,
        height
    )

    // 画像データを書き出す
    ctx.putImageData(newImageData, 0, 0)
    const base64 = canvas.toDataURL().split(',')[1]
    const buffer = Buffer.from(base64, 'base64')
    writeFileSync(destPath, buffer)
})()
