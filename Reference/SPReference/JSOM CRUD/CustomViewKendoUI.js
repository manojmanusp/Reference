window.pageArray = [];

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', testing);

    function testing() {
        console.log('sp.js loaded');
    }

    $("input[name='kendoJSOMButton']").after("<div id='customViewGird'></div>");

    $("input[name='kendoJSOMButton']").click(function () {
        $("#kendoGridJSOM").hide();

        CustomViewKendoGrid();
        
    });


});


function CustomViewKendoGrid() {
    //var deferred = $.Deferred();
    var context = new SP.ClientContext.get_current();
    var list = context.get_web().get_lists().getByTitle("MessageList");
    context.load(list);
    var view = list.get_views().getByTitle("CustomView");
    context.load(view);
    context.executeQueryAsync(
        function (sender, args) {
            var query = new SP.CamlQuery();
            query.set_viewXml("<View><Query>" + view.get_viewQuery() + "</Query></View>");
            var items = list.getItems(query);
            context.load(items);
            context.executeQueryAsync(
                function () {
                    var itemsEnumerator = items.getEnumerator();
                    while (itemsEnumerator.moveNext()) {
                        var currentItem = itemsEnumerator.get_current();
                        var title = currentItem.get_item("Title");
                        var contactPerson = currentItem.get_item("ContactPerson").get_lookupValue();
                        var messageDetails = $.parseHTML(currentItem.get_item("MessageDetails"))[0].innerHTML;                       
                        var dateMessage = currentItem.get_item("MessageDate");                        
                        var formatteddate = new Date(Date.parse(dateMessage)).format("MM/dd/yyyy");
                        var createdDate = currentItem.get_item("Created");
                        var formattedCreatedDate = new Date(Date.parse(createdDate)).format("MM/dd/yyyy");
                        var email = currentItem.get_item("Email");
                        var managers = currentItem.get_item("Managers")[0].get_lookupValue();
                        var status = currentItem.get_item("Status");
                        var createdBy = currentItem.get_item("Author").get_lookupValue();
                        var id = parseInt(currentItem.get_item("ID"));                        
                        var modifiedDate = currentItem.get_item("Modified");
                        var formattedModifiedDate = new Date(Date.parse(modifiedDate)).format("MM/dd/yyyy");
                        var modifiedBy = currentItem.get_item("Editor").get_lookupValue();

                        
                        var arrayJSOM = {

                            'Title': title,
                            'ContactPerson': contactPerson,
                            'MessageDetails': messageDetails,
                            'MessageDate': formatteddate,
                            'Email': email,
                            'Managers': managers,
                            'Status': status,
                            'Created': formattedCreatedDate,
                            'CreatedBy': createdBy,
                            'ID': id,
                            'Modified': formattedModifiedDate,
                            'ModifiedBy': modifiedBy

                        };
                        window.pageArray.push(arrayJSOM);

                    }



                    $("#customViewGird").kendoGrid({
                        dataSource: {
                            type: "odata",
                            data: window.pageArray,
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
                        columns: [{
                            field: 'Title',
                            title: "Title",
                            width: 100
                        },
                        {
                            field: 'ContactPerson',
                            title: "ContactPerson",
                            width: 100
                        }, {
                            field: 'MessageDetails',
                            title: "MessageDetails",
                            width: 100
                        }, {
                            field: "MessageDate",
                            title: "MessageDate",
                            template: "#= kendo.toString(kendo.parseDate(MessageDate, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
                            type: "date",
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
                        }, {
                            field: 'Created',
                            title: "Created",
                            template: "#= kendo.toString(kendo.parseDate(Created, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
                            type: "date",
                            type: "date",
                            width: 100
                        }, {
                            field: 'CreatedBy',
                            title: "CreatedBy",
                            width: 100
                        }, {
                            field: 'ID',
                            title: "ID",
                            type: "number",
                            width: 100
                        }, {
                            field: 'Modified',
                            title: "Modified",
                            template: "#= kendo.toString(kendo.parseDate(Modified, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
                            type: "date",
                            width: 100
                        }, {
                            field: 'ModifiedBy',
                            title: "ModifiedBy",
                            width: 100
                        }
                        ]
                    });
                    console.log("Custom View grid is Added");
                    $("#customViewGird").html().replace(/[\u200B]/g, '');                    
                    // deferred.resolve();
                   
                },
                function (sender, args) { console.log("error in inner request: " + args.get_message()); }
            );
        },
        function (sender, args) {
            console.log("error: " + args.get_message());
            // deferred.reject(args.get_message());
        }
    );
    //return deferred.promise();

}




function formatDate(date) {
    return kendo.toString(date, "d");
}


function CustomFilter() {
    alert("time out called");
    $("th[data-title=MessageDate]")
        .data("kendoFilterMenu")
        .form.find("button[type=submit]")
        .click(function (e) {
            alert("Hi");
            //gets filter type
            var filterType = $(this.form).find($("select[data-role=dropdownlist]")).eq(0).val();
            //if filter is "Is equal to"
            if (filterType == "eq") {
                e.preventDefault();
                //gets the datePicker input date
                var selectedDate = $(this.form).find($("input[data-role=datetimepicker]")).eq(0).val();
                //create a filter
                $("#customViewGird").data("kendoGrid").dataSource.filter({
                    field: "MessageDate",
                    //create custom filter operator
                    operator: function (fieldDate) {
                        if (fieldDate != undefined && fieldDate != null) {
                            if (!fieldDate.logic) {
                                var parsedSelectedDate = kendo.parseDate(selectedDate);
                                //parse the field date in order to ignore the time
                                var parsedFieldDate = new Date(fieldDate.getFullYear(), fieldDate.getMonth(), fieldDate.getDate());
                                var result = (parsedFieldDate.getTime() == parsedSelectedDate.getTime());

                                return result;
                            }
                        }
                    },
                    value: selectedDate
                });
                //close filter window
                $("th[data-title=MessageDate]").data("kendoFilterMenu").popup.close();
            }
            console.log("filter");
        });
}


               