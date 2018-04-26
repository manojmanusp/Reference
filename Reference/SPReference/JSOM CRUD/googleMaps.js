var map;
$(document).ready(function () {
    $(".ms-clear:last").after('<div id="gmap" style="width:300px;height:200px"></div>');
    $("#gmap").after("<div id='LatLongDiv' style='display:none'><div style='width:50%'>Latitude<p id='lat'></p></div><div style='width:50%'>Longitude<p id='long'></p></div><div>");
    JSRequest.EnsureSetup();
    window.latitudeValue = JSRequest.QueryString["Lat"];
    window.longitudeValue = JSRequest.QueryString["Long"];
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
        map: map
    });

    google.maps.event.addListener(marker, "click", function (event) {
        // get lat/lon of click
        var clickLat = event.latLng.lat();
        var clickLon = event.latLng.lng();

        // show in input box
        $("#lat").text(clickLat.toFixed(5));
        $("#long").text(clickLon.toFixed(5));
        $("#LatLongDiv").css('display', 'block');
        //var marker = new google.maps.Marker({
        //    position: new google.maps.LatLng(clickLat, clickLon),
        //    map: map
        //});
    });
}


