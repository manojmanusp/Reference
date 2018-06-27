var People=[];
contacts_user();
var headerNew=  {
    "Accept": "application/json;odata=verbose",
    "content-type": "application/json; odata=verbose",
    "X-RequestDigest": $("#__REQUESTDIGEST").val()
}
var categoryColl = [];
 categoryColl.push({Title:"Select",ID:"Select"});
 GetCategory();

blankapp.controller('mycontrol', ['$scope', '$timeout', '$q', function($scope, $timeout, $q) {
    var self = this;
    var pendingSearch, cancelSearch = angular.noop;
    var lastSearch;
    self.allContacts = loadContacts();
    self.Employee = [];
    self.Managers = [];
    self.status=[];
    self.optCategory = [];    
    self.category = "Select";
    self.optCategory = categoryColl ;

    var statuscol=[{Title:"Select",ID:"Select"},{Title:"Not Started",ID:"Not Started"},{Title:"Pending with Requester",ID:"Pending with Requester"},{Title:"Pending with Manager",ID:"Pending with Manager"},{Title:"Pending with ITDesk",ID:"Pending with ITDesk"},{Title:"Approved",ID:"Approved"},{Title:"Canceled",ID:"Canceled"}];

    self.status=statuscol;
    self.reqstatus="Select"
    self.EmployeefilterSelected = true;
    self.ManagersfilterSelected = true;
    self.querySearch = querySearch;   
    self.EmployeedelayedQuerySearch = EmployeedelayedQuerySearch;
    self.ManagersdelayedQuerySearch = ManagersdelayedQuerySearch;
    self.onModelChange = onModelChange;
    self.searchitem1=function(){
        $("#searchTableWrapper").html("");
        $("#searchTableWrapper").append('<table id="searchTable" class="display" style="width:100%"></table>');
        var employee=self.Employee;
        var manager=self.Managers;
        var status=self.reqstatus;
        var category = self.category;
        var fromDate=self.fromDate;
        if(fromDate!==null && fromDate!=undefined)
        fromDate=moment(fromDate).format("YYYY-MM-DD") + "T00:00:00";
        var toDate=self.toDate;
        if(toDate!==null && toDate!=undefined)
        toDate=moment(toDate).format("YYYY-MM-DD")+ "T00:00:00";
        var filter="";
        if(employee.length!=0)
        filter+="and (RequesterID/Id eq '"+employee[0].Id+"')"
        if(manager.length!=0)
        filter+="and (ManagerID/Id eq '"+manager[0].Id+"')"
        if(fromDate!==null && fromDate!=undefined)
        filter+="and (Created ge '"+fromDate+"')"
        if(toDate!==null && toDate!=undefined)
        filter+="and (Created le '"+toDate+"')"
        if(status!=""&&status!="Select")
        filter+="and (Status eq '"+status+"')"
        if(category!=""&&category!="Select")
        filter+="and (Category/CategoryName eq '"+category+"')"


        filter=filter.substr(4);

        var dataSet1 =[];
        jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('ITRequest')/items?$select=NewRequestApproval,ID,Category/CategoryName,Created,RequesterID/Title,RequesterID/Id,ManagerID/Title,ManagerID/Id,Comments,Status,RequestID&$expand=Category,RequesterID,ManagerID&$filter="+filter,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose"},
            success: function (data) {
                if (data.d.results) {
                    $.each(data.d.results,function(key,value){
                        var temp=[];
                        var WorkflowInstanceName="";
                        if(value.NewRequestApproval!=undefined)
                        WorkflowInstanceName=getParameterByName("WorkflowInstanceName",value.NewRequestApproval.Url)
                        temp.push(value.RequestID);
                        var date = new Date(value.Created)
		                var dateVariable = date;
	                    dateOccured = FormatDate(dateVariable);

                        temp.push(dateOccured);
                        if(value.RequesterID!=undefined)
                        temp.push(value.RequesterID.Title);
                        else
                        temp.push(null)                        
                        if(value.ManagerID.results!=undefined)
                        temp.push(value.ManagerID.results[0].Title);
                        else
                        temp.push(null)
                        temp.push(value.Status);
                        temp.push(value.Comments);                        
                        temp.push('<a href="/sites/oct9_QA1/IAccess/Pages/ViewDetails.aspx?itemID='+value.ID+'&workflowInstanceForItem='+WorkflowInstanceName+'" target="_blank" >View</a>')
                        dataSet1.push(temp);
                    });                        

                }
            },
            error: function (err) {
                showError(ErrorMessage+ JSON.stringify(err));
            }
        });
        $('#searchTable').DataTable( {
            data: dataSet1,
           
            columns: [
                    { title: "Request ID","targets": [0], "visible": true, "width": "14%" },
                    { title: "Requested Date","targets": [1],"className": "dt-center", "visible": true, "width": "14%" },
                    { title: "Requestor", "targets": [2], "width": "14%" },
                    { title: "Manager","targets": [3], "visible": true, "width": "14%" },
                    { title: "Status" ,"targets": [4], "visible": true, "width": "14%" },
                    { title: "Comments","targets": [5], "visible": true, "width": "14%" },
                    { title: "Actions","targets": [6],"className": "dt-center", "visible": true, "width": "14%" }

                ]

        } );
        $(".sorting_asc").removeClass('sorting_asc').addClass('sorting');
    };
    function querySearch (criteria) {
        return criteria ? self.allContacts.filter(createFilterFor(criteria)) : [];
    }						
    function EmployeedelayedQuerySearch(criteria) {
        if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();
            return pendingSearch = $q(function(resolve, reject) {
            cancelSearch = reject;
            $timeout(function() {
                resolve( self.querySearch(criteria) );
                refreshDebounce();
            }, Math.random() * 500, true);
            });
        }
        return pendingSearch;
    }
    function ManagersdelayedQuerySearch(criteria) {
        if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();
            return pendingSearch = $q(function(resolve, reject) {
            cancelSearch = reject;
            $timeout(function() {
                resolve( self.querySearch(criteria) );
                refreshDebounce();
            }, Math.random() * 500, true);
            });
        }
        return pendingSearch;
    }
    function refreshDebounce() {
        lastSearch = 0;
        pendingSearch = null;
        cancelSearch = angular.noop;
    }
    function debounceSearch() {
        var now = new Date().getMilliseconds();
        lastSearch = lastSearch || now;
        return ((now - lastSearch) < 300);
    }
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);
        };
    }
    function onModelChange(model) {
        alert('The model has changed');
    }
    function loadContacts() {
        var contacts =People;
        return contacts.map(function (c, index) {
        var contact = {
            name: c.Title,
            email: c.Name,
            Id:c.Id,
        };
        contact._lowername = contact.name.toLowerCase();
        return contact;
      });
    }
}]);
function contacts_user() {
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers";
    jQuery.ajax({
        url: requestUri,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            if (data.d.results) {
                if (data.d.results.length > 0) {
                    for (var i = 0; i < data.d.results.length; i++) {
                        if (data.d.results[i].Email != "" )
                            People.push({ Name: data.d.results[i].LoginName, Id: data.d.results[i].Id, Title: data.d.results[i].Title });
                    }
                }
            }
        },
        error: function (err) {
            showError("Invoice Project Name DropDown Method Error Occured:" + JSON.stringify(err));
        }
    });
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function GetCategory(){
       jQuery.ajax({
	        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Category')/items?$select=CategoryName",
	        type: "GET",
	        async: false,
	        headers: { "accept": "application/json;odata=verbose"},
	        success: function (data) {
	            if (data.d.results) {
	                      
                  for(var i=0;i<data.d.results.length;i++){               
	               categoryColl.push({Title:data.d.results[i].CategoryName,ID:data.d.results[i].CategoryName});
                    }
	            }
	        },
	        error: function (err) {
                 
	            console.log(JSON.stringify(err));
	        }
	    });

      
    }
    
    
 function FormatDate(dateVariable) {

        var month = dateVariable.getMonth() + 1;
        var date = dateVariable.getDate();
        var fullYear = dateVariable.getFullYear();
        var hours = dateVariable.getHours();
        var minutes = dateVariable.getMinutes();
        var date_value = month + "/" + date + "/" + fullYear + " " + hours + ":" + minutes;
        var months = new Array(12);
        months[0] = "Jan";
        months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
        months[7] = "Aug";
        months[8] = "Sep";
        months[9] = "Oct";
        months[10] = "Nov";
        months[11] = "Dec";
        var current_date = new Date(date_value);
        month_value = current_date.getMonth();
        day_value = current_date.getDate();
        if (day_value < 10) {
            day_value = '0' + day_value;
        }

        var twoDigitsCurrentYear = parseInt(new Date().getFullYear().toString().substr(2, 2));
        var time = current_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        return formattedDate = months[month_value] + " " + day_value + " " + twoDigitsCurrentYear + " " + time;
    }