import { convertirNombre, chainifier, nombreValide } from '../utilite.js'
import {
    creerConvertisseur,
    enregistrerConvertisseur,
} from '../convertisseur.js'

const convertisseur = creerConvertisseur('Températures', nombreValide())

convertisseur
    .ajouterGroupe('Communes')
    .ajouterEntree(
        'Degré Celcius',
        (val) => val + 273.15,
        (val) => val - 273.15
    )
    .ajouterEntree(
        'Kelvin',
        (val) => val,
        (val) => val
    )
    .ajouterEntree(
        'Fahrenheit',
        (val) => ((val - 32) * 5) / 9 + 273.15,
        (val) => ((val - 273.15) * 9) / 5 + 32
    )
    .ajouterEntree(
        'Rankine',
        (val) => val / 1.8,
        (val) => val * 1.8
    )

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => chainifier(val, window.precision)
convertisseur.a_precision = true

enregistrerConvertisseur(convertisseur)

export { convertisseur }
