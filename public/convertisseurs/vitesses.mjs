import { arrondir, convertirNombre } from "../lib.mjs"
import {
    valeurNombreValide,
    creerConvertisseur,
    enregistrerConvertisseur,
} from "../lib.mjs"

const convertisseur = creerConvertisseur(
    "vitesses",
    //filtre global
    valeurNombreValide
)

convertisseur.preTraitement = (val) => convertirNombre(val)
convertisseur.postTraitement = (val) => arrondir(val, window.precision)

convertisseur
    .ajouterGroupe("Unités SI")
    .ajouterEntree(
        "m/s",
        (val) => val,
        (val) => val
    )
    .ajouterEntree(
        "km/h",
        (val) => val / 3.6,
        (val) => val * 3.6
    )

convertisseur
    .ajouterGroupe("Autres")
    .ajouterEntree(
        "noeuds, miles nautiques/h",
        (val) => val / 3.6 / 1.852,
        (val) => val * 3.6 * 1.852
    )
    .ajouterEntree(
        "mph",
        (val) => val / 3.6 / 1.609,
        (val) => val * 3.6 * 1.609
    )
    .ajouterEntree(
        "mach",
        (val) => val / 3.6 / 340,
        (val) => val * 3.6 * 340
    )
    .ajouterEntree(
        "pieds/min",
        (val) => val * 0.00508,
        (val) => val / 0.00508
    )

convertisseur.ordre = 10
convertisseur.a_precision = true

enregistrerConvertisseur(convertisseur)

export { convertisseur }
