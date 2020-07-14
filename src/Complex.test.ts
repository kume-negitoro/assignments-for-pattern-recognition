import { Complex, exp, dft, idft, dft2, idft2 } from './Complex'

describe('dft-idft', () => {
    test('input and idft(dft(input)) should be same', () => {
        const signal1 = [1, 2, 3, 4, 5]
        const signal2 = signal1
            .map(Complex.of)
            .map((n, k, a) => dft(k, a))
            .map((n, k, a) => idft(k, a))
            .map((c) => Math.round(c.re))
        expect(signal2).toEqual(signal1)
    })
})

describe('dft2-idft2', () => {
    test('input and idft2(dft2(input)) should be same', () => {
        const signal1 = [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6],
            [3, 4, 5, 6, 7],
            [4, 5, 6, 7, 8],
            [5, 6, 7, 8, 9],
        ]
        const signal2 = idft2(
            dft2(signal1.map((row) => row.map(Complex.of)))
        ).map((row) => row.map((c) => Math.round(c.re)))

        expect(signal2).toEqual(signal1)
    })
})

describe('exp', () => {
    test('exp', () => {
        expect(exp(Math.PI)).toEqual(
            Complex.of(Math.cos(Math.PI), Math.sin(Math.PI))
        )
    })
})

describe('Complex', () => {
    test('of(number, number) should equal to new Complex(number, number)', () => {
        expect(Complex.of(1, 2)).toEqual(new Complex(1, 2))
        expect(Complex.of(1)).toEqual(new Complex(1))
        expect(Complex.of()).toEqual(new Complex())
    })

    test('of(number) should equal to of(number, 0)', () => {
        expect(Complex.of(1)).toEqual(new Complex(1, 0))
    })

    test('of() should equal to of(0, 0)', () => {
        expect(Complex.of()).toEqual(new Complex(0, 0))
    })

    test('zero() should equal to of(0, 0)', () => {
        expect(Complex.zero()).toEqual(Complex.of(0, 0))
        expect(Complex.zero()).toEqual(Complex.of())
    })

    test('exp', () => {
        expect(Complex.exp(Math.PI)).toEqual(
            Complex.of(Math.cos(Math.PI), Math.sin(Math.PI))
        )
    })
})

describe('Complex.prototype', () => {
    test('add()', () => {
        expect(Complex.of(1, 2).add(Complex.of(3, 4))).toEqual(Complex.of(4, 6))
    })

    test('mul()', () => {
        expect(Complex.of(2, 3).mul(Complex.of(3, 4))).toEqual(
            Complex.of(-6, 17)
        )
    })

    test('mulNumber()', () => {
        expect(Complex.of(2, 3).mulNumber(2)).toEqual(Complex.of(4, 6))
    })
})
