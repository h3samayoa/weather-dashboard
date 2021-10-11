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
    const currentDate = moment(new Date()).format("MM/DD/YYYY")


    function tempConverter(temp) {
        return Math.floor((temp - 273.15) * 1.8 + 32)
    }

    function fiveForecast() {
        var dates = [];
        const currentMoment = moment().add(1, 'days');
        const endMoment = moment().add(6, 'days');
        while (currentMoment.isBefore(endMoment, 'day')) {
            let loop = currentMoment.format("MM/DD/YYYY")
            dates.push(loop)
            currentMoment.add(1, 'days');
        }

        return dates
    }
    const dates = fiveForecast();

    function searchCity(city) {
        let searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log(data)

                cityName.html(data.name + " " + currentDate);
                console.log(data.name)
                
                let weatherIcon = data.weather[0].icon;

                weatherPic.attr("src", `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`)

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
                
                let uviBadge =  $("<span></span>");
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
                const forecastCards = $('[id=forecast]')
                for (let i = 0; i < forecastCards.length; i++) {
                    let forecastEl = $('<p></p>');
                    forecastEl.attr("class", "mt-3 mb-0 date");
                    forecastEl.html(dates[i]);
                    forecastCards[i].append(forecastEl[0]);
                    const forecastTempIcon = $('<img>');
                    let forecastIcon = data.daily[i].weather[0].icon;
                    forecastTempIcon.attr("src", `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`);
                    console.log(forecastTempIcon[0]);
                    forecastCards[i].append(forecastTempIcon[0]);
                    let forecastTempVal = $('<p></p>');
                    forecastTempVal.html('Temp: ' + tempConverter(data.daily[i].temp.day) + " &#176F");
                    forecastCards[i].append(forecastTempVal[0]);
                    let forecastHumidVal = $('<p></p>');
                    forecastHumidVal.html('Humidity: ' + data.daily[i].humidity + "%");
                    forecastCards[i].append(forecastHumidVal[0])
                }
            }
        }
        xhttp.open("GET", uvURL, true);
        xhttp.send();
    }

    forecast();
    searchCity(cityTest);
});