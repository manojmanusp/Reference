var arrayCollection = new Array();
var arraySearchCity = new Array();
var markers = [];


$(document).ready(function () {

    $(".article").after("<div id='locationKendoGrid'></div>");
    $("#locationKendoGrid").after('<div id="gmap" style="width:800px;height:400px"></div>');
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
            var url = _spPageContextInfo.webAbsoluteUrl + "/Lists/Location/DispForm.aspx?ID=" + id + "&Lat=" + latitude + "&Long=" + longitude;
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
    for (var i = 0; i < arrayCollection.length; i++) {
        myLatlng = new google.maps.LatLng(arrayName[i].Latitude, arrayName[i].Longitude);
        marker = new google.maps.Marker({
            position: myLatlng,
            map: map
        });
        
        markers.push(marker);
       
    }

    for (var j = 0; j < markers.length; j++) {
        markers[j].setMap(map);
    }

}

function DeleteMapMarkers() {

    for (var y = 0; y < markers.length; y++) {
        markers[y].setMap(null);
    }
    markers = [];
}



