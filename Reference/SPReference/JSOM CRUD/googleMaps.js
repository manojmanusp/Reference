var map;
var getDirectionsButton;
var contentGetDir;
var infowindowGetDir;
var directionsDisplay;
var directionsService;
//var chicagoLng = parseFloat(-87.6500523);
//var salemLng = parseFloat(-70.89671550000003);
//var chicago = { lat: 41.850033, lng: chicagoLng };
//var bangalore = { lat: 12.9172, lng: 77.6228 };
//var chennai = { lat: 12.975971, lng: 80.22120919999998 };
//var salem = { lat: 42.51954, lng: salemLng};
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
            contentGetDir = "<div><p>Get Directions</p><div><span>Destination</span><input type='text' id='destinationText' placeholder='Enter destination' />" +
                "<input type='button' id='submitGetDir' value='Submit'/>" +
                "</div ></div > ";
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
        //directionsDisplay.setMap(null);
        //directionsDisplay = null;
    }
    var coordinates = $("#destinationText").val();
    //var places = new google.maps.places.Autocomplete(document.getElementById('destinationText'));
    //var place = places.getPlace();
    //var address = place.formatted_address;
    //var destinationLatitude = place.geometry.location.lat();
    //var destinationLongitude = place.geometry.location.lng();

    var geocoder = new google.maps.Geocoder();
    $.get(geocoder.geocode({ 'address': coordinates }, function (results, status) {
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
        var destinationValue = { lat: destinationLatitude, lng: destinationLongitude };
        var originValue = { lat: latitudeValue, lng: longitudeValue };
        directionsDisplay.setMap(map);
        //var directionsDisplay = new google.maps.DirectionsRenderer({
        //    map: map
        //});

        var request = {
            destination: destinationValue,
            origin: originValue,
            travelMode: 'DRIVING'
        };
        //var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                // Display the route on the map.
                directionsDisplay.setDirections(response);
            }
        });
    }
        );

    return deferred.promise();
}


