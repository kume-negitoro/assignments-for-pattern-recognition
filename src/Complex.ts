export class Complex {
    constructor(public re: number = 0, public im: number = 0) {}

    add(right: Complex): Complex {
        this.re += right.re
        this.im += right.im
        return this
    }

    mul(right: Complex): Complex {
        this.re = this.re * right.re - this.im * right.im
        this.im = this.re * right.im + this.im * right.re
        return this
    }

    mulNumber(right: number): Complex {
        this.re *= right
        this.im *= right
        return this
    }

    static of(re?: number, im?: number): Complex {
        return new Complex(re, im)
    }

    static zero(): Complex {
        return new Complex()
    }
}

export const add = (left: Complex, right: Complex): Complex =>
    Complex.of(left.re + right.re, left.im + right.im)

export const mul = (left: Complex, right: Complex): Complex =>
    Complex.of(
        left.re * right.re - left.im * right.im,
        left.re * right.im + left.im * right.re
    )

export const mulNumber = (left: Complex, right: number): Complex =>
    Complex.of(left.re * right, left.im * right)

export const exp = (theta: number): Complex =>
    Complex.of(
        Math.cos(Math.abs(theta)),
        Math.sign(theta) * Math.sin(Math.abs(theta))
    )

export const dft = (k: number, cmps: Complex[]): Complex => {
    const N = cmps.length
    return cmps
        .reduce(
            (acc, cmp, i) =>
                acc.add(exp(-((2 * Math.PI) / N) * k * i).mul(cmp)),
            Complex.zero()
        )
        .mulNumber(1 / N)
}

export const idft = (i: number, cmps: Complex[]): Complex => {
    const N = cmps.length
    return cmps.reduce(
        (acc, cmp, k) => acc.add(exp(((2 * Math.PI) / N) * k * i).mul(cmp)),
        Complex.zero()
    )
}

export const dft2 = (input: Complex[][]): Complex[][] => {
    const width = input.length
    const height = input[0].length

    const dftCoeffH: Complex[][] = Array.from(Array(width), () => [])
    for (let n = 0; n < height; n++) {
        for (let k = 0; k < width; k++) {
            const signal = input[n]
            dftCoeffH[k][n] = dft(k, signal)
        }
    }

    const dftCoeffV: Complex[][] = Array.from(Array(width), () => [])
    for (let l = 0; l < height; l++) {
        for (let k = 0; k < width; k++) {
            dftCoeffV[k][l] = dft(l, dftCoeffH[k])
        }
    }

    return dftCoeffV
}

export const idft2 = (input: Complex[][]): Complex[][] => {
    const width = input.length
    const height = input[0].length

    const idftCoeffH: Complex[][] = Array.from(Array(width), () => [])
    for (let l = 0; l < height; l++) {
        const signal: Complex[] = []
        for (let k = 0; k < width; k++) {
            signal[k] = input[k][l]
        }
        for (let k = 0; k < width; k++) {
            idftCoeffH[k][l] = idft(k, signal)
        }
    }

    const idftCoeffV: Complex[][] = Array.from(Array(width), () => [])
    for (let n = 0; n < height; n++) {
        for (let m = 0; m < width; m++) {
            idftCoeffV[m][n] = idft(n, idftCoeffH[m])
        }
    }

    return idftCoeffV
}

export default Complex
