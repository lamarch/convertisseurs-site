import { convertirNombre, valeurNombreValide, chainifier } from '../utilite.js'
import {
    creerConvertisseur,
    enregistrerConvertisseur,
} from '../convertisseur.js'

const unites_si = {
    nanomètres: 0.001,
    micromètres: 1,
    millimètres: 1000,
    centimètres: 10_000,
    décimètres: 100_000,
    mètres: 1_000_000,
    décamètres: 10_000_000,
    hectomètres: 100_000_000,
    kilomètres: 1_000_000_000,
}

const unites_autres = {
    'angströms /angstrœms': 1 * Math.pow(10, -10),
    'milles nautiques': 1852,
    'unité astronomique': 149_597_870_700,
    'année-lumière': 9_461 * Math.pow(10, 12),
}

//unités inversées
const unites_imperiales = {
    'pouces [inch(es)]': 1 / 39.370_079,
    'mains [hand]': 1 / 9.842_520,
    'chainons [link(s)]': 1 / 4.970_970,
    'grands empans [span(s)]': 1 / 4.374_453,
    'peids [foot(feet)]': 1 / 3.280_840,
    'verges [yard(s)]': 1 / 1.093_613,
    'brasses [fathom(s)]': 1 / 0.546_807,
    'perches [rod(s)/perche(s)]': 1 / 0.198_839,
    'chaines [chain(s)]': 1 / 0.049_710,
    'Furlongs [furlong(s)]': 1 / 0.004_971,
    'milles terrestres [mile(s)]': 1 / 0.000_621,
    'lieues [league(s)]': 1 / 0.000_207,
    parsec: 3.26 * unites_autres['année-lumière'],
}

const convertisseur = creerConvertisseur(
    'distances',
    //filtre global
    valeurNombreValide
)

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => chainifier(val, window.precision)

let groupe = convertisseur.ajouterGroupe('Système International')

for (let unite in unites_si) {
    const valeur_unite = unites_si[unite] / 1_000_000
    groupe.ajouterEntree(
        unite,
        (val) => val * valeur_unite,
        (val) => val / valeur_unite
    )
}

groupe = convertisseur.ajouterGroupe('Système Impériale')

for (let unite in unites_imperiales) {
    const valeur_unite = unites_imperiales[unite]
    groupe.ajouterEntree(
        unite,
        (val) => val * valeur_unite,
        (val) => val / valeur_unite
    )
}

groupe = convertisseur.ajouterGroupe('Autres')

for (let unite in unites_autres) {
    const valeur_unite = unites_autres[unite]
    groupe.ajouterEntree(
        unite,
        (val) => val * valeur_unite,
        (val) => val / valeur_unite
    )
}

convertisseur.ordre = 15
convertisseur.a_precision = true

enregistrerConvertisseur(convertisseur)

export { convertisseur }
