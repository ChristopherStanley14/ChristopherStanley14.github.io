function lookupLatLong(city, state, postalCode) {
    
    var address = "";
    if (postalCode.length != 0) { 
        address = postalCode.trim();
    }
    else if (city.length != 0 && state != 0) {
        address = city.trim() + ", " + state;
    }
    else {
        return; 
    }

    
    var googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCwyTdHnIN_Sw0vKGhH_dhb4VjI4QR2G1A";

    var request = {
        url: googleUrl,
        success: lookupLatLong_Complete
    };

    $.ajax(request);


}
function lookupWeatherForZip() {
    var postalCode = $("#postalCode").val();
    lookupLatLong("", "", postalCode);
}


function lookUpWeather_complete(request){
    
    var weatherResult = {
        currentTemp: Math.round(request.currently.temperature) + "&deg;F",
        highTemp: Math.round(request.daily.data[0].temperatureMax) + "&deg;F",
        precipProb: request.currently.precipProbability * 100 + "%",
        lowTemp: Math.round(request.daily.data[0].temperatureMin) + "&deg;F",
        weatherSummary: request.currently.summary,

    };

    var html = cardMaker(weatherResult);
    $("#cards").append(html);

};



var longName1 = "";
var longName2 = "";

function lookupLatLong_Complete(result) {
    var result = result.results["0"];
    var latitude = result.geometry.location.lat;
    var longitude = result.geometry.location.lng;
    console.log("The lat and long is " + latitude + "," + longitude);

    longName1 = result.address_components[1].long_name;
    shortName1 = result.address_components[3].short_name;


    var darkSkyUrl = "https://api.darksky.net/forecast/9082fe967f08a193dc0897d7c2043a2e/" + latitude + "," +  longitude;
    console.log(darkSkyUrl);
    var request = {
        url: darkSkyUrl,
        dataType: "jsonp",
        success: lookUpWeather_complete 
    };
    $.ajax(request);

}

function cardMaker (weatherData) {

    var template = $("#tempDiv").html();

    template = template.replace("@NAME@", longName1);
    template = template.replace("@NAME2@", shortName1);
    template = template.replace("@TEMP@", weatherData.currentTemp);
    template = template.replace("@SUMMARY@", weatherData.weatherSummary);
    template = template.replace("@MIN@", weatherData.lowTemp);
    template = template.replace("@PERCENT@", weatherData.precipProb);
    template = template.replace("@MAX@", weatherData.highTemp);

    return template; 
}


$(function () {
    $("#buttonLookUpZip").on("click", lookupWeatherForZip);
    $("#tempDiv").hide();
    $(document).on("click", "#removeB", function(){
        $(this).parent("#remove").fadeOut();
    });
});
