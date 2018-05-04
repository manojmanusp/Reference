var arrayCollection = new Array();
var arraySearchCity = new Array();
var markers = [];
var infowindows = [];
var lastOpenedInfoWindow;
var lastOpenedInfoWindowGetDir;
var directionsDisplay = new google.maps.DirectionsRenderer;
var directionsService = new google.maps.DirectionsService;
var latitudeValue;
var longitudeValue;


$(document).ready(function () {

    $(".article").after("<div id='locationKendoGrid'></div>");
    $("#locationKendoGrid").after('<div id="gmap" style="width:1000px;height:500px"></div>');
    //This makes sure all necessary Js files are loaded before you call taxonomy store
    SP.SOD.executeFunc('sp.runtime.js', false, function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));//loads sp.taxonomy.js file
            SP.SOD.executeFunc('sp.taxonomy.js', false, ScriptLoaded);
            function ScriptLoaded() {
                console.log("sp.js is loaded");
                BindLocationKendoGrid();

            }
        });
    });

    $("#locationKendoGrid").before('<div id="searchControlDiv"><select id="cityDropDown" style="width:300px;"></select ><button type="button" id="btnSearch">Search</button></div>');
    $("#btnSearch").kendoButton({

        click: onSearch

    });
});


function BindLocationKendoGrid() {
    var context = new SP.ClientContext.get_current();
    var list = context.get_web().get_lists().getByTitle("Location");
    var query = new SP.CamlQuery();
    query.set_viewXml("<View>" +
        "<ViewFields><FieldRef Name='City' /><FieldRef Name='PinCode' /><FieldRef Name='Landmark' /><FieldRef Name='Latitude' /><FieldRef Name='Longitude' /></ViewFields>" +
        "</View>");
    var items = list.getItems(query);
    context.load(items);
    context.executeQueryAsync(OnQuerySuccess, OnQueryFailure);
    function OnQuerySuccess(sender, args) {

        var itemsEnumerator = items.getEnumerator();
        while (itemsEnumerator.moveNext()) {
            var currentItem = itemsEnumerator.get_current();
            var id = currentItem.get_item("ID");
            var city = currentItem.get_item("City").get_lookupValue();
            var pinCode = currentItem.get_item("PinCode");
            var landmark = currentItem.get_item("Landmark");
            var latitude = currentItem.get_item("Latitude");
            var longitude = currentItem.get_item("Longitude");
            var url = _spPageContextInfo.webAbsoluteUrl + "/Lists/Location/DispForm.aspx?ID=" + id + "&Lat=" + latitude + "&Long=" + longitude + "&City=" + city + "&Pincode=" + pinCode + "&Landmark=" + landmark;
            var array = {
                'URL': url,
                'City': city,
                'PinCode': pinCode,
                'Landmark': landmark,
                'Latitude': latitude,
                'Longitude': longitude,
                'View': 'view'
            };

            arraySearchCity.push(array.City);
            arraySearchCity = $.unique(arraySearchCity);
            arrayCollection.push(array);
        }
        $("#locationKendoGrid").kendoGrid({
            dataSource: {
                type: "odata",
                data: arrayCollection,
                pageSize: 20
            },
            filterable: true,
            height: 550,
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                {
                    field: 'URL',
                    title: "URL",
                    hidden: true,
                    width: 100
                },

                {
                    field: 'View',
                    title: "View",
                    filterable: false,
                    groupable: false,
                    sortable: false,
                    template: '<a href="#=URL#">#=View#</a>',
                    width: 20
                },
                {
                    field: 'City',
                    title: "City",
                    width: 100
                },
                {
                    field: 'PinCode',
                    title: "Pin Code",
                    width: 100
                }, {
                    field: 'Landmark',
                    title: "Landmark",
                    width: 100
                }, {
                    field: "Latitude",
                    title: "Latitude",
                    width: 100
                }, {
                    field: 'Longitude',
                    title: "Longitude",
                    width: 100
                }
            ]
        });
        $("#cityDropDown").select2({
            data: arraySearchCity
        });
        $("[data-field='View']").text("");
        intialize(arrayCollection);
    }
    function OnQueryFailure(sender, args) {
        console.log("error in inner request: " + args.get_message());
    }
}


function onSearch() {
    if (markers.length > 0) {
        DeleteMapMarkers();
    }
    var searchValue = $(".select2-selection__rendered").text();
    var grid = $("#locationKendoGrid").data("kendoGrid");
    grid.dataSource.query({
        page: 1,
        pageSize: 20,
        filter: {
            filters: [
                { field: "City", operator: "contains", value: searchValue }
            ]
        }
    });
    window.arrayMultipleLocation = arrayCollection.filter(function (item) {
        if (item.City == searchValue) { return item; }
    });

    infowindows = [];
    intialize(arrayMultipleLocation);
}



function intialize(arrayName) {

    myOptions =
        {
            zoom: 5,
            center: new google.maps.LatLng(13.0826802, 80.2707184),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    map = new google.maps.Map(document.getElementById("gmap"), myOptions);
    for (var i = 0; i < arrayName.length; i++) {
        myLatlng = new google.maps.LatLng(arrayName[i].Latitude, arrayName[i].Longitude);
        marker = new google.maps.Marker({
            position: myLatlng,
            map: map
        });

        markers.push(marker);
        var getDirectionsButton = '<span><input type="button" value="Get Directions"/></span';
        var contentString = '<div id="content">' +
            '<h1 id="firstHeading" class="firstHeading">' + arrayName[i].Landmark + '</h1>' +
            '<div id="bodyContent">' +
            '<p>' + arrayName[i].City + '</p>' +
            '<p>' + arrayName[i].PinCode + '</p>' +
            '<p>' + getDirectionsButton + '</p>' +
            '</div>' +
            '</div>';
        var latitude = parseFloat(arrayName[i].Latitude);
        var longitude = parseFloat(arrayName[i].Longitude);
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindows.push(infowindow);

    }


    for (var j = 0; j < markers.length; j++) {
        var currentMarker = markers[j];
        var currentInfoWindow = infowindows[j];


        currentMarker.setMap(map);
        google.maps.event.addListener(currentMarker, 'click', (function (currentMarker, currentInfoWindow) {
           

            return function () {
                ClearRoutes();
                closeLastOpenedInfoWindows();
                currentInfoWindow.open(map, currentMarker);
                $("[value='Get Directions']").click(function () {
                    currentInfoWindow.close();

                    contentGetDir = "<div class='getDirections'><p>Get Directions</p><span><a id='currentLocation' href=''>current location</a></span><div><span>Destination</span><input type='text' id='destinationText' placeholder='Enter destination' />" +
                        "<input type='button' id='submitGetDir' value='Submit'/>" +
                        "<div id='transportMode'><input type='radio' value='DRIVING' name='transportMode'><span id='drivingMode'>Driving</span>" +
                        "<input type='radio' value='WALKING' name='transportMode'><span id='walkingMode'>Walking</span>" +
                        "<input type='radio' value='TRANSIT' name='transportMode'><span id='transitMode'>Transit</span>" +
                        "</div>" +
                        "</div ></div ><div id='directionsSuggestions' style='width:343px'></div>";
                    currentInfowindowGetDir = new google.maps.InfoWindow({
                        content: contentGetDir
                    });
                    lastOpenedInfoWindowGetDir = currentInfowindowGetDir;
                    latitudeValue = currentMarker.getPosition().lat();
                    longitudeValue = currentMarker.getPosition().lng();
                    currentInfowindowGetDir.open(map, currentMarker);
                    google.maps.event.addListener(currentInfowindowGetDir, 'closeclick', function () {
                        ClearRoutes();
                        //closeLastOpenedInfoWindows();
                        //  initialize(arrayName);
                    });

                    $("[value='Submit']").click(function () {

                        GetDirections();
                    });
                    $("#currentLocation").click(function (e) {
                        e.preventDefault();
                        console.log("current location click called");
                        GetCurrentLocation();
                    });
                    var destinationInput = document.getElementById('destinationText');
                    new AutoCompleteControls(destinationInput);
                });


                lastOpenedInfoWindow = currentInfoWindow;

            }
        })(currentMarker, currentInfoWindow));


    }

}


function AutoCompleteControls(destinationInput) {

    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, { placeIdOnly: true });
}


function closeLastOpenedInfoWindows() {
    if (lastOpenedInfoWindow) {
        lastOpenedInfoWindow.close();
    }
    if (lastOpenedInfoWindowGetDir) {
        lastOpenedInfoWindowGetDir.close();
    }

}

function DeleteMapMarkers() {

    for (var y = 0; y < markers.length; y++) {
        markers[y].setMap(null);
    }
    markers = [];
}


function GetDirections() {
    var deferred = $.Deferred();
    if (directionsDisplay != null) {
        directionsDisplay.setDirections({ routes: [] });
        
    }
    var coordinates = $("#destinationText").val();
  

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
        if ($("input[name='transportMode']:checked").val() == undefined) {
            alert("Please select Transport Mode");
        }
        if (destinationLatitude != null && destinationLongitude != null && $("input[name='transportMode']:checked").val()!= undefined ) {
        var destinationValue = { lat: destinationLatitude, lng: destinationLongitude };
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


function ClearRoutes()
{
    if (directionsDisplay != null) {
        directionsDisplay.setDirections({ routes: [] });        
    }
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


