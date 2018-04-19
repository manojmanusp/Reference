
var urlMessageList = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/getbytitle('MessageList')/items?$select=Title,MessageDetails,MessageDate,Email,Status,ContactPerson/Id,ContactPerson/FullName,Managers/Title,Managers/Id&$expand=ContactPerson,Managers"; // url to get selected fields from MessageList
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', testing);

    function testing() {
        console.log('sp.js loaded');
    }
    var kendoJSOMButton = '<input type="button" name="kendoJSOMButton" value="Kendo JSOM" accesskey="O" class="ms-ButtonHeightWidth" target="_self">';
    var kendoRESTButton = '<input type="button" name="kendoRESTButton" value="Kendo REST" accesskey="O" class="ms-ButtonHeightWidth" target="_self">';
    $('.ms-listviewtable').parent().append(kendoJSOMButton);
    $('.ms-listviewtable').parent().append(kendoRESTButton);

    $("input[name='kendoJSOMButton']").after("<div id='kendoGridJSOM'></div>");
    $("input[name='kendoJSOMButton']").click(function () {
        KendoGridJSOM();
    });

    
    $("input[name='kendoRESTButton']").after("<div id='kendoGridREST'></div>");
    $("input[name='kendoRESTButton']").click(function () {
        KendoGridREST();
    });
}
);



function KendoGridJSOM() {
    window.arrayJSOM = new Array();
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("MessageList");
    var query = new SP.CamlQuery();
    query.set_viewXml('<View><ViewFields><FieldRef Name=\'Title\' /><FieldRef Name=\'ContactPerson\' /><FieldRef Name=\'MessageDetails\' /><FieldRef Name=\'MessageDate\' /><FieldRef Name=\'Email\' /><FieldRef Name=\'Managers\' /><FieldRef Name=\'Status\' /></ViewFields></View>');
    itemColl = list.getItems(query);
    context.load(itemColl);
    context.executeQueryAsync(OnSuccess, OnFailure);

    function OnSuccess(sender, args) {
        var itemsEnumerator = itemColl.getEnumerator();
        while (itemsEnumerator.moveNext()) {
            var currentItem = itemsEnumerator.get_current();
            var title = currentItem.get_item("Title");
            var contactPerson = currentItem.get_item("ContactPerson").get_lookupValue();
            var messageDetails = $.parseHTML(currentItem.get_item("MessageDetails"))[0].innerText;
            var momentDate = moment(new Date(currentItem.get_item("MessageDate")));
            var dateMessage = momentDate.format("M/D/YYYY");
            var email = currentItem.get_item("Email");
            var managers = currentItem.get_item("Managers")[0].get_lookupValue();
            var status = currentItem.get_item("Status");
            arrayJSOM.push({
                'Title': title,
                'ContactPerson': contactPerson,
                'MessageDetails': messageDetails,
                'MessageDate': dateMessage,
                'Email': email,
                'Managers': managers,
                'Status': status

            });

            ///<summary>Creats a Kendo Grid for Message List</summary>
            $("#kendoGridJSOM").kendoGrid({
                dataSource: {
                    type: "odata",
                    data: arrayJSOM,
                    pageSize: 20
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
                        field: 'Title',
                        title: "Title",
                        width: 100
                    },
                    {
                        field: 'ContactPerson',
                        title: "Contact Person",
                        width: 100
                    }, {
                        field: 'MessageDetails',
                        title: "Message Details",
                        width: 100
                    }, {
                        field: 'MessageDate',
                        title: "Message Date",
                        width: 100
                    }, {
                        field: 'Email',
                        title: "Email",
                        width: 100
                    }, {
                        field: 'Managers',
                        title: "Managers",
                        width: 100
                    }, {
                        field: 'Status',
                        title: "Status",
                        width: 100
                    }
                ]
            });
        }
        KendoGridJSOM();
    }
    function OnFailure(sender, args) {
        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());

    }
}

function KendoGridREST() {

    window.arrayMessageListItems = new Array();
    // window.arrayPieChart = new Array();
    $.ajax({
        url: urlMessageList,
        type: "GET", //Specifies the operation to create the list item
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {

            for (var i = 0; i < data.d.results.length; i++) {
                if (data.d.results[i].Title != undefined) {
                    var title = data.d.results[i].Title;
                }
                else { title = ""; }
                if (data.d.results[i].ContactPerson.FullName != undefined) {
                    var contactPerson = data.d.results[i].ContactPerson.FullName;
                }
                else { contactPerson = "(None)"; }
                if (data.d.results[i].MessageDetails != undefined) {
                    var messageDetails = $.parseHTML(data.d.results[i].MessageDetails)[0].innerText;
                }
                else { messageDetails = ""; }

                momentDate = moment(new Date(data.d.results[i].MessageDate));
                var dateMessage = momentDate.format("M/D/YYYY");
                if (data.d.results[i].Email != undefined) {
                    var email = data.d.results[i].Email;
                }
                else { email = ""; }
                if (data.d.results[i].Managers.results != undefined) {
                    var managers = data.d.results[i].Managers.results[0].Title;
                }
                else { managers = ""; }
                if (data.d.results[i].Status != undefined) {
                    var status = data.d.results[i].Status;
                }
                else { status = "Pending"; }

                arrayMessageListItems.push({
                    'Title': title,
                    'ContactPerson': contactPerson,
                    'MessageDetails': messageDetails,
                    'MessageDate': dateMessage == "Invalid date" ? null : dateMessage,
                    'Email': email,
                    'Managers': managers,
                    'Status': status
                });


                ///<summary>Creats a Kendo Grid for Message List</summary>
                $("#kendoGridREST").kendoGrid({
                    dataSource: {
                        type: "odata",
                        data: arrayMessageListItems,
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
                            field: 'Title',
                            title: "Title",
                            width: 100
                        }, {
                            field: 'ContactPerson',
                            title: "Contact Person",
                            width: 100
                        }, {
                            field: 'MessageDetails',
                            title: "Message Details",
                            width: 100
                        }, {
                            field: 'MessageDate',
                            title: "Message Date",
                            width: 100
                        }, {
                            field: 'Email',
                            title: "Email",
                            width: 100
                        }, {
                            field: 'Managers',
                            title: "Managers",
                            width: 100
                        }, {
                            field: 'Status',
                            title: "Status",
                            width: 100
                        }
                    ]
                });
            }


        },
        error: function (error) {

            alert(JSON.stringify(error));
        }

    });

}


