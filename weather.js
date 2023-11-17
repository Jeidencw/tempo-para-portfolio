const cityEl = document.querySelector('.city')
const dateEl = document.querySelector('.date')
const temperatureEl = document.querySelector('.temperature')
const min_maxEl = document.querySelector('.min-max')

const url = city => `https://api.hgbrasil.com/weather?key=ea6e58cc&city_name=${city}`

const fetchData = async url => {
    const response = await fetch(url)

    const data = response.json()

    console.log(data);
}

fetchData(url('Curitiba'))


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
  