const menuButtons = document.querySelectorAll('.btn__day')
const infoDayEl = document.querySelector('.info__five-temps')
const infoHourEl = document.querySelector('.info__five-hours')


menuButtons.forEach(button => {
    button.addEventListener('click', e => {
        menuButtons.forEach(btn => btn.classList.remove('active'))
    
        e.target.classList.add('active')

        if(e.target.textContent === 'Hoje'){
            infoDayEl.style.display = 'none'
            infoHourEl.style.display = 'flex'
        }else{
            infoDayEl.style.display = 'flex'
            infoHourEl.style.display = 'none'
        }
    })
})