const input = $('#theme-switch')
const root = $(':root')

input.on('click', () => {
    if (input.is(':checked')) {
        root.addClass('dark-theme')
    } else {
        root.removeClass('dark-theme')
    }
})
