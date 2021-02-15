import { convertirNombre, valeurNombreValide, chainifier } from '../utilite.js'
import {
    creerConvertisseur,
    enregistrerConvertisseur,
} from '../convertisseur.js'

const convertisseur = creerConvertisseur('Masses', valeurNombreValide)

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => chainifier(val, convertisseur.precision)

convertisseur
    .ajouterGroupe('Système International')
    .ajouterEntree(
        'gramme (g)',
        (val) => val,
        (val) => val
    )
    .ajouterEntree(
        'kilogramme (kg)',
        (val) => val * 1000,
        (val) => val / 1000
    )
convertisseur
    .ajouterGroupe('Autres')
    .ajouterEntree(
        'tonne (t)',
        (val) => val * 1000000,
        (val) => val / 1000000
    )
    .ajouterEntree(
        'livre impériale (lb)',
        (val) => val * 453.59237,
        (val) => val / 453.59237
    )
    .ajouterEntree(
        'once (oz)',
        (val) => val * 28.35,
        (val) => val / 28.35
    )

convertisseur.a_precision = true

enregistrerConvertisseur(convertisseur)

export { convertisseur }
