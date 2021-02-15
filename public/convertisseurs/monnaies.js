import { convertirNombre, valeurNombreValide, chainifier } from '../utilite.js'
import {
    creerConvertisseur,
    enregistrerConvertisseur,
} from '../convertisseur.js'

const noms = {
    USD: 'Dollar (Etats-Unis)',
    AUD: 'Dollar Australien',
    CAD: 'Dollar Canadien',
    CHF: 'Franc Suisse',
    GBP: 'Livre (Grande-Bretagne)',
    EUR: 'Euro (Union Européenne)',
    HKD: 'Dollar de Hong Kong',
    ISK: 'Couronne Islandaise',
    PHP: 'Peso Phillipins',
    DKK: 'Couronne Danoise',
    HUF: 'Forint (Hongrie)',
    CZK: 'Couronne Tchèque',
    RON: 'Leu Roumain',
    SEK: 'Couronne Suédoise',
    IDR: 'Rupiah (Indonésie)',
    INR: 'Indian Rupee Indienne (Bhoutan)',
    BRL: 'Real Brésilien',
    RUB: 'Rouble Russe',
    HRK: 'Kuna (Croatie)',
    JPY: 'Yen (Japon)',
    THB: 'Baht (Thailande)',
    SGD: 'Dollar Singaporien',
    PLN: 'Zloty (Pologne)',
    BGN: 'Lev Bulgare',
    TRY: 'Livre Turque',
    CNY: 'Yuan Renminbi (Chine)',
    NOK: 'Couronne Norvégienne',
    NZD: 'Néo-Zélandais',
    ZAR: 'Rand (Afrique du S.)',
    MXN: 'Peso Mexicain',
    ILS: 'Nouveau Sheqel Israélien',
    KRW: 'Won (Corée du Sud)',
    MYR: 'Ringgi Malaisien',
}

const taux_communs = ['CAD', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'RUB']

const convertisseur = creerConvertisseur('monnaies', valeurNombreValide)
const groupe_commun = convertisseur.ajouterGroupe('Communes')
const groupe_autre = convertisseur.ajouterGroupe('Autres')

if (typeof $ != 'undefined') {
    //Si nous sommes dans le navigateur
    $.get('https://api.exchangeratesapi.io/latest', (reponse) => {
        const taux_echanges = { ...reponse.rates, EUR: 1 }

        for (let nom_taux in taux_echanges) {
            const nom =
                nom_taux in noms ? `${nom_taux} - ${noms[nom_taux]}` : nom_taux
            const val_taux = taux_echanges[nom_taux]

            //val_taux = 1€
            const envoie = (val) => val / val_taux
            const reception = (val) => val * val_taux

            if (taux_communs.includes(nom_taux)) {
                groupe_commun.ajouterEntree(nom, envoie, reception)
            } else {
                groupe_autre.ajouterEntree(nom, envoie, reception)
            }
        }
        enregistrerConvertisseur(convertisseur)
    })
}

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => chainifier(val, convertisseur.precision)
convertisseur.a_precision = true

export { convertisseur }
