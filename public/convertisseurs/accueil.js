if (typeof $ != 'undefined') {
    $(() => {
        $('#main').load('../partials/accueil.html')
    })
}

const convertisseur = { nom: 'accueil', ordre: 0, cache: false }
export { convertisseur }
