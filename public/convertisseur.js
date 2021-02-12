import { envoyerEvenement, filtreEntree } from './utilite.js'

/**
 * Création d'un convertisseur.
 * @param {string} nom - Le nom du convertisseur.
 * @param {function} filtreGlobal - Filtre global à appliquer à toutes les entrées ne possédant pas de filtre.
 */
export function creerConvertisseur(nom, filtreGlobal = undefined) {
    function ajouterEntree(nom, envoi, reception, filtre = undefined) {
        const groupe = this

        if (typeof filtre == 'undefined') {
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
        inputmode: 'numeric',
    }
}

function creerPrecision() {
    window.precision = 3
    $('<div/>')
        .load('./partials/precision.html', () => {
            $('#precision')
                .on('input', function () {
                    //on enleve le focus
                    //afin d'éviter de faire revenir la vue sur l'input sur les
                    //versions smartphone
                    const actif = document.activeElement

                    if (actif.id !== 'precision') {
                        actif.blur()
                    }

                    window.precision = this.value
                    this.labels[0].innerText = `Précision : ${this.value}`
                    if (window.precisionChange) window.precisionChange()
                })
                .trigger('input')
        })
        .appendTo('.convertisseur')
}

export function enregistrerConvertisseur(convertisseur) {
    //si nous sommes dans le navigateur
    if (typeof $ != 'undefined') {
        //on change le titre
        const titre = `Convertisseur : ${convertisseur.nom}`
        document.title = titre
        $('#titre').text(titre)

        //on crée un sous composant qui va recueillir les différents groupes du convertisseur
        const contenant = $('<div/>', {
            class: 'convertisseur',
        }).appendTo('#main')

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
                    if (typeof valeur == 'undefined') {
                        entree.element.value = ''
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
            const groupeContenant = $('<div/>', {
                class: 'groupe',
            }).appendTo(contenant)
            //Titre du groupe
            $('<h1/>', {
                text: groupe.nom,
            }).appendTo(groupeContenant)

            groupe.entrees.forEach((entree) => {
                //Pour chaque entree on crée sa division correspondante
                const entreeContenant = $('<div/>', {
                    class: 'entree horizontal-card-container',
                }).appendTo(groupeContenant)

                //Input
                const input = $('<input/>', {
                    type: 'text',
                    name: entree.nom,
                    id: entree.nom,
                    placeholder: entree.nom,
                    inputmode: convertisseur.inputmode,
                    class: 'card',
                }).appendTo(entreeContenant)[0]

                //Unité
                $('<label/>', {
                    text: entree.nom,
                    for: entree.nom,
                    class: 'card',
                }).appendTo(entreeContenant)

                input.onclick = function () {
                    this.select()
                }

                entree.element = input

                filtreEntree(input, entree.filtre, (valeur) => {
                    valeur = convertisseur.preTraitement(valeur)
                    if (typeof valeur == 'undefined') {
                        convertisseur.nouvelleValeur(entree.nom, undefined)
                    } else {
                        convertisseur.nouvelleValeur(
                            entree.nom,
                            entree.envoi(valeur)
                        )
                    }
                })
            })
        })

        //Afin d'actualiser les valeurs lors du changement de précision de la fenetre
        //on envoi un évenement 'faux' à la première entrée de la liste
        if (convertisseur.entrees.length > 0) {
            window.precisionChange = () => {
                envoyerEvenement(convertisseur.entrees[0].element, 'mouseup')
            }
        }
    }
}
