import prefix from './SI.json'

export function creerGroupeSI(nom) {
    if (prefix.value.operation === 'exponent') {
        const op = (val) => {
            const exp_val = prefix.value.value
            return Math.pow(exp_val, val)
        }
    } else {
        console.error('Unknown prefix operation')
    }
    
}
