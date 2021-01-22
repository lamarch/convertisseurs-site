function envoyerEvenement(el, type) {
    var e = document.createEvent("HTMLEvents")
    e.initEvent(type, false, true)
    el.dispatchEvent(e)
}

//filtre l'entree des que l'input change afin d'éviter les caractères indésirables
//et appelle l'évenement "onchange"
function filtreEntree(input, filtre, onchange) {
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
                //on change la séléction également
                this.oldSelectionStart = this.selectionStart
                this.oldSelectionEnd = this.selectionEnd
                if (onchange) onchange(this.value)
            } else if (this.hasOwnProperty("oldValue")) {
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
                this.value = ""
            }
        })
    })
}

function creerPrecision() {
    window.precision = 3
    $("<div/>")
        .load("./partials/precision.html", () => {
            $("#precision")
                .on("input", function () {
                    //on enleve le focus
                    //afin d'éviter de faire revenir la vue sur l'input sur les
                    //versions smartphone
                    const actif = document.activeElement

                    if (actif.id !== "precision") {
                        actif.blur()
                    }

                    window.precision = this.value
                    this.labels[0].innerText = `Précision : ${this.value}`
                    if (window.precisionChange) window.precisionChange()
                })
                .trigger("input")
        })
        .appendTo(".form")
}

export function enregistrerConvertisseur(convertisseur) {
    //si nous sommes dans le navigateur
    if (typeof $ != "undefined") {
        //on change le titre
        const titre = `Convertisseur : ${convertisseur.nom}`
        document.title = titre
        $("#titre").text(titre)

        //on crée un sous composant qui va recueillir les différents groupes du convertisseur
        const contenant = $("<div/>", {
            class: "form",
        }).appendTo("#main")

        //si le convertisseur requiert une barre de précision
        if (convertisseur.a_precision) {
            creerPrecision()
        }

        //cette fonction est exécutée à chaque fois qu'une entrée recoit une nouvelle valeur valide
        //elle prend le nom de l'entrée également, afin de s'assurer que l'envoyeur ne voit pas sa
        //valeur modifiée
        convertisseur.nouvelleValeur = function (nom, valeur) {
            //pour chaque entrée du convertisseur
            this.entrees
                //on s'assure qu'on ne séléctionne pas l'entrée qui a envoyé la valeur
                .filter((entree) => entree.nom != nom)
                .forEach((entree) => {
                    //si la valeur de l'entrée est vide, alors on laisse l'input à vide
                    //c'est uniquement esthétique
                    if (typeof valeur == "undefined") {
                        entree.element.value = ""
                    } else {
                        //sinon, on appelle la fonction de conversion de l'entrée receptrice
                        //ceci converti la valeur dans le format et l'unité requis par la nouvelle
                        //entrée
                        let nvValeur = entree.reception(valeur)

                        //enfin, on passe la valeur dans une fonction de traitement
                        //elle permet par exemple de convertir les valeurs nombre en chaine
                        //elle est définie par le convertisseur
                        nvValeur = this.postTraitement(nvValeur)

                        entree.element.value = nvValeur
                    }
                })
        }

        //on crée les groupes dans le HTML
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
                    inputmode: convertisseur.inputmode,
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
                    if (valeur === "" || valeur === undefined) {
                        convertisseur.nouvelleValeur(entree.nom, undefined)
                    } else {
                        convertisseur.nouvelleValeur(
                            entree.nom,
                            entree.envoi(convertisseur.preTraitement(valeur))
                        )
                    }
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
