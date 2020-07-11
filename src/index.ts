import { writeFileSync } from 'fs'
import { createCanvas, loadImage } from 'canvas'
import { Complex, dft, idft, dft2, idft2 } from './Complex'
import {
    getLuminanceArrayFromGrayImage,
    getImageDataFromLuminanceArray,
} from './utils'

const imagePath = [
    './samples/sample1.png',
    './samples/sample2.png',
    './samples/sample3.png',
    './samples/mypicture.jpg',
][0]
const destPath = './proceed.png'

// console.log(
//     [1, 2, 3, 4, 5]
//         .map(Complex.of)
//         .map((n, k, a) => dft(k, a))
//         .map((n, k, a) => idft(k, a))
// )

void (async () => {
    const image = await loadImage(imagePath)
    const { width, height } = image
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0)
    const imagedata = ctx.getImageData(0, 0, width, height)

    const luminanceArray = getLuminanceArrayFromGrayImage(imagedata)

    const bitmap: Complex[][] = Array.from(Array(width), () => [])
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            bitmap[x][y] = Complex.of(luminanceArray[x + width * y])
        }
    }

    const coeff = dft2(bitmap)

    const newBitmap = idft2(coeff)

    const newLuminanceArray: number[] = []
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // console.log(newBitmap[x][y].re)
            newLuminanceArray[x + width * y] = newBitmap[x][y].re | 0
        }
    }

    const newImageData = getImageDataFromLuminanceArray(
        newLuminanceArray,
        width,
        height
    )

    ctx.putImageData(newImageData, 0, 0)
    const base64 = canvas.toDataURL().split(',')[1]
    const buffer = Buffer.from(base64, 'base64')
    writeFileSync(destPath, buffer)
})()
