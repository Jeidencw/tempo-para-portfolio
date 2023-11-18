const inputSearchEl = document.querySelector('.input__search')
const menuSearchEl = document.querySelector('.menu__search')

const key = 'gRAEr5JKPHaTx2tAkwxPRpuzOwqLDKUD'

const urlCity = city => `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${city}`
const urlCurrentConditions = cityKey => `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${key}&language=pt-br`
const urlFiveDaysForecast = cityKey => `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${key}&language=pt-br&metric=true`
const url12HoursForecast = cityKey => `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${key}&language=pt-br&metric=true`


const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const showCurrentConditions = (dataCity, dataCurrentConditions, dataFiveDaysForecast) => {
    const cityEl = document.querySelector('.city')
    const weatherTextEl = document.querySelector('.weather__text')
    const temperatureEl = document.querySelector('.temperature')
    const currentMinEl = document.querySelector('.current__min')
    const currentMaxEl = document.querySelector('.current__max')

    const cityName = dataCity[0].LocalizedName
    const currentTemperature = dataCurrentConditions[0].Temperature.Metric.Value
    const min = dataFiveDaysForecast.DailyForecasts[0].Temperature.Minimum.Value
    const max = dataFiveDaysForecast.DailyForecasts[0].Temperature.Maximum.Value
    const weatherText = dataCurrentConditions[0].WeatherText

    cityEl.textContent = cityName
    temperatureEl.textContent = currentTemperature
    currentMaxEl.textContent = max
    currentMinEl.textContent = min
    weatherTextEl.textContent = weatherText
}

const getFiveDaysInfo = dataFiveDaysForecast => {
    const fiveDatas = []
    const fiveMin = []
    const fiveMax = []

    let dataDaAPI, data, dia, mes, dataFormatada, min, max

    for (let i = 0; i < 5; i++) {
        dataDaAPI = dataFiveDaysForecast.DailyForecasts[i].Date
    
        data = new Date(dataDaAPI)
        dia = String(data.getDate()).padStart(2, '0')
        mes = String(data.getMonth() + 1).padStart(2, '0')
        dataFormatada = `${dia}/${mes}`
    
        fiveDatas.push(dataFormatada)

        min = Math.round(dataFiveDaysForecast.DailyForecasts[i].Temperature.Minimum.Value)
        max = Math.round(dataFiveDaysForecast.DailyForecasts[i].Temperature.Maximum.Value)
        
        fiveMin.push(min)
        fiveMax.push(max)
    }

    return { fiveDatas, fiveMin, fiveMax }

}

const showFiveDays = dataFiveDaysForecast => {
    const dateElements = document.querySelectorAll('.date__five-days')
    const dateMinEl = document.querySelectorAll('.date__min')
    const dateMaxEl = document.querySelectorAll('.date__max')
  
    const { fiveDatas, fiveMin, fiveMax } = getFiveDaysInfo(dataFiveDaysForecast)

    dateElements.forEach((element, index) => {
        element.textContent = fiveDatas[index]
    })

    dateMinEl.forEach((element, index) => {
        element.textContent = fiveMin[index]
    })
        
    dateMaxEl.forEach((element, index) => {
        element.textContent = fiveMax[index]
    })
}

const getFiveHoursInfo = data12HoursForecast => {
    const fiveHours = []
    const fiveTemps = []

    let hourAPI, data, hour

    for (let i = 0; i < 5; i++) {
        hourAPI = data12HoursForecast[i].DateTime
        data = new Date(hourAPI)
        hour = String(data.getHours()).padStart(2, '0')

        fiveHours.push(hour)
    }

    return { fiveHours }
}

const showFiveHours = data12HoursForecast => {
    console.log(data12HoursForecast);
    const { fiveHours } = getFiveHoursInfo(data12HoursForecast)

    console.log(fiveHours);
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
  