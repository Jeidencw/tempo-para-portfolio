const menuButtons = document.querySelectorAll('.menu button')

menuButtons.forEach(button => {
    button.addEventListener('click', e => {
        menuButtons.forEach(btn => btn.classList.remove('active'))
    
        e.target.classList.add('active')
    })
})