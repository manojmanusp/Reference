var People=[];
var curUserAccName="i:0#.f|membership|"+_spPageContextInfo.userLoginName;	
contacts_user();
var headerNew=  {
    "Accept": "application/json;odata=verbose",
    "content-type": "application/json; odata=verbose",
    "X-RequestDigest": $("#__REQUESTDIGEST").val()
}
var blankapp = angular.module('BlankApp', ['ngMaterial', 'ngMdIcons', 'ngMessages','peoplePickerCombo']);
blankapp.controller("NewRequest", ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {
    var self = this;
    var pendingSearch, cancelSearch = angular.noop;
    var lastSearch;
    self.allContacts = loadContacts();
    employeeIndex = self.allContacts.findIndex(x => x.email==curUserAccName);
    managerIndex = self.allContacts.findIndex(x => x.email==getManagerFromUserProfile1(curUserAccName));
    self.Employee = [self.allContacts[employeeIndex]];
    self.Managers = [self.allContacts[managerIndex]];
    self.EmployeefilterSelected = true;
    self.ManagersfilterSelected = true;
    self.querySearch = querySearch;
    self.readonly=true;
    self.EmployeedelayedQuerySearch = EmployeedelayedQuerySearch;
    self.ManagersdelayedQuerySearch = ManagersdelayedQuerySearch;
    self.onModelChange = onModelChange;
    self.requestfor="Self";
    self.RequestID=UniqueIDFormat();  
    self.onrequestChange=function(){
        if(self.requestfor=="Others")
        {
            self.Employee=[];
            self.Managers=[]; 
            self.readonly=false;       
        }
        else
        {
            employeeIndex = self.allContacts.findIndex(x => x.email==curUserAccName);
            managerIndex = self.allContacts.findIndex(x => x.email==getManagerFromUserProfile1(curUserAccName));
            self.Employee = [self.allContacts[employeeIndex]];
            self.Managers = [self.allContacts[managerIndex]];
            self.readonly=true;
        }
    }  
   $('body').on("click",".md-autocomplete-suggestions li",function(){
        setTimeout(function(){
            console.log(self.Employee)
            managerIndex = self.allContacts.findIndex(x => x.email==getManagerFromUserProfile1(self.Employee[0].email));
            if(managerIndex>=0)
            self.Managers = [self.allContacts[managerIndex]];
            else
            self.Managers = [];

        }, 200);
   });
   $('md-chips').on("click","button",function(){
        self.Managers=[];
    });

    $scope.$mdContactChipsCtrl  =function(){
        console.log("yes");
        console.log(self.Employee);
    }
    $scope.goBack=function () {
            window.location.href = _spPageContextInfo.webAbsoluteUrl+"/Pages/Client.aspx"
    };
    $scope.cancelitem = function () {
        window.location.reload();
    }
    $scope.saveitem = function () {
        var itemtype = getListItemType('ITRequest');
        requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('ITRequest')/items";
        $.ajax(
            {
                url: requestUri,
                async: false,
                type: "POST",
                data: JSON.stringify({
                    '__metadata': { 'type': itemtype },
                    'RequestFor': self.requestfor,
                    'RequestID': self.RequestID,
                    'RequesterIDId': self.Employee[0].Id,
                    'ManagerIDId': { "results": [self.Managers[0].Id] },
                    'Comments':self.RequestDetails,                   
                    'Status': 'Not Started'
                }),
                headers: headerNew,
                success: function (data) {
                    alert("Request Intialized Successfully");
                    self.requestfor="Self"
                    self.RequestID=UniqueIDFormat();
                    self.RequestDetails="";
                },
                error: function (err) {
                    $scope.isClicked = false;
                    $(".load_con").hide();                        
                    showError(ErrorMessage + JSON.stringify(err));
                }
            });
    }
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

function UniqueIDFormat() {
    var dt = new Date();
    var time = "IAccessReqID" + dt.getDate() + "" + dt.getFullYear() + "" + dt.getHours() + "" + dt.getMinutes()+dt.getSeconds();
    return time;
}
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
function getManagerFromUserProfile1(curUserAccName) {
    curUserAccName = encodeURIComponent(curUserAccName);          
    var requestHeaders = {
        "Accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    };
    var urlValue = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Manager')?@v='" + curUserAccName+"'";
    tempManager="";
    $.ajax({        
        url: urlValue,
        type: "GET",
        data: {},
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: function (data) {
            if (data.d.GetUserProfilePropertyFor != null && data.d.GetUserProfilePropertyFor != "") {
              
                tempManager= data.d.GetUserProfilePropertyFor;     
      
            }
            else {
               
            }
        },
        error: function (jqxr, errorCode, errorThrown) {
          console.log("error while getting manager using user");
        
        }

    });
    return tempManager;
}
function getListItemType(name) {
    return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
}



//Common Method Ended