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
    const currentDate = moment(new Date()).format("MM/DD/YYYY");
    let history = JSON.parse(localStorage.getItem("search")) || [];
    console.log(history);
    let forecastEl;
    let forecastTempIcon;
    let forecastTempVal;
    let forecastHumidVal;


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

                lat = data.coord.lat;
                long = data.coord.lon;

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
                    forecastEl = $(`<p id="${i}"></p>`);
                    forecastEl.attr("class", "mt-3 mb-0 date");
                    forecastEl.html(dates[i]);
                    forecastCards[i].append(forecastEl[0]);
                    forecastTempIcon = $(`<img id="img${i}">`);
                    let forecastIcon = data.daily[i].weather[0].icon;
                    forecastTempIcon.attr("src", `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`);
                    console.log(forecastTempIcon[0]);
                    forecastCards[i].append(forecastTempIcon[0]);
                    forecastTempVal = $(`<p id="temp${i}"></p>`);
                    forecastTempVal.html('Temp: ' + tempConverter(data.daily[i].temp.day) + " &#176F");
                    forecastCards[i].append(forecastTempVal[0]);
                    forecastHumidVal = $(`<p id="humid${i}"></p>`);
                    forecastHumidVal.html('Humidity: ' + data.daily[i].humidity + "%");
                    forecastCards[i].append(forecastHumidVal[0]);
                }
            }
        }
        xhttp.open("GET", uvURL, true);
        xhttp.send();
    }

    searchBtn.click(function() {
        const city = inputCity.val();
        var inputBool = true;
        while (inputBool) {
            if (city.length == 0) {
                alert("Please Enter a Message!");
                return true
            } else {
                inputBool = false
            }
        }
        searchCity(city);
        for (let i = 0; i < 5; i++) {
            let forecastElRem = $(`#${i}`)
            forecastElRem.remove();
            let iconRem = $(`#img${i}`);
            iconRem.remove();
            let tempRem = $(`#temp${i}`)
            tempRem.remove();
            let humidRem = $(`#humid${i}`)
            humidRem.remove();
        }
        history.push(city);
        localStorage.setItem("search", JSON.stringify(history));
        displayHistory();
        if(history.length >= 10) {
            history.splice(0, 1)
        }
    })
    

    function displayHistory() {
        srchHistory.html("");
        for (let i = 0; i < history.length; i++) {
            const historyEL = $('<input></input>');

            historyEL.attr("type", "text");
            historyEL.attr("readonly", true);
            historyEL.attr("class", "form-control d-block bg-white");
            historyEL.attr("value", history[i]);
            historyEL.click(function() {
                for (let i = 0; i < 5; i++) {
                    let forecastElRem = $(`#${i}`)
                    forecastElRem.remove();
                    let iconRem = $(`#img${i}`);
                    iconRem.remove();
                    let tempRem = $(`#temp${i}`)
                    tempRem.remove();
                    let humidRem = $(`#humid${i}`)
                    humidRem.remove();
                }
                searchCity(historyEL.val());
                if(history.length >= 10) {
                    history.splice(0, 1)
                }
            })
            srchHistory.append(historyEL);
        }
    }

    displayHistory();
    if (history.length > 0) {
        searchCity(history[history.length - 1]);
    }
    if(history.length >= 10) {
        history.splice(0, 1)
    }

});