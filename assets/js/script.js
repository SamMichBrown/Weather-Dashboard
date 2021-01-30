//api.openweathermap.org/data/2.5/weather?q=toronto&appid=e1ab33a195a5cb9cfe263d1ff6af4c6d

//$("button").click(function(){
    // $.ajax({url: "demo_test.txt", success: function(result){
    //     $("#div1").html(result);
    //   }});
    // });

    //var currentDate = document.getElementById("currentDay");
    //currentDay.innerHTML = currentTime;

// //$("#searchBtn").click(function(){
//     $.ajax({
//         url: "api.openweathermap.org/data/2.5/weather?q=toronto&appid=e1ab33a195a5cb9cfe263d1ff6af4c6d",
//         success: function(response){
//             console.log(response)
//         }
//     })
// })
//var date = new Date(1611284400); var dt = 1611277734 * 1000; var date = new Date(dt);


$("button").click(function(){
    var city = $("#searchCity").val();
    
    
    var history = JSON.parse(localStorage.getItem('history')) ||[];
    history.unshift(city);
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();

    getWeatherForecast(city);
   
    
})

function getWeatherForecast(city){
    
    var urlCurrent = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e1ab33a195a5cb9cfe263d1ff6af4c6d`

    fetch(urlCurrent).then(function (response) {
        return response.json();
    })
    .then(function (json) {
        $("#cityName").html(city);
        var dateTime = json.dt;
        var date = new Date(dateTime * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var dateStr = `${day}/${month}/${year}`;
        $("#cityTime").html(dateStr);
        var temperature = json.main.temp;
        $("#tempNum").html(temperature);
        var humidity = json.main.humidity;
        $("#humidNum").html(humidity);
        var windSpeed = json.wind.speed;
        $("#windNum").html(windSpeed);
        var icon = json.weather[0].icon;
        var imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
        $("#icon").attr("src", imgUrl);

        var lat = json.coord.lat;
        var lon = json.coord.lon;


        var urlWeekly = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,hourly&appid=e1ab33a195a5cb9cfe263d1ff6af4c6d`
        fetch(urlWeekly)
        .then(function (response){
            return response.json();
        }) 
        .then(function (json) {
            var list = json.daily.slice(1, 6);
            
            $('#cardRow').html('');
            for (day of list) {
                $('#cardRow').append(createForecastCard(day));
            }
        })
    });
}


function createForecastCard(day) {
  var card =  $('<div class="col-2 border"></div>');
  var dateTime = day.dt;
  var date = new Date(dateTime * 1000);
  var calDay = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var dateStr = `${calDay}/${month}/${year}`;
  var cardDate = $(`<span>${dateStr}</span>`);
  card.append(cardDate);

  var icon = day.weather[0].icon;
  var imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
  var cardIcon = $(`<img src=${imgUrl}></img>`)
  card.append(cardIcon);

  var dayTemp = day.temp.day;
  var cardTemp = $(`<div>Temp: ${dayTemp} &degC</div>`);
  card.append(cardTemp);
  var dayHumid = day.humidity;
  var cardHumid = $(`<div>Humidity: ${dayHumid} %</div>`);
  card.append(cardHumid);

  return card
}

function renderHistory() {
    var history = JSON.parse(localStorage.getItem('history')) ||[];
    $('#searchHistory').html('');
    for (let city of history) {
        var historyEntry = $(`<div class="historyCard">${city}</div>`);
        historyEntry.click(function(e){
            getWeatherForecast(city);
        })
        $('#searchHistory').append(historyEntry);
    }
    
}
renderHistory();