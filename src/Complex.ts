export class Complex {
    constructor(public re: number = 0, public im: number = 0) {}

    /**
     * 複素数の和
     * @param right right operand
     */
    add(right: Complex): Complex {
        this.re += right.re
        this.im += right.im
        return this
    }

    /**
     * 複素数の積
     * @param right right operand
     */
    mul(right: Complex): Complex {
        const re = this.re * right.re - this.im * right.im
        const im = this.re * right.im + this.im * right.re
        this.re = re
        this.im = im
        return this
    }

    /**
     * 複素数と実数の積
     * @param right right operand
     */
    mulNumber(right: number): Complex {
        this.re *= right
        this.im *= right
        return this
    }

    /**
     * 生成関数
     * @param re real number
     * @param im imaginary number
     */
    static of(re?: number, im?: number): Complex {
        return new Complex(re, im)
    }

    /**
     * 実部・虚部共に0の複素数を生成する
     */
    static zero(): Complex {
        return new Complex()
    }

    /**
     * exp(i * theta) の複素数を生成する
     * @param theta argument
     */
    static exp(theta: number): Complex {
        return Complex.of(
            Math.cos(Math.abs(theta)),
            Math.sign(theta) * Math.sin(Math.abs(theta))
        )
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

/**
 * 1次元DFTを行う関数
 * @param k k番目の振幅を求める
 * @param cmps 複素数の配列
 */
export const dft = (k: number, cmps: Complex[]): Complex => {
    const N = cmps.length
    return cmps
        .reduce(
            (acc, cmp, i) =>
                acc.add(Complex.exp(-((2 * Math.PI) / N) * k * i).mul(cmp)),
            Complex.zero()
        )
        .mulNumber(1 / N)
}

/**
 * 1次元IDFTを行う関数
 * @param i i番目の信号値を求める
 * @param cmps 複素数の配列
 */
export const idft = (i: number, cmps: Complex[]): Complex => {
    const N = cmps.length
    return cmps.reduce(
        (acc, cmp, k) =>
            acc.add(Complex.exp(((2 * Math.PI) / N) * k * i).mul(cmp)),
        Complex.zero()
    )
}

/**
 * 二次元の離散フーリエ変換を行う関数
 * @param input input[width][height]: 輝度値を複素数で表したものの2次元配列
 * @param width 画像の幅
 * @param height 画像の高さ
 * @return output[width][height]: スペクトルの2次元配列
 */
export const dft2 = (
    input: Complex[][],
    width: number = input.length,
    height: number = input[0].length
): Complex[][] => {
    // 水平方向のDFTの結果を格納するための配列
    const dftCoeffH: Complex[][] = Array.from(Array(width), () => [])
    // 水平方向の1次元DFTを行う
    for (let n = 0; n < height; n++) {
        // 水平方向の入力信号を配列として用意する
        const signal: Complex[] = []
        for (let m = 0; m < width; m++) {
            signal[m] = input[m][n]
        }
        // 1次元DFTを全ての行について行う
        for (let k = 0; k < width; k++) {
            dftCoeffH[k][n] = dft(k, signal)
        }
    }

    // 垂直方向のDFTの結果を格納するための配列
    const dftCoeffV: Complex[][] = Array.from(Array(width), () => [])
    // 垂直方向の1次元DFTを行う
    for (let l = 0; l < height; l++) {
        // 1次元DFTを全ての列について行う
        for (let k = 0; k < width; k++) {
            dftCoeffV[k][l] = dft(l, dftCoeffH[k])
        }
    }

    return dftCoeffV
}

/**
 * 二次元の離散フーリエ逆変換を行う関数
 * @param input input[width][height]: スペクトルの2次元配列
 * @param width 画像の幅
 * @param height 画像の高さ
 * @return input[width][height]: 輝度値を複素数で表したものの2次元配列
 */
export const idft2 = (
    input: Complex[][],
    width: number = input.length,
    height: number = input[0].length
): Complex[][] => {
    // 水平方向のIDFTの結果を格納するための配列
    const idftCoeffH: Complex[][] = Array.from(Array(width), () => [])
    // 水平方向の1次元IDFTを行う
    for (let l = 0; l < height; l++) {
        // 水平方向の入力信号を配列として用意する
        const signal: Complex[] = []
        for (let k = 0; k < width; k++) {
            signal[k] = input[k][l]
        }
        // 1次元IDFTを全ての行について行う
        for (let k = 0; k < width; k++) {
            idftCoeffH[k][l] = idft(k, signal)
        }
    }

    // 垂直方向のIDFTの結果を格納するための配列
    const idftCoeffV: Complex[][] = Array.from(Array(width), () => [])
    // 垂直方向の1次元IDFTを行う
    for (let n = 0; n < height; n++) {
        // 1次元IDFTを全ての列について行う
        for (let m = 0; m < width; m++) {
            idftCoeffV[m][n] = idft(n, idftCoeffH[m])
        }
    }

    return idftCoeffV
}

/**
 * スペクトルの2次元配列に対してローパスフィルタを適用する破壊的関数
 * @param coeff スペクトルの2次元配列
 * @param width 画像の幅
 * @param height 画像の高さ
 * @param rate 画像の大きさに対して何割の大きさの矩形を0にするか
 */
export const lowpass = (
    coeff: Complex[][],
    width: number,
    height: number,
    rate = 0.5
): void => {
    const cutWidth = width * rate
    const cutHeight = height * rate
    for (
        let k = Math.round((width - cutWidth) / 2);
        k < Math.round((width + cutWidth) / 2);
        k++
    ) {
        for (
            let l = Math.round((height - cutHeight) / 2);
            l < Math.round((height + cutHeight) / 2);
            l++
        ) {
            coeff[k][l] = Complex.zero()
        }
    }
}

export default Complex
