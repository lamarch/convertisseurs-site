export const valeurNombreValide = (valeur) => /^-?\d*[.,]?\d*$/.test(valeur)
export const valeurNombreEntierValide = (valeur) => /^\d*$/.test(valeur)
export const convertirNombre = (valeur) => {
    //TODO : enlever la notation scientifique dans la conversion de chaine en nombre sur les grands nombres
    //si c'est un point seul ou un moins, on retourne 0
    if (valeur === '.' || valeur === '-' || valeur === '-.') {
        return 0
    } else {
        return +valeur.replace(',', '.')
    }
}

export const chainifier = (valeur, decimals) => {
    const puissance = Math.pow(10, decimals)

    const res = Math.round(valeur * puissance) / puissance
    let str = res.toFixed(decimals)

    //On supprime les 0 qui trainent à la fin
    if (str.includes('.')) {
        str = str.replace(/0*$/, '')
    }

    //On enlève le '.' si jamais il est le dernier caractère de la chaine
    if (str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1)
    }

    //Si la valeur est 0 et que le résultat et aussi 0, alors on retourne une chaine vide
    //Sinon, on retourne un environ 0
    if (str === '0' && res === 0) {
        str = '≃ 0'
    }

    if (valeur === 0) {
        str = ''
    }

    return str
}

export function envoyerEvenement(el, type) {
    var e = document.createEvent('HTMLEvents')
    e.initEvent(type, false, true)
    el.dispatchEvent(e)
}

//filtre l'entree des que l'input change afin d'éviter les caractères indésirables
//et appelle l'évenement "onchange"
export function filtreEntree(input, filtre, onchange) {
    // liste des evenements de changement de la valeur
    // sur les inputs
    [
        'input',
        'keydown',
        'keyup',
        'mousedown',
        'mouseup',
        'select',
        'contextmenu',
        'drop',
    ].forEach(function (event) {
        //pour chaque evenement
        //on ajoute un écouteur
        input.addEventListener(event, function () {
            //lorsque l'év. survient on vérifie
            //si la valeur est juste
            if (filtre(this.value)) {
                //valeur juste
                //on actualise la nouvelle valeur
                this.oldValue = this.value
                //on change la séléction également
                this.oldSelectionStart = this.selectionStart
                this.oldSelectionEnd = this.selectionEnd
                if (onchange) onchange(this.value)
            } else if (this.hasOwnProperty('oldValue')) {
                //si la valeur est fausse
                //et qu'on peut remettre à l'ancienne valeur
                //on remette à l'ancienne valeur
                this.value = this.oldValue
                //on change la selection également
                this.setSelectionRange(
                    this.oldSelectionStart,
                    this.oldSelectionEnd
                )
            } else {
                //valeur invalide, et l'entrée n'a pas enregistrée la valeur précédente
                //on vide
                this.value = ''
            }
        })
    })
}
