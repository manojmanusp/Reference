var map;
var getDirectionsButton;
var contentGetDir;
var infowindowGetDir;
var chennai = { lat: 12.975971, lng: 80.221209199999985 };
var bangalore = { lat: 12.9172, lng: 77.6228 };
var destinationLatitude;
var destinationLongitude;
$(document).ready(function () {
    $(".ms-clear:last").after('<div id="gmap" style="width:300px;height:200px"></div>');
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
        $("[value='Get Directions']").click(function () {
            infowindow.close();
            contentGetDir = "<div><p>Get Directions</p><div><span>Destination</span><input type='text' id='destinationText'/>" +
                "<input type='button' id='submitGetDir' value='Submit'/>" +
                "</div ></div > ";
            infowindowGetDir = new google.maps.InfoWindow({
                content: contentGetDir
            });
            infowindowGetDir.open(map, marker);
            $("[value='Submit']").click(function () {

                GetDirections();
            });
        });



    });
}

function GetDirections() {
    var coordinates = $("#destinationText").val();
    //var places = new google.maps.places.Autocomplete(document.getElementById('destinationText'));
    //var place = places.getPlace();
    //var address = place.formatted_address;
    //var destinationLatitude = place.geometry.location.lat();
    //var destinationLongitude = place.geometry.location.lng();

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': coordinates }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            destinationLatitude = results[0].geometry.location.lat();
            destinationLongitude = results[0].geometry.location.lng();
            //alert("location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
        } else {
            alert("Something got wrong " + status);
        }
    });

    var destinationValue = { lat: destinationLatitude, lng: destinationLongitude };
    var originValue = { lat: latitudeValue, lng: longitudeValue };
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    var request = {
        destination: destinationValue,
        origin: originValue,
        travelMode: 'DRIVING'
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        //if (status == 'OK') {
        // Display the route on the map.
        directionsDisplay.setDirections(response);
        //}
    });
}



//google.maps.event.addListener(places, 'place_changed', function () {


//});