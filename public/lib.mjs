export const valeurNombreValide = (valeur) => /^\d+[\.,]?\d*$/.test(valeur)
export const valeurNombreEntierValide = (valeur) => /^\d*$/.test(valeur)
export const convertirNombre = (valeur) => +valeur.replace(",", ".")

export const arrondir = (valeur, decimals) => {
    const puissance = Math.pow(10, decimals)

    const a = Math.round(valeur * puissance) / puissance
    return a
}

//filtre l'entree des que l'input change afin d'éviter les caractères indésirables
//et appelle l'évenement "onchange"
export function filtreEntree(input, filtre, onchange) {
    // liste des evenements de changement de la valeur
    // sur les inputs
    ;[
        "input",
        "keydown",
        "keyup",
        "mousedown",
        "mouseup",
        "select",
        "contextmenu",
        "drop",
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
                this.oldSelectionStart = this.selectionStart
                this.oldSelectionEnd = this.selectionEnd
                if (onchange) onchange(this.value)
            } else if (this.hasOwnProperty("oldValue")) {
                //si la valeur est fausse
                //et qu'on peut remettre à l'ancienne valeur
                //on remette à l'ancienne valeur
                this.value = this.oldValue
                this.setSelectionRange(
                    this.oldSelectionStart,
                    this.oldSelectionEnd
                )
            } else {
                //sinon valeur invalide, on vide l'entree
                this.value = ""
            }
        })
    })
}

function envoyerEvenement(el, type) {
    var e = document.createEvent("HTMLEvents")
    e.initEvent(type, false, true)
    el.dispatchEvent(e)
}

export function enregistrerConvertisseur(convertisseur) {
    //si nous sommes dans le navigateur
    if (typeof $ != "undefined") {
        const titre = `Convertisseur : ${convertisseur.nom}`
        document.title = titre
        $("#titre").text(titre)

        const contenant = $("<div/>", {
            class: "form",
        }).appendTo("#main")

        if (convertisseur.a_precision) {
            window.precision = 3
            $("<div/>")
                .load("./partials/precision.html", () => {
                    $("#precision")
                        .on("input", function () {
                            window.precision = this.value
                            this.labels[0].innerText = `Précision : ${this.value}`
                            if (window.precisionChange) window.precisionChange()
                        })
                        .trigger("input")
                })
                .appendTo(".form")
        }

        convertisseur.nouvelleValeur = function (nom, valeur) {
            this.entrees
                .filter((entree) => entree.nom != nom)
                .forEach((entree) => {
                    if (valeur == 0) {
                        entree.element.value = ""
                    } else {
                        let nvValeur = entree.reception(valeur)
                        entree.element.value = this.postTraitement(nvValeur)
                    }
                })
        }

        convertisseur.groupes.forEach((groupe) => {
            //Pour chaque groupe on crée sa division correspondante
            const groupeContenant = $("<div/>", { class: "sub-form" }).appendTo(
                contenant
            )
            //Titre du groupe
            $("<h1/>", {
                text: groupe.nom,
            }).appendTo(groupeContenant)

            groupe.entrees.forEach((entree) => {
                //Pour chaque entree on crée sa division correspondante
                const entreeContenant = $("<div/>", {
                    class: "form-row",
                }).appendTo(groupeContenant)

                //Input
                const input = $("<input/>", {
                    type: "text",
                    name: entree.nom,
                    id: entree.nom,
                    class: "form-field",
                    placeholder: entree.nom,
                    inputmode: "numeric",
                }).appendTo(entreeContenant)[0]

                //Unité
                $("<label/>", {
                    text: entree.nom,
                    for: entree.nom,
                    class: "form-label",
                }).appendTo(entreeContenant)

                input.onclick = function () {
                    this.select()
                }

                entree.element = input

                filtreEntree(input, entree.filtre, (valeur) => {
                    convertisseur.nouvelleValeur(
                        entree.nom,
                        entree.envoi(convertisseur.preTraitement(valeur))
                    )
                })
            })
        })

        //Afin d'actualiser les valeurs lors du changement de précision de la fenetre
        //on envoi un évenement 'faux' à la première entrée de la liste
        if (convertisseur.entrees.length > 0) {
            window.precisionChange = () => {
                envoyerEvenement(convertisseur.entrees[0].element, "mouseup")
            }
        }
    }
}

export function creerConvertisseur(nom, filtreGlobal = undefined) {
    function ajouterEntree(nom, envoi, reception, filtre = undefined) {
        const groupe = this

        if (typeof filtre == "undefined") {
            filtre = groupe.conv.filtreGlobal
        }

        const entree = {
            nom: nom,
            envoi,
            reception,
            groupe,
            filtre,
        }
        groupe.conv.entrees.push(entree)
        groupe.entrees.push(entree)
        return groupe
    }

    function ajouterGroupe(nom) {
        const conv = this
        const groupe = {
            nom,
            ajouterEntree,
            conv,
            entrees: [],
        }
        conv.groupes.push(groupe)
        return groupe
    }

    return {
        nom,
        filtreGlobal,
        ajouterGroupe,
        preTraitement: (val) => val,
        postTraitement: (val) => val,
        entrees: [],
        groupes: [],
    }
}
