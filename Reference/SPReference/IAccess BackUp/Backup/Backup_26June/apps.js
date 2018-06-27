var People=[];
var groupID = "";
var curUserAccName="i:0#.f|membership|"+_spPageContextInfo.userLoginName;	
contacts_user();
var itdeskComments = "";
var itrequestStatus = "";
GetGroupID();

//loadMultipleUsers();
var headerNew=  {
    "Accept": "application/json;odata=verbose",
    "content-type": "application/json; odata=verbose",
    "X-RequestDigest": $("#__REQUESTDIGEST").val()
}

var headerUpdate = {
    "Accept": "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
    "X-HTTP-Method": "MERGE" ,
    "IF-MATCH": "*"
}

var headerGet = {
   "Accept": "application/json; odata=verbose"
} 
 
 var requestID = "";
 var commentsInfo = "";
 JSRequest.EnsureSetup();
 requestID = JSRequest.QueryString["requestID"];
 itemID = JSRequest.QueryString["itemID"];
 window.workflowInstanceID = JSRequest.QueryString["workflowInstanceForItem"];
 //var categoryColl = [{Title:"Select",ID:"Select"},{Title:"Hardware",ID:"H"},{Title:"Software",ID:"S"}];
 var categoryColl = [];
 categoryColl.push({Title:"Select",ID:"Select"});
 GetCategory();
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
    //self.Managers = [];
    self.EmployeefilterSelected = true;
    self.ManagersfilterSelected = true;
    self.querySearch = querySearch;
    self.readonly=true;
    
    self.EmployeedelayedQuerySearch = EmployeedelayedQuerySearch;
    self.ManagersdelayedQuerySearch = ManagersdelayedQuerySearch;
    self.onModelChange = onModelChange;
    self.requestfor="Self";
    self.RequestID=UniqueIDFormat(); 
    
    //Edit Request variables
    self.resubmitRequestID = requestID;
    //
    self.optCategory = [];
    
    self.category = "Select";
    self.optCategory = categoryColl ;
    
    self.arrayRelatedItems=[];
	  itemID=GetParameterValues("itemID");
		jQuery.ajax({
	        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Workflow Tasks')/items?$select=ID,Title,Status,AssignedTo/Title,AssignedTo/Id,RelatedItems,PercentComplete&$expand=AssignedTo&$filter=(AssignedTo/Id eq "+_spPageContextInfo.userId+") and Status ne 'Completed'",
	        type: "GET",
	        async: false,
	        headers: { "accept": "application/json;odata=verbose"},
	        success: function (data) {
	            if (data.d.results) {
	                $.each(data.d.results,function(key,value){
	                    relatedItemjson=JSON.parse(value.RelatedItems);
	                    if(itemID==relatedItemjson[0].ItemId)
	                    {
	                    	self.arrayRelatedItems.push({index:itemID,ID:value.ID,TaskID:value.ID});
	                    }
	                });                        
	
	            }
	        },
	        error: function (err) {
	            console.log(JSON.stringify(err));
	        }
	    });
	    
    self.validate = function(){
      if(self.RequestDetails!=undefined && self.RequestDetails.trim().length>0 && self.Managers.length>0 && self.Employee.length>0){
        var disabledElem = angular.element( document.querySelector( '#saveBtn' ) ); 
        disabledElem.removeAttr('disabled'); 
        
        var disabledElem = angular.element( document.querySelector( '#resubmitBtn' ) ); 
        disabledElem.removeAttr('disabled');  
        if(self.Employee.length>0)
        {
	        $("label.employee").css("color","rgba(0,0,0,0.38)");
	        $("label.employee").parent().find("#asterikSpan").css("color","rgba(0,0,0,0.38)");
        }
        if(self.Employee.length>0){
           $("label.manager").css("color","rgba(0,0,0,0.38)");
           $("label.manager").parent().find("#asterikSpan").css("color","rgba(0,0,0,0.38)");

        }
        
      }
      else{
        if(self.Employee.length==0)
        {  
           $("label.employee").css("color","rgb(1,130,185)");
           $("label.employee").parent().find("#asterikSpan").css("color","rgb(221, 44, 0)");
        }
        else{
           $("label.employee").css("color","rgba(0,0,0,0.38)");
           $("label.employee").parent().find("#asterikSpan").css("color","rgba(0,0,0,0.38)");
        }
        if(self.Managers.length==0)
        {
          $("label.manager").css("color","rgb(1,130,185)");
          $("label.manager").parent().find("#asterikSpan").css("color","rgb(221, 44, 0)");

        }
        else{
          $("label.manager").css("color","rgba(0,0,0,0.38)");
          $("label.manager").parent().find("#asterikSpan").css("color","rgba(0,0,0,0.38)");

        }
        var disabledElem = angular.element( document.querySelector( '#saveBtn' ) ); 
        disabledElem.attr('disabled',"disabled"); 
        
        var disabledElem = angular.element( document.querySelector( '#resubmitBtn' ) ); 
        disabledElem.attr('disabled',"disabled");  
      }
      
    } 
    setTimeout(function(){$('input[type="search"').on('blur',function(){
       
      self.validate();
    });},200);
    
    
    self.focusIn  = function()
    { 
      self.validate();
    }
    
    $('body').on("click",".md-chip-remove",function(){
        setTimeout(function(){
           self.validate();

        }, 200);
   });

    
    
    self.onrequestChange=function(){
        if(self.requestfor=="Others")
        {
            self.Employee=[];
            self.Managers=[]; 
            self.readonly=false;      
            self.validate();
        }
        else
        {
            employeeIndex = self.allContacts.findIndex(x => x.email==curUserAccName);
            managerIndex = self.allContacts.findIndex(x => x.email==getManagerFromUserProfile1(curUserAccName));
            self.Employee = [self.allContacts[employeeIndex]];
            self.Managers = [self.allContacts[managerIndex]];
            //self.Managers = [];

            self.readonly=true;
            self.validate();
        }
    }  
   $('body').on("click",".md-autocomplete-suggestions li",function(){
        setTimeout(function(){
            console.log(self.Employee)
            managerIndex = self.allContacts.findIndex(x => x.email==getManagerFromUserProfile1(self.Employee[0].email));
            if(managerIndex>=0){
            self.Managers = [self.allContacts[managerIndex]];
            
            }
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
    };
    
    
    $scope.resubmitCancelItem = function(){
        window.location.href=_spPageContextInfo.webAbsoluteUrl+"/Pages/Dashboard.aspx";
    };
        
	  

    
    $scope.resubmitItem = function(){ 
         var categoryId = GetCategoryID(self.category);
         var itemtypeWFTasks = "SP.Data.WorkflowTasksItem";
         var itemtypeITReq = getListItemType('ITRequest');
         requestUriITReq =_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('ITRequest')/items("+itemID+")";
        $.ajax(
            {
                url: requestUriITReq,
                async: false,
                type: "POST",
                data: JSON.stringify({
                    '__metadata': { 'type': itemtypeITReq },
                    'ManagerIDId': { "results": [self.Managers[0].Id] },
                    'Comments':self.RequestDetails, 
                    'CategoryId' : parseInt(categoryId)                 
                                    
                }),
                headers: headerUpdate,
                success: function (data) {
                    //showNotification();
                    //alert("Request Intialized Successfully");
                    //setTimeout(function(){
                    
                    window.location.href=_spPageContextInfo.webAbsoluteUrl+"/Pages/Dashboard.aspx"
                    //},3000);
                    
                   // self.RequestID=UniqueIDFormat();
                   // self.RequestDetails=null;
                   // self.requestfor="Self";
                   // self.focusElement=self.requestfor;
                },
                error: function (err) {
                    $scope.isClicked = false;
                    $(".load_con").hide();                        
                    showError(ErrorMessage + JSON.stringify(err));
                }
            });

         var requesterOutcome="Resubmitted";
        requestUriWFTasks = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Workflow Tasks')/items("+this.ctrl.arrayRelatedItems[0].TaskID+")",
        taskCom = $("[name='RequestDetails']").val();
        $.ajax(
            {
                url: requestUriWFTasks,
                async: false,
                type: "POST",
                data: JSON.stringify({
                    '__metadata': { 'type': itemtypeWFTasks },
                    'RequesterTaskOutcome' : requesterOutcome ,
                    'Status' : "Completed",
                    'Comments' :taskCom 
                 }),
                headers: headerUpdate,
                success: function (data) {
                   window.location.href = _spPageContextInfo.webAbsoluteUrl+"/Pages/Dashboard.aspx";
                },
                error: function (err) {
                   console.log(JSON.stringify(err));
                }
            });
        
    };
        
    $scope.saveitem = function () {
        var itemtype = getListItemType('ITRequest');
        var categoryId = GetCategoryID(self.category);
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
                    'Status': 'Not Started',
                    'CategoryId': parseInt(categoryId)                 
                }),
                headers: headerNew,
                success: function (data) {
                    showNotification();
                    //alert("Request Intialized Successfully");
                    setTimeout(function(){
                    
                    window.location.href=_spPageContextInfo.webAbsoluteUrl+"/Pages/Dashboard.aspx"
                    },3000);
                    
                   // self.RequestID=UniqueIDFormat();
                   // self.RequestDetails=null;
                   // self.requestfor="Self";
                   // self.focusElement=self.requestfor;
                },
                error: function (err) {
                    $scope.isClicked = false;
                    $(".load_con").hide();                        
                    showError(ErrorMessage + JSON.stringify(err));
                }
            });
    }
    
    
     
    
    function showNotification() {  
        var notifMsg = "Request Intialized Successfully";  
        var notifColor = "green";  
        var status = SP.UI.Status.addStatus(notifMsg);  
        SP.UI.Status.setStatusPriColor(status, notifColor);  
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



blankapp.controller("Dashboard", ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {
  $scope.addnewRequest = function()
  {
    window.location.href=_spPageContextInfo.webAbsoluteUrl+"/pages/addnewrequest.aspx";
  }
}]);



blankapp.controller("ViewDetails", ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {
  var self = this;
  $scope.controls=[];
  itemID=GetParameterValues("itemID");
     
     var itemtypeITReq = getListItemType('ITRequest');
     requestUriITReq =_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('ITRequest')/items("+itemID+")";
     $.ajax(
        {
            url: requestUriITReq,
            async: false,
            type: "GET",				                
            headers: headerGet,
            success: function (data) {
              itrequestStatus = data.d.Status;
            },
            error: function (err) {
                
            }
        });

    if(itrequestStatus.toLowerCase()!="pending with requester")
    {
      	jQuery.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Workflow Tasks')/items?$select=ID,Title,Status,AssignedTo/Title,AssignedTo/Id,RelatedItems,PercentComplete&$expand=AssignedTo&$filter=(AssignedTo/Id eq "+_spPageContextInfo.userId+") and Status ne 'Completed'",
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose"},
        success: function (data) {
            if (data.d.results) {
                $.each(data.d.results,function(key,value){
                    relatedItemjson=JSON.parse(value.RelatedItems);
                    if(itemID==relatedItemjson[0].ItemId)
                    {
                    	$scope.controls.push({index:itemID,ID:value.ID,TaskID:value.ID});
                    }
                });                        
	
	            }
	        },
	        error: function (err) {
	            console.log(JSON.stringify(err));
	        }
	      });
	
    }
	
  $scope.closePage = function(){
    window.location.href=_spPageContextInfo.webAbsoluteUrl+"/pages/dashboard.aspx";
  
  };
  
  self.onrequestApprovalChange = function(){
        if(self.requestApproval=="Approve")
        {
            
        }
        else if(self.requestApproval=="Sent Back")
        {
            
        }
        else
        {
          
        }
    }  

  

}]);

blankapp.directive('approvalform', function($mdCompiler) {
    return {
        restrict: 'E',
        scope: {
            control:'=control',
            common: '=common',
            index:'=index'
          },
        link: function(scope, element, attrs) {
            $mdCompiler.compile({
                templateUrl: _spPageContextInfo.siteServerRelativeUrl+'/siteassets/IAccess/Contents/ApprovalForm.html'
            }).then(function(compileData) {
                    compileData.link(scope);
                    element.prepend(compileData.element);
                    scope.control.validate = function(){
                       if(scope.control.ApprovalComments!=undefined && scope.control.ApprovalComments.trim().length>0 && this.requestApproval != undefined){
					        var disabledElem = angular.element( document.querySelector( '#submitBtn' ) ); 
					        disabledElem.removeAttr('disabled'); 
				    	}
						else
						{
						 var disabledElem = angular.element( document.querySelector( '#submitBtn' ) ); 
						        disabledElem.attr("disabled","disabled"); 
						}
                    }
                    
                    scope.control.closePage = function(){
                       window.location.href=_spPageContextInfo.webAbsoluteUrl+"/pages/dashboard.aspx";
                    }
                    scope.control.submitApproval=function(){
                    if($("[name='ApprovalComments']")!=undefined && $("[name='ApprovalComments']").val()!=null)
					{
					 itdeskComments = $("[name='ApprovalComments']").val();
					}
					commentsInfo = itdeskComments;
                    var itemtype = "SP.Data.WorkflowTasksItem";
                    var outcome=this.requestApproval;
                    var approvalcomments=this.ApprovalComments;
                    if(outcome==undefined)
                    outcome="Not Started";
                    if(approvalcomments==undefined)
                    approvalcomments="";
                    
						console.log("yes");
						console.log(this.TaskID);
						jQuery.ajax({
					        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Workflow Tasks')/items("+this.TaskID+")",
					        type: "POST",
					        async: false,
					        headers:headerUpdate,
					        data: JSON.stringify({
					                    '__metadata': { 'type': itemtype },
					                    'ManagerTaskOutcome':outcome ,
					                    'Comments':approvalcomments,
					                    'Status':'Completed'
					                             
					                }),
							success: function (data) {					
                				window.location.reload();
					        },
					        error: function (err) {
					            console.log(JSON.stringify(err));
					        }
					    });
					    
					     var itemtypeITReq = getListItemType('ITRequest');
				         requestUriITReq =_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('ITRequest')/items("+itemID+")";
				         $.ajax(
				            {
				                url: requestUriITReq,
				                async: false,
				                type: "GET",				                
				                headers: headerGet,
				                success: function (data) {
				                  itrequestStatus = data.d.Status;
				                },
				                error: function (err) {
				                    
				                }
				            });

                       if(itrequestStatus.toLowerCase()=="pending with itdesk")
                       {
                       $.ajax(
				            {
				                url: requestUriITReq,
				                async: false,
				                type: "POST",
				                data: JSON.stringify({
				                    '__metadata': { 'type': itemtypeITReq },
				                    'ITDeskComments' : itdeskComments             
				                                    
				                }),
				                headers: headerUpdate,
				                success: function (data) {
				                    //showNotification();
				                    //alert("Request Intialized Successfully");
				                    //setTimeout(function(){
				                    
				                    window.location.href=_spPageContextInfo.webAbsoluteUrl+"/Pages/Dashboard.aspx"
				                    //},3000);
				                    
				                   // self.RequestID=UniqueIDFormat();
				                   // self.RequestDetails=null;
				                   // self.requestfor="Self";
				                   // self.focusElement=self.requestfor;
				                },
				                error: function (err) {
				                    $scope.isClicked = false;
				                    $(".load_con").hide();                        
				                    showError(ErrorMessage + JSON.stringify(err));
				                }
				            });
				        }
				        //updateWFHistoryItem();

					} 
                               
                });              
        },         
    } 
});

function updateWFHistoryItem() {
        var currentClientContext = new SP.ClientContext.get_current();
        var currentWeb = currentClientContext.get_web();
        var list = currentWeb.get_lists().getByTitle('Workflow History'); 

var camlQuery = new SP.CamlQuery();camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'WorkflowInstance\'/>' +
                                                        '<Value Type=\'Text\'>' + workflowInstanceID + '</Value>' +
                                                 '</Eq></Where><OrderBy><FieldRef Name=\'ID\' Ascending=\'False\' /></OrderBy></Query><RowLimit>1</RowLimit>' +
                                                 '</View>');
	    
    this.listItem = list.getItems(camlQuery);
	currentClientContext.load(listItem);

        currentClientContext.executeQueryAsync(Function.createDelegate(this, function(){  var listItemEnumUpdateInProcess = listItem.getEnumerator();
     	        while (listItemEnumUpdateInProcess.moveNext()) {
     		var oListItemID =listItemEnumUpdateInProcess.get_current();
     		oListItemID.set_item('Data', commentsInfo); 
     		oListItemID.update();
     		currentClientContext.executeQueryAsync(Function.createDelegate(this, this.on_myUpdate_Success), Function.createDelegate(this, this.on_myUpdate_Failure));
     	        } }), Function.createDelegate(this, this.OnWorkFlowFailed));
}

function OnWorkFlowFailed(sender,args){
  console.log(args.get_message());
}
function on_myUpdate_Success() { 
    	         alert('Item updated!');
	}


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
    
    
    
function GetGroupID(){
      //groupID
      //var itemTemplateType = getListItemType('ITRequest');
      var Uri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getbyname('ITDesk_Members')?$select=id";
      $.ajax({
        url: Uri,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
          groupID = data.d.Id;
           
        },
        error: function (error) {
          //  alert(JSON.stringify(error));
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

function GetParameterValues(param) {  
            var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');  
            for (var i = 0; i < url.length; i++) {  
                var urlparam = url[i].split('=');  
                if (urlparam[0] == param) {  
                    return urlparam[1];  
                }  
            }  
        }  


function GetCategoryID(categoryName)
{
  var id="";
  jQuery.ajax({
	        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Category')/items?$select=ID&$filter=CategoryName eq '"+categoryName+"'",
	        type: "GET",
	        async: false,
	        headers: { "accept": "application/json;odata=verbose"},
	        success: function (data) {
	            if (data.d.results) {	                      
                  id = data.d.results[0].ID
	            }
	        },
	        error: function (err) {
             
	            console.log(JSON.stringify(err));
	        }
	        
	    });
   return id;
}

function loadMultipleUsers()
{ 
   for(var i=0;i<200;i++){
	   var tillidTitle = "Tillid"+i;
	   People.push({ Name: "murali@chennaitillidsoft.onmicrosoft.com", Id:"8", Title: tillidTitle});
   }
   
}


//Common Method Ended