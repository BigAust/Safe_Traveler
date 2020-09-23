var searchBtn = document.getElementById("search-btn");
var searchInput = document.getElementById("search-input");
var searchHistory = document.getElementById("search-history");
var display = document.querySelector(".main-container")
var tourCountry = document.querySelector("#selectCountry")
var input = document.getElementById('search-input');
//maps.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
// var autocomplete = new google.maps.places.Autocomplete(input);

// Search button function
var searchHandler = function (cityName) {
    cityName.preventDefault();
    var cityName = searchInput.value.trim();
    console.log(cityName);
    if (cityName) {
        getTourismInfo(cityName)
        getWeatherInfo(cityName);
        cityHistory(cityName);
        searchInput.value = "";
        getCountryOption();
        getStateOption();
        $("#Main-container").removeClass("hide")
        
    }
     else {
        swal("You entered an invalid city name!", "Please enter a valid one");
    }
};


var getTourismInfo = function (searchInput) {
    var accountParams = "&account=2321I3JB&token=m2u8msmg3otg23mkbqlxtkex4pjpzw58"
    //var formatImage = "&image_sizes=medium"
   
    //var text = getSelectedText('selectCountry');

    //var tourCountryName = "part_of=" + text
    //var tourState = getElementById("selectState")
    // var tourStateName = tourState.textContent.trim
    //debugger
    //var searchParams = tourCountryName + "&tag_labels=city&annotate=trigram:" + searchInput + "&trigram=>=0.3"
    var searchParams = "tag_labels=city&annotate=trigram:" + searchInput + "&trigram=>=0.3"

    var tourismApi = "https://www.triposo.com/api/20200803/location.json?" + searchParams + accountParams;

    fetch(tourismApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayTourismInfo(data);
                    //var imageCount = data.results[0].images.length
                    //console.log(imageCount)
                })
            }
        })
        
}

var displayTourismInfo = function (data) {
    console.log(data)
    //debugger
    //console.log(data.results[0].images[9].source_url)
    var cityImageSrc = data.results[0].images[0].source_url
    var cityImageDisplay = `<img src="${cityImageSrc}"/>`
    var cityImageEl = document.querySelector('#city-display')
    var cityTitle = document.querySelector('#city-title')
    var stateSubtitle = document.querySelector('#state-subtitle')
    var snippetEl = document.querySelector('#city-snippet')

    cityImageEl.innerHTML = cityImageDisplay
    cityTitle.textContent = data.results[0].name
    stateSubtitle.textContent = data.results[0].parent_id
    snippetEl.textContent = data.results[0].snippet
}




// Weather function
var getWeatherInfo = function (cityName) {

    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=f28282748979d8ef4250a43282c46535";

    fetch(weatherApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data)
                    // cityHistory(cityName);
                })
            } else {
                swal("You entered an invalid city name!", "Please enter a valid one");
            }
        })
}




// Display weather
var displayWeather = function (data) {
    var currentTemp = data.main.temp;
    console.log(currentTemp)
    var currentHumid = data.main.humidity;
    console.log(currentHumid)
    var currentWind = data.wind.speed;
    console.log(currentWind)

    var currentDate = moment().format("M/D/YYYY")
    console.log(currentDate)

    var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png' />"
    console.log(iconDisplay)

    var weatherTitle = document.getElementById("weather-title")
    var tempToday = document.querySelector("#temp-today")
    var humidToday = document.querySelector("#humid-today")
    var windToday = document.querySelector("#wind-today")
    var iconToday = document.getElementById("icon-today")

    // shows current weather
    weatherTitle.innerHTML = "Current Weather"
    iconToday.innerHTML = iconDisplay;
    tempToday.innerHTML = "Temprature: " + currentTemp;
    humidToday.innerHTML = "Humidity: " + currentHumid;
    windToday.innerHTML = "Winds: " + currentWind;
}

// Adding city search to history 
var cityHistory = function (city) {
    var historyEl = document.createElement('option');
    historyEl.setAttribute("value", city);
    historyEl.setAttribute("id", city)
    historyEl.textContent = city;
    searchHistory.append(historyEl);

    historyEl.onclick = clickCity;
}

// function to call back clickable cities from the history
var clickCity = function () {
    var cityName = this.id;
    getWeatherInfo(cityName);
}


function getCountryOption() {
    var selectElement = document.querySelector('#selectCountry');
    var output = selectElement.value;
    var CountryIndex = parseInt(output)
    getCountryCovidInfo(CountryIndex);
}

var getCountryCovidInfo = function (output) {
    fetch("https://api.covid19api.com/summary")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data.Countries[output].TotalConfirmed)
                    
                })
            }
        })
}

function getStateOption() {
    var selectElement = document.querySelector('#selectState');
    var output = selectElement.value;
    var StateIndex = parseInt(output)
    getStateCovidInfo(StateIndex);
}

var getStateCovidInfo = function (StateIndex) {
    fetch("https://coronavirus-us-api.herokuapp.com/api/state/all")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data.locations[StateIndex].latest.confirmed)
                    displayCovidInfo(data, StateIndex)
                })
            }
        })
}


function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}





searchBtn.addEventListener("click", searchHandler);
searchInput.addEventListener("keyup", function (event) {
    if (event.key === 13) {
        searchHandler(cityName)
    }
});