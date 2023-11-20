const inputSearchEl = document.querySelector('.input__search')
const menuSearchEl = document.querySelector('.menu__search')

const key = '4nku4gcAXKK3UwDMfG1hd03f1fRsiDno'

const urlCity = city => `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${city}`
const urlCurrentConditions = cityKey => `https://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${key}&language=pt-br`
const urlFiveDaysForecast = cityKey => `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${key}&language=pt-br&metric=true`
const url12HoursForecast = cityKey => `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${key}&language=pt-br&metric=true`

const urlImg = number => `https://developer.accuweather.com/sites/default/files/${String(number).padStart(2, '0')}-s.png`

const fetchData = async url => {
    try {
        const response = await fetch(url)
        
        if(!response.ok){
            throw new Error('Não foi possível obter os dados')
        }

        return response.json()
    } catch ({ name, message }) {
        alert(`${name}: ${message}`)
    }
}

const showInfoLoop = (arr, info) => {
    arr.forEach((element, index) => {
        element.textContent = info[index]
    })
}

const showImgLoop = (arr, arrIcon) => arr.forEach((icon, index) => {
    icon.setAttribute('src', urlImg(arrIcon[index][0]))
    icon.setAttribute('alt', arrIcon[index][1])
})

const showCurrentConditions = (dataCity, dataCurrentConditions, dataFiveDaysForecast) => {
    const cityEl = document.querySelector('.city')
    const weatherTextEl = document.querySelector('.weather__text')
    const temperatureEl = document.querySelector('.temperature')
    const currentMinEl = document.querySelector('.current__min')
    const currentMaxEl = document.querySelector('.current__max')
    const mainIcon = document.querySelector('.main__icon')
    const body = document.querySelector('body')

    const cityName = dataCity[0].LocalizedName
    const currentTemperature = dataCurrentConditions[0].Temperature.Metric.Value
    const min = dataFiveDaysForecast.DailyForecasts[0].Temperature.Minimum.Value
    const max = dataFiveDaysForecast.DailyForecasts[0].Temperature.Maximum.Value
    const weatherText = dataCurrentConditions[0].WeatherText
    const weatherIcon = dataCurrentConditions[0].WeatherIcon

    cityEl.textContent = cityName
    temperatureEl.textContent = currentTemperature
    currentMaxEl.textContent = max
    currentMinEl.textContent = min
    weatherTextEl.textContent = weatherText
    mainIcon.setAttribute('src', urlImg(weatherIcon))

    if(dataCurrentConditions[0].IsDayTime){
        body.style.backgroundImage = "url('./imagens/day-bg-2.png')"
    }else{
        body.style.backgroundImage = "url('./imagens/night-bg-2.png')"
    }
}

const getFiveDaysInfo = dataFiveDaysForecast => {
    const fiveMin = []
    const fiveMax = []
    const fiveDays = []
    const iconNumber = []
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    let date = new Date()

    let min, max, iconDay, iconNight, weekDay

    for (let i = 0; i < 5; i++) {
        iconDay = [dataFiveDaysForecast.DailyForecasts[i].Day.Icon, dataFiveDaysForecast.DailyForecasts[i].Day.IconPhrase]
        iconNight = [dataFiveDaysForecast.DailyForecasts[i].Night.Icon, dataFiveDaysForecast.DailyForecasts[i].Night.IconPhrase]
        min = Math.round(dataFiveDaysForecast.DailyForecasts[i].Temperature.Minimum.Value)
        max = Math.round(dataFiveDaysForecast.DailyForecasts[i].Temperature.Maximum.Value)
        
        fiveDays.push(weekDays[date.getDay()])
        date.setDate(date.getDate() + 1)
    
        fiveMin.push(min)
        fiveMax.push(max)
        iconNumber.push(iconDay[0] > iconNight[0] ? iconDay : iconNight)
    }

    return { fiveMin, fiveMax, iconNumber, fiveDays }
}

const showFiveDays = dataFiveDaysForecast => {
    const dateElements = document.querySelectorAll('.date__five-days')
    const dateMinEl = document.querySelectorAll('.date__min')
    const dateMaxEl = document.querySelectorAll('.date__max')
    const iconDaily = document.querySelectorAll('.icon__daily')
  
    const { fiveDays, fiveMin, fiveMax, iconNumber } = getFiveDaysInfo(dataFiveDaysForecast)

    showImgLoop(iconDaily, iconNumber)
    showInfoLoop(dateElements, fiveDays)
    showInfoLoop(dateMinEl, fiveMin)
    showInfoLoop(dateMaxEl, fiveMax)
}

const getFiveHoursInfo = (data12HoursForecast, cityTimeZone) => {
    const fiveHours = []
    const fiveTemps = []
    const iconNumber = []

    let hourAPI, data, hour, temp, icon, localHour

    for (let i = 0; i < 5; i++) {
        hourAPI = data12HoursForecast[i].DateTime
        data = new Date(hourAPI)
        localHour = data.toLocaleTimeString('pt-BR', { timeZone: cityTimeZone.Name })
        hour = localHour.substr(0, 5)

        temp = Math.round(data12HoursForecast[i].Temperature.Value)
        icon = [data12HoursForecast[i].WeatherIcon, data12HoursForecast[i].IconPhrase]

        fiveHours.push(hour)
        fiveTemps.push(temp)    
        iconNumber.push(icon)
    }
    return { fiveHours, fiveTemps, iconNumber }
}

const showFiveHours = (data12HoursForecast, cityTimeZone) => {
    const dateElements = document.querySelectorAll('.date__five-hours')
    const tempHourEl = document.querySelectorAll('.temp_hour')
    const iconHour = document.querySelectorAll('.icon_hour')

    const { fiveHours, fiveTemps, iconNumber } = getFiveHoursInfo(data12HoursForecast, cityTimeZone)
 
    showImgLoop(iconHour, iconNumber)
    showInfoLoop(dateElements, fiveHours)
    showInfoLoop(tempHourEl, fiveTemps)
}


const fetchAllDatas = async inputValue => {
    const dataCity = await fetchData(urlCity(inputValue))
    const dataCurrentConditions = await fetchData(urlCurrentConditions(dataCity[0].Key))
    const dataFiveDaysForecast = await fetchData(urlFiveDaysForecast(dataCity[0].Key))
    const data12HoursForecast = await fetchData(url12HoursForecast(dataCity[0].Key))
    const cityTimeZone = dataCity[0].TimeZone

    showFiveDays(dataFiveDaysForecast)
    showCurrentConditions(dataCity, dataCurrentConditions, dataFiveDaysForecast)
    showFiveHours(data12HoursForecast, cityTimeZone)
}

const getCityFromCoords = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const latitude = position.coords.latitude
                    const longitude = position.coords.longitude

                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    const data = await response.json()
                    
                    const city = data.address.town

                    console.log(data);
                    resolve({ city })
                },
                error => {
                    reject(error)
                }
            )
        } else {
            reject(new Error('Geolocation is not supported'))
        }
    })
}

const handleSubmit = async e => {
    e.preventDefault()
    const inputValue = inputSearchEl.value.trim()

    await fetchAllDatas(inputValue)

    inputSearchEl.value = ''
}

const onStart = () => {
    getCityFromCoords()
    .then(({ city }) => {
        fetchAllDatas(city)
    })
    .catch(error => {
        console.error(error)
    })
}

onStart()
menuSearchEl.addEventListener('submit', handleSubmit)