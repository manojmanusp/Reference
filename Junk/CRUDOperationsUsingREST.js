    

    $(document).ready(function () {
            $("#DeltaPlaceHolderMain").append("<div id='dataListDiv'><table id='dataListTable'></table></div>");
            getItems(siteUrl);
    });

    var siteUrl = _spPageContextInfo.webAbsoluteUrl + "_api/Web/Lists/GetByTitle('DataList')/Items?$select=*,Field_Person/Title,Field_LookUp/State&$expand=Field_LookUp,Field_Person";
    //var listData = [];

    function getItems(siteUrl)
    {
       
    $.ajax({
            
            url: siteUrl,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                console.log(data.d.results);                              
               // bindDataTable(data.d.results);
            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });

    }

    //function bindDataTable(results) {
    //    $('#dataListTable').DataTable({
    //        "aaData": results,
    //        "aoColumns": [{  
    //            "mData": "Name"  
    //        }, {  
    //            "mData": "Position"  
    //        }, {  
    //            "mData": "Office"  
    //        }, {  
    //            "mData": "Age"  
    //        }]
    //    });
    //}


    function bindDataTable(results) {
        debugger;
        var newArray = [];
        for (var i = 0; i < results.length; i++)
        {            
            //For Multi Line field Value            
            var multiLineField = '';
            if($(data.d.results[i].Field_MultiLine).length > 1)
            {
                multiLineField = $(data.d.results[i].Field_MultiLine).text();
            }
            //For Number field Value
            var numberField = results[i].Field_Number;
            var currentItem = new Array(results[i].Title, results[i].Field_SingleLine, multiLine, numberField);

            newArray.push(currentItem);
        }
            $('#dataListTable').DataTable({
                data: newArray,
                columns: [
                    { title: "Title" },
                    { title: "Field_SingleLine" },                    
                    { title: "Field_MultiLine" },
                    { title: "Field_Number" },
                    { title: "Field_Yes_x002f_No" },
                    { title: "Field_Person" },
                    { title: "Field_Date" },
                    { title: "Field_Choice" },
                    { title: "Field_Picture" },
                    { title: "Field_Currency" },
                    { title: "Field_Calculated" },
                    { title: "Field_TaskOutCome" },
                    { title: "Field_LookUp" }

                ]
            });
        }
    

    
 

    
