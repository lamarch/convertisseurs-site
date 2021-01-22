export const valeurNombreValide = (valeur) => /^\-?\d*[\.,]?\d*$/.test(valeur)
export const valeurNombreEntierValide = (valeur) => /^\d*$/.test(valeur)
export const convertirNombre = (valeur) => {
    //TODO : enlever la notation scientifique dans la conversion de chaine en nombre sur les grands nombres
    //si c'est un point seul ou un moins, on retourne 0
    if (valeur === "." || valeur === "-" || valeur === "-.") {
        return 0
    } else {
        return +valeur.replace(",", ".")
    }
}

export const chainifier = (valeur, decimals) => {
    const puissance = Math.pow(10, decimals)

    const res = Math.round(valeur * puissance) / puissance
    let str = res.toFixed(decimals)

    //On supprime les 0 qui trainent à la fin
    if (str.includes(".")) {
        str = str.replace(/0*$/, "")
    }

    //On enlève le '.' si jamais il est le dernier caractère de la chaine
    if (str[str.length - 1] === ".") {
        str = str.substring(0, str.length - 1)
    }

    //Si la valeur est 0 et que le résultat et aussi 0, alors on retourne une chaine vide
    //Sinon, on retourne un environ 0
    if (str === "0" && res === 0) {
        str = "≃ 0"
    }

    if (valeur === 0) {
        str = ""
    }

    return str
}
