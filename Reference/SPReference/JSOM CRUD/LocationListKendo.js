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
                if (directionsDisplay != null) {
                    directionsDisplay.setDirections({ routes: [] });
                    // directionsDisplay.setMap(null);
                    //directionsDisplay = null;
                }
                closeLastOpenedInfoWindows();
                currentInfoWindow.open(map, currentMarker);
                $("[value='Get Directions']").click(function () {
                    currentInfoWindow.close();

                    contentGetDir = "<div><p>Get Directions</p><div><span>Destination</span><input type='text' id='destinationText' placeholder='Enter destination' />" +
                        "<input type='button' id='submitGetDir' value='Submit'/>" +
                        "</div ></div > ";
                    currentInfowindowGetDir = new google.maps.InfoWindow({
                        content: contentGetDir
                    });
                    lastOpenedInfoWindowGetDir = currentInfowindowGetDir;
                    latitudeValue = currentMarker.getPosition().lat();
                    longitudeValue = currentMarker.getPosition().lng();
                    currentInfowindowGetDir.open(map, currentMarker);
                    google.maps.event.addListener(currentInfowindowGetDir, 'closeclick', function () {

                        //  initialize(arrayName);
                    });

                    $("[value='Submit']").click(function () {

                        GetDirections();
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
        // directionsDisplay.setMap(null);
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
        if (destinationLatitude != null && destinationLongitude!=null){
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
    }
        );

    return deferred.promise();
}



