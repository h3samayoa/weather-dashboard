$(document).ready(function() {
    const inputCity = $('#citySrch');
    const searchBtn = $('#searchBtn');
    const cityName = $('#city-name');
    const currentPic = $('#currentPic');
    const temp = $('#temp');
    const humid = $('#humid');
    const windSpd = $('#windSpd');
    const uvi = $('#uvi');
    const srchHistory = $('#history');
    const cityTest = 'London';
    const apiKey = '81c2df482de1c0b8aacf94a4b39b0770';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityTest}&appid=${apiKey}`;


    function searchCity(city) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                console.log(data)

                
            }
        }
        xhttp.open("GET", apiUrl, true);
        xhttp.send();
    }

    searchCity(cityTest);
});