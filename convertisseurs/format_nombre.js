import {
    creerConvertisseur,
    enregistrerConvertisseur,
} from '../convertisseur.js'

const chiffres = '0123456789'.split('')
const hex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function baseValide(base) {
    return typeof base == 'number' && base > 1 && base <= hex.length + 10
}

function divEntiere(dividende, diviseur) {
    const reste = dividende % diviseur
    return { quotient: (dividende - reste) / diviseur, reste }
}

function representation_valide(nombre, base) {
    if (!baseValide(base)) return false
    if (typeof nombre != 'string') return false

    nombre = nombre.toUpperCase()

    let valides = []
    //chiffres
    for (let i = 0; i < Math.min(base, 10); i++) {
        valides.push(i.toString())
    }

    //lettres
    for (let i = 0; i < hex.length && i + 10 < base; i++) {
        valides.push(hex[i])
    }

    for (let chiffre of nombre) {
        if (!valides.includes(chiffre)) return false
    }

    return true
}

function versBase10(repr_nombre, depuis_base) {
    if (!baseValide(depuis_base)) return undefined
    if (repr_nombre.length == 0) return 0

    repr_nombre = repr_nombre.toUpperCase()

    if (repr_nombre.length === 1) {
        const chiffre = repr_nombre.charAt(0)

        let nombre
        if (chiffres.includes(chiffre)) {
            nombre = +chiffre
            //error
        } else if (hex.includes(chiffre)) {
            nombre = 10 + hex.indexOf(chiffre)
        }

        if (nombre < depuis_base) return nombre

        //error
        return undefined
    }

    const chiffres_long = repr_nombre.length - 1

    let valeurFinale = 0

    for (let i = 0; i < repr_nombre.length; i++) {
        const chiffre = repr_nombre[i]
        const poids = chiffres_long - i
        const valeur_chiffre = versBase10(chiffre, depuis_base)
        valeurFinale += valeur_chiffre * Math.pow(depuis_base, poids)
    }
    return valeurFinale
}

function depuisBase10(nombre, vers_base) {
    if (!baseValide(vers_base)) return undefined
    if (!nombre) return '0'

    if (nombre < vers_base) {
        if (nombre > 9) return hex[nombre - 10]
        return nombre.toString()
    }

    let chiffres = []

    while (nombre != 0) {
        let resultat = divEntiere(nombre, vers_base)
        nombre = resultat.quotient

        chiffres = [depuisBase10(+resultat.reste, vers_base), ...chiffres]
    }
    if (chiffres.length == 0) return '0'
    return chiffres.join('')
}

const convertisseur = creerConvertisseur(
    'base des nombres',
    undefined,
    (val) => {
        if (val == 0) val = ''
        return val
    }
)

convertisseur
    .ajouterGroupe('Communes')
    .ajouterEntree(
        'Base 2 (binaire)',
        (val) => versBase10(val, 2),
        (val) => depuisBase10(val, 2),
        (val) => representation_valide(val, 2)
    )
    .ajouterEntree(
        'Base 8 (octale)',
        (val) => versBase10(val, 8),
        (val) => depuisBase10(val, 8),
        (val) => representation_valide(val, 8)
    )
    .ajouterEntree(
        'Base 10 (décimale)',
        (val) => versBase10(val, 10),
        (val) => depuisBase10(val, 10),
        (val) => representation_valide(val, 10)
    )
    .ajouterEntree(
        'Base 16 (hexadécimale)',
        (val) => versBase10(val, 16),
        (val) => depuisBase10(val, 16),
        (val) => representation_valide(val, 16)
    )

convertisseur.ordre = 20
convertisseur.inputmode = 'text' //on accepte les lettres puisque la base 16

enregistrerConvertisseur(convertisseur)

export { convertisseur }
