const inputSearchEl = document.querySelector('.input__search')
const menuSearchEl = document.querySelector('.menu__search')

const key = 'Os7J58DIMJQeT3AYMwe5ZCWZZ901Gpbl'

const urlCity = city => `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${city}`
const urlCurrentConditions = cityKey => `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${key}&language=pt-br`
const urlFiveDaysForecast = cityKey => `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${key}&language=pt-br&metric=true`
const url12HoursForecast = cityKey => `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${key}&language=pt-br&metric=true`

const urlImg = number => `https://developer.accuweather.com/sites/default/files/${String(number).padStart(2, '0')}-s.png`

const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const showInfoLoop = (arr, info) => {
    arr.forEach((element, index) => {
        element.textContent = info[index];
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
}

const getFiveDaysInfo = dataFiveDaysForecast => {
    const fiveDatas = []
    const fiveMin = []
    const fiveMax = []
    const iconNumber = []

    let dataDaAPI, data, dia, mes, dataFormatada, min, max, iconDay, iconNight

    for (let i = 0; i < 5; i++) {
        dataDaAPI = dataFiveDaysForecast.DailyForecasts[i].Date
    
        data = new Date(dataDaAPI)
        dia = String(data.getDate()).padStart(2, '0')
        mes = String(data.getMonth() + 1).padStart(2, '0')
        dataFormatada = `${dia}/${mes}`

        iconDay = [dataFiveDaysForecast.DailyForecasts[i].Day.Icon, dataFiveDaysForecast.DailyForecasts[i].Day.IconPhrase]
        iconNight = [dataFiveDaysForecast.DailyForecasts[i].Night.Icon, dataFiveDaysForecast.DailyForecasts[i].Night.IconPhrase]
        min = Math.round(dataFiveDaysForecast.DailyForecasts[i].Temperature.Minimum.Value)
        max = Math.round(dataFiveDaysForecast.DailyForecasts[i].Temperature.Maximum.Value)
        
        fiveDatas.push(dataFormatada)
        fiveMin.push(min)
        fiveMax.push(max)
        iconNumber.push(iconDay[0] > iconNight[0] ? iconDay : iconNight)
    }

    return { fiveDatas, fiveMin, fiveMax, iconNumber }
}

const showFiveDays = dataFiveDaysForecast => {
    const dateElements = document.querySelectorAll('.date__five-days')
    const dateMinEl = document.querySelectorAll('.date__min')
    const dateMaxEl = document.querySelectorAll('.date__max')
    const iconDaily = document.querySelectorAll('.icon__daily')
  
    const { fiveDatas, fiveMin, fiveMax, iconNumber } = getFiveDaysInfo(dataFiveDaysForecast)

    showImgLoop(iconDaily, iconNumber)
    showInfoLoop(dateElements, fiveDatas)
    showInfoLoop(dateMinEl, fiveMin)
    showInfoLoop(dateMaxEl, fiveMax)
}

const getFiveHoursInfo = data12HoursForecast => {
    const fiveHours = []
    const fiveTemps = []
    const iconNumber = []

    let hourAPI, data, hour, temp, phrases, icon

    for (let i = 0; i < 5; i++) {
        hourAPI = data12HoursForecast[i].DateTime
        data = new Date(hourAPI)
        hour = String(data.getHours()).padStart(2, '0')

        temp = Math.round(data12HoursForecast[i].Temperature.Value)
        icon = [data12HoursForecast[i].WeatherIcon, data12HoursForecast[i].IconPhrase]

        fiveHours.push(hour)
        fiveTemps.push(temp)
        iconNumber.push(icon)
    }
    return { fiveHours, fiveTemps, iconNumber }
}

const showFiveHours = data12HoursForecast => {
    const dateElements = document.querySelectorAll('.date__five-hours')
    const tempHourEl = document.querySelectorAll('.temp_hour')
    const iconHour = document.querySelectorAll('.icon_hour')

    const { fiveHours, fiveTemps, iconNumber } = getFiveHoursInfo(data12HoursForecast)
 
    showImgLoop(iconHour, iconNumber)
    showInfoLoop(dateElements, fiveHours)
    showInfoLoop(tempHourEl, fiveTemps)
}

const fazTudo = async e => {
    e.preventDefault()
    const inputValue = inputSearchEl.value.trim()

    const dataCity = await fetchData(urlCity(inputValue))
    const dataCurrentConditions = await fetchData(urlCurrentConditions(dataCity[0].Key))
    const dataFiveDaysForecast = await fetchData(urlFiveDaysForecast(dataCity[0].Key))
    const data12HoursForecast = await fetchData(url12HoursForecast(dataCity[0].Key))

    showFiveDays(dataFiveDaysForecast)
    showCurrentConditions(dataCity, dataCurrentConditions, dataFiveDaysForecast)
    showFiveHours(data12HoursForecast)

    inputSearchEl.value = ''
}

menuSearchEl.addEventListener('submit', fazTudo)


// if ("geolocation" in navigator) {
//     // Geolocalização está disponível
//     navigator.geolocation.getCurrentPosition(function(position) {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
  
//       // Aqui você pode usar essas coordenadas para fazer uma chamada a uma API de geolocalização, como a do OpenStreetMap ou outra API de geocodificação para obter a cidade
//       // Exemplo de uso da API do OpenStreetMap para obter a cidade
//       fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
//         .then(response => response.json())
//         .then(data => {
//           const city = data.address.town;
//           console.log("Cidade:", city);
//           // Faça o que desejar com a informação da cidade, como exibi-la na página
//         })
//         .catch(error => {
//           console.error("Erro ao buscar cidade:", error);
//         });
//     });
//   } else {
//     // Geolocalização não está disponível
//     console.log("Geolocalização não está disponível");
//   }
  