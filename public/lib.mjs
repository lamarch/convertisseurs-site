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
        inputmode: "numeric"
    }
}
