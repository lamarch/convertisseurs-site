const width = 710

window.onresize = () => {
    if (window.innerWidth <= width) {
        $(':root').addClass('little-size')
        console.log('small screen mode ON')
    } else {
        $(':root').removeClass('little-size')
    }
}

window.onresize()
