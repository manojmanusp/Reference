var map;
var getDirectionsButton;
var destinationValue;
var contentGetDir;
var infowindowGetDir;
var directionsDisplay;
var directionsService;
var destinationLatitude;
var destinationLongitude;
$(document).ready(function () {
    $(".ms-clear:last").after('<div id="gmap" style="width:800px;height:500px"></div>');
    $("#gmap").after("<div id='LatLongDiv' style='display:none'><div style='width:50%'>Latitude<p id='lat'></p></div><div style='width:50%'>Longitude<p id='long'></p></div><div>");
    JSRequest.EnsureSetup();
    window.latitudeValue = parseFloat(JSRequest.QueryString["Lat"]);
    window.longitudeValue = parseFloat(JSRequest.QueryString["Long"]);
    window.city = JSRequest.QueryString["City"];
    window.pincode = JSRequest.QueryString["Pincode"];
    window.landmark = JSRequest.QueryString["Landmark"];
    getDirectionsButton = '<span><input type="button" id="getDirectionButton" value="Get Directions"/></span';
    initialize();

    //$("#currentLoaction").live('click', function (e) {
    //    e.preventDefault();
    //    console.log("anchor click called");
    //    destinationValue = GetCurrentLocation();
    //    //return false;
    //});
});
function initialize() {
    var myLatlng = new google.maps.LatLng(latitudeValue, longitudeValue);
    var myOptions = {
        zoom: 7,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("gmap"), myOptions);
    // marker refers to a global variable

    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: city
    });

    var contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">' + landmark + '</h1>' +
        '<div id="bodyContent">' +
        '<p>' + city + '</p>' +
        '<p>' + pincode + '</p>' +
        '<p>' + getDirectionsButton + '</p>' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker, "click", function (event) {
        // get lat/lon of click

        infowindow.open(map, marker);
        directionsDisplay = new google.maps.DirectionsRenderer;
        directionsService = new google.maps.DirectionsService;
        $("[value='Get Directions']").click(function () {
            infowindow.close();
            contentGetDir = "<div class='getDirections'><p>Get Directions</p><span><a id='currentLocation' href=''>current location</a></span><div><span>Destination</span><input type='text' id='destinationText' placeholder='Enter destination' />" +
                "<input type='button' id='submitGetDir' value='Submit'/>" +
                "<div id='transportMode'><input type='radio' value='DRIVING' name='transportMode'><span id='drivingMode'>Driving</span>" +
                "<input type='radio' value='WALKING' name='transportMode'><span id='walkingMode'>Walking</span>" +
                "<input type='radio' value='TRANSIT' name='transportMode'><span id='transitMode'>Transit</span>" +
                "</div>" +
                "</div ></div ><div id='directionsSuggestions' style='width:343px'></div>";
            infowindowGetDir = new google.maps.InfoWindow({
                content: contentGetDir
            });

            infowindowGetDir.open(map, marker);
            google.maps.event.addListener(infowindowGetDir, 'closeclick', function () {

                initialize();
            });
            var destinationInput = document.getElementById('destinationText');
            new AutoCompleteControls(destinationInput);
            $("[value='Submit']").click(function () {
             
                GetDirections();
            });
            
            $("#currentLocation").click(function (e) {
                e.preventDefault();
                console.log("current location click called");
                GetCurrentLocation();
            });
        });

    });


}

function AutoCompleteControls(destinationInput) {

    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, { placeIdOnly: true });
    // this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
}

function GetDirections() {
    var deferred = $.Deferred();

    if (directionsDisplay != null) {
        directionsDisplay.setDirections({ routes: [] });
    }
    var destinationName = $("#destinationText").val();
    var geocoder = new google.maps.Geocoder();
    $.get(geocoder.geocode({ 'address': destinationName }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            destinationLatitude = results[0].geometry.location.lat();
            destinationLongitude = results[0].geometry.location.lng();
            console.log("location : " + destinationLatitude + " " + destinationLongitude);
            console.log(status);
            deferred.resolve();
        } else {
            alert("enter a valid place name");
            destinationLatitude = null;
            destinationLongitude = null;
        }
    })).then(function () {
        if ($("input[name='transportMode']:checked").val() == undefined) {
            alert("Please select Transport Mode");
        }
        if (destinationLatitude != null && destinationLongitude != null && $("input[name='transportMode']:checked").val() != undefined) {
            destinationValue = { lat: destinationLatitude, lng: destinationLongitude };
            var originValue = { lat: latitudeValue, lng: longitudeValue };
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById("directionsSuggestions"));
            $("#directionsSuggestions").css("height", "100px");
            var request = {
                destination: destinationValue,
                origin: originValue,
                travelMode: google.maps.TravelMode[$("input[name='transportMode']:checked").val()]
            };

            directionsService.route(request, function (response, status) {
                if (status == 'OK') {
                    // Display the route on the map.
                    directionsDisplay.setDirections(response);
                }
            });
        }
    }
        );

    return deferred.promise();
}



function GetCurrentLocation() {
    console.log("getcurrent location called");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    //console.log(pos);
    //return pos;
}

function showPosition(position) {
    var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    destinationValue = pos;
    codeLatLng(pos.lat, pos.lng);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results)
            if (results[1]) {
                //formatted address
                var address = results[0].formatted_address;
                console.log("address = " + address);
                $("#destinationText").val(address);
            } else {
                console.log("No results found");
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
}




