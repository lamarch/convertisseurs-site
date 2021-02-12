if (typeof $ != 'undefined') {
    $(() => {
        $('#main').load('../partials/accueil.html', undefined, () => {
            document.title = 'Convertisseurs'
            $('#version-ctr').text(window.version)
            console.log(window.version)
        })
    })
}
const convertisseur = { nom: 'accueil', ordre: 0, cache: false }

export { convertisseur }
