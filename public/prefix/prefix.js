export function parsePrefixSys(prefix) {
    let op
    if (prefix.value.operation === 'exponent') {
        op = (val) => {
            const exp_val = prefix.value.value
            return Math.pow(exp_val, val)
        }
    }

    const magnitudes = {}
    for (let magn in prefix.magnitudes) {
        const units = []

        for (let unit in magn) {
            units.push({ name: unit, value: op(unit.value) })
        }

        magnitudes[magn] = units
    }
}
