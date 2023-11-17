const cityEl = document.querySelector('.city')
const dateEl = document.querySelector('.date')
const temperatureEl = document.querySelector('.temperature')
const min_maxEl = document.querySelector('.min-max')
const inputSearchEl = document.querySelector('.input__search')
const menuSearchEl = document.querySelector('.menu__search')


const urlCity = city => `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=BiAf1nsRQlViFAzg8IpzshCsAGzUSnA2&q=${city}`
const urlCurrentConditions = cityKey => `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=BiAf1nsRQlViFAzg8IpzshCsAGzUSnA2&language=pt-br`
const urlFiveDaysForecast = cityKey => `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=BiAf1nsRQlViFAzg8IpzshCsAGzUSnA2&language=pt-br&metric=true`

const fetchDataCity = async url => {
    const response = await fetch(url)
    return await response.json()
}

const fetchCurrentConditions = async url => {
    const response = await fetch(url)
    return await response.json()
}

const fetchFiveDaysForecast = async url => {

}


menuSearchEl.addEventListener('submit', async e => {
    e.preventDefault()
    const inputValue = inputSearchEl.value.trim()

    const dataCity = await fetchDataCity(urlCity(inputValue))
    const dataCurrentConditions = await fetchCurrentConditions(urlCurrentConditions(dataCity[0].Key))

    const cityName = dataCity[0].LocalizedName
    const currentTemperature = dataCurrentConditions[0].Temperature.Metric.Value

    cityEl.textContent = cityName
    temperatureEl.textContent = currentTemperature

    inputSearchEl.value = ''
})


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
  