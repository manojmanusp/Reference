
var momentDate = "";
var urlUsersAndGroups = _spPageContextInfo.webAbsoluteUrl + "/_api/web/RoleAssignments/Groups?$expand=Users";  // url to get all users and groups from a site
var urlStatus = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/getbytitle('MessageList')/items?$select=Status"; // url to get Status field from MessageList
$(document).ready(function () {

    // Load google charts
    $('.ms-listviewtable').parent().append('<div id="piechart"></div>');
    $('#piechart').after('<div id="grid"></div>');
    $('#grid').after('<div id="gridMessageList"></div>');

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    DrawPieAndKendoUI();

});
// Draw the chart and set the chart values
function drawChart() {
    ///<summary>Creats a google pie chart based on values of Status field of Message List</summary>
    var data = google.visualization.arrayToDataTable([
        ['Task', ''],
        ['Sent', window.ArraySent],
        ['Pending', window.ArrayPending],
        ['Cancel', window.ArrayCancel]

    ]);

    // Optional; add a title and set the width and height of the chart
    var options = { 'title': 'Status Pie Chart', 'width': 550, 'height': 400 };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}

function DrawPieAndKendoUI() {
    ///<summary>Create Google pie chart and Kendo Grid UI</summary>
  
    window.arrayPieChart = new Array();
    $.ajax({
        url: urlStatus,
        type: "GET", //Specifies the operation to create the list item
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {

            for (var i = 0; i < data.d.results.length; i++) {
                
                if (data.d.results[i].Status != undefined) {
                    var status = data.d.results[i].Status;
                }
                else { status = "Pending"; }

                arrayPieChart.push({
                    'Status': status
                });

            }

            window.ArraySent = window.arrayPieChart.filter(function (item) {
                if (item.Status == "Sent") return item.Status;
            }).length;
            window.ArrayPending = window.arrayPieChart.filter(function (item) {
                if (item.Status == "Pending") return item.Status;
            }).length;
            window.ArrayCancel = window.arrayPieChart.filter(function (item) {
                if (item.Status == "Cancel") return item.Status;
            }).length;
            GetUsersAndGroups();

        },
        error: function (error) {

            alert(JSON.stringify(error));
        }

    });

}

function GetUsersAndGroups() {
    ///<summary>Get all users and it's groups in a site</summary>
    window.users = [];
    $.ajax({
        url: urlUsersAndGroups,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {

            for (var i = 0; i < data.d.results.length; i++) {

                for (var j = 0; j < data.d.results[i].Users.results.length; j++) {
                    if (data.d.results[i].Users.results.length > 0) {
                        var groupName = data.d.results[i].Title;
                        var userName = data.d.results[i].Users.results[j].Title;
                        var userEmail = data.d.results[i].Users.results[j].Email;
                        window.users.push({
                            'GroupName': groupName,
                            'UserName': userName,
                            'UserEmail': userEmail
                        });
                    }
                }
            }
            ApplyKendoGrid();

        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}

function ApplyKendoGrid() {
    ///<summary>Creats a Kendo Grid for all users and groups</summary>

    $("#grid").kendoGrid({
        dataSource: {
            type: "odata",
            data: window.users,
            pageSize: 5
        },
        height: 550,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [/*{*/
            //template: "<div class='customer-photo'" +
            //"style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
            //"<div class='customer-name'>#: ContactName #</div>",
            //field: "ContactName",
            //title: "Contact Name",
            //width: 240
        /*},*/ {
                field: 'GroupName',
                title: "Group Name",
                width: 100
            }, {
                field: 'UserName',
                title: "User Name",
                width: 100
            }, {
                field: 'UserEmail',
                title: "User Email",
                width: 100
            }]
    });
}





