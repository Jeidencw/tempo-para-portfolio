const menuButtons = document.querySelectorAll('.btn__day')
const menuIcons = document.querySelectorAll('.menu__icon')
const infoOneEl = document.querySelector('.info__one-day')
const infoFiveEl = document.querySelector('.info__five-days')


menuButtons.forEach(button => {
    button.addEventListener('click', e => {
        menuButtons.forEach(btn => btn.classList.remove('active'))
        menuIcons.forEach(icon => icon.classList.remove('active__icon'))
    
        e.target.classList.add('active')
        e.target.nextElementSibling.classList.add('active__icon')

        if(e.target.textContent === 'Hoje'){
            infoOneEl.style.display = 'flex'
            infoFiveEl.style.display = 'none'
        }else{
            infoOneEl.style.display = 'none'
            infoFiveEl.style.display = 'flex'
        }
    })
})