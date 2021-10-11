$(document).ready(function() {
    const inputCity = $('#citySrch');
    const searchBtn = $('#searchBtn');
    const cityName = $('#city-name');
    const weatherPic = $('#weatherPic');
    const temp = $('#temp');
    const humid = $('#humid');
    const windSpd = $('#windSpd');
    const uvi = $('#uvi');
    const srchHistory = $('#history');
    const cityTest = 'London';
    const apiKey = '81c2df482de1c0b8aacf94a4b39b0770';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityTest}&appid=${apiKey}`;


    function tempConverter(temp) {
        return Math.floor((temp - 273.15) * 1.8 + 32)
    }

    function searchCity(city) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log(data)

                const currentDate = moment(new Date()).format("DD/MM/YYYY");
                cityName.html(data.name + " " + currentDate);
                console.log(data.name)
                
                let weatherIcon = data.weather[0].icon;

                weatherPic.attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png")

                temp.html('Temperature: ' + tempConverter(data.main.temp) + "&#176F");
                humid.html('Humidity: ' + data.main.humidity + "%");
                windSpd.html('Wind Speed: ' + data.wind.speed + " MPH")

            }
        }
        xhttp.open("GET", apiUrl, true);
        xhttp.send();
    }

    searchCity(cityTest);
});