import { convertirNombre, valeurNombreValide, chainifier } from '../utilite.js'
import {
    creerConvertisseur,
    enregistrerConvertisseur,
} from '../convertisseur.js'

const convertisseur = creerConvertisseur('Puissances', valeurNombreValide)

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => chainifier(val, window.precision)

convertisseur
    .ajouterGroupe('Système International')
    .ajouterEntree(
        'watt',
        (val) => val,
        (val) => val
    )
    .ajouterEntree(
        'kilowatt',
        (val) => val * 1000,
        (val) => val / 1000
    )
convertisseur
    .ajouterGroupe('Autres')
    .ajouterEntree(
        'ch (cheval-vapeur français)',
        (val) => val * 735.49875,
        (val) => val / 735.49875
    )
    .ajouterEntree(
        'hp (cheval-vapeur impérial britannique)',
        (val) => val * 745.7,
        (val) => val / 745.7
    )

convertisseur.a_precision = true

enregistrerConvertisseur(convertisseur)

export { convertisseur }
