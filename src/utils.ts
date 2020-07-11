import { ImageData } from 'canvas'

export const getLuminanceArrayFromColorImage = (
    imagedata: ImageData
): number[] => {
    const { width, height } = imagedata
    const arr: number[] = []
    const { data } = imagedata
    for (let i = 0; i < width * height * 4; i += 4) {
        arr.push(
            (data[i + 0] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) |
                0
        )
    }
    return arr
}

export const getLuminanceArrayFromGrayImage = (
    imagedata: ImageData
): number[] => {
    const { width, height } = imagedata
    const arr: number[] = []
    const { data } = imagedata
    for (let i = 0; i < width * height * 4; i += 4) {
        arr.push(data[i])
    }
    return arr
}

export const getImageDataFromLuminanceArray = (
    arr: number[],
    width: number,
    height: number
): ImageData =>
    new ImageData(
        Uint8ClampedArray.from(arr.flatMap((kido) => [kido, kido, kido, 255])),
        width,
        height
    )
