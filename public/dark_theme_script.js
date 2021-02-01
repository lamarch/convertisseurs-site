const input = $('#theme-switch')
const root = $(':root')

input.on('click', () => {
    if (input.is(':checked')) {
        root.addClass('dark-theme')
        window.localStorage.setItem('theme', 'dark')
    } else {
        root.removeClass('dark-theme')
        window.localStorage.setItem('theme', '')
    }
})

const theme = window.localStorage.getItem('theme')
if (theme === 'dark') {
    input.prop('checked', false)
    input.trigger('click')
}
