import { convertirNombre, valeurNombreValide, chainifier } from "../utilite.mjs"
import { creerConvertisseur } from "../lib.mjs"
import { enregistrerConvertisseur } from "../navlib.mjs"
const convertisseur = creerConvertisseur("Températures", valeurNombreValide)

convertisseur
    .ajouterGroupe("Communes")
    .ajouterEntree(
        "Degré Celcius",
        (val) => val + 273.15,
        (val) => val - 273.15
    )
    .ajouterEntree(
        "Kelvin",
        (val) => val,
        (val) => val
    )
    .ajouterEntree(
        "Fahrenheit",
        (val) => ((val - 32) * 5) / 9 + 273.15,
        (val) => ((val - 273.15) * 9) / 5 + 32
    )

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => chainifier(val, window.precision)
convertisseur.a_precision = true

enregistrerConvertisseur(convertisseur)

export { convertisseur }
