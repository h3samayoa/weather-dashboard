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
    const apiKey = '81c2df482de1c0b8aacf94a4b39b0770';
    const cityTest = 'London';


    function tempConverter(temp) {
        return Math.floor((temp - 273.15) * 1.8 + 32)
    }

    function searchCity(city) {
        let searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
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

                var lat = data.coord.lat;
                var long = data.coord.lon;

                forecast(lat, long);
            }
        }
        xhttp.open("GET", searchUrl, true);
        xhttp.send();
    }

    function forecast(lat, long) {
        console.log(lat, long);
        let uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=${apiKey}`
        console.log(uvURL)
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log(data)
                
                let uviBadge =  $("<span></span>")
                let uviVal = data.current.uvi;
                if (uviVal >= 0 && uviVal <= 2.99) {
                    uviBadge.attr("class", "badge badge-success");
                } else if (uviVal >= 3 && uviVal <= 7.99) {
                    uviBadge.attr("class", "badge badge-warning");
                } else if (uviVal >= 8) {
                    uviBadge.attr("class", "badge badge-danger");
                }
                uviBadge.html(uviVal)
                uvi.html('UV Index: ');
                uvi.append(uviBadge)
            }
        }
        xhttp.open("GET", uvURL, true);
        xhttp.send();
    }

    forecast();
    searchCity(cityTest);
});