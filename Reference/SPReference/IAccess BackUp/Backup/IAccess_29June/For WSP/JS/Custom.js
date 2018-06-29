

// Run your custom code when the DOM is ready.
$(document).ready(function () {

    // Specify the unique ID of the DOM element where the
    // picker will render.
    initializePeoplePicker('pplEmployee');
    initializePeoplePicker('pplManagers');
    if ($("#radioGroup input[type='radio']:checked").attr("id").toLowerCase() == "radioself") {
        AddUserToPeoplePicker();
        PopulatePeoplePicker("pplEmployee");
        

    }
    

    $('.radio').change(function (e) {
        e.stopImmediatePropagation(); 
        RemoveUsersFromPeoplePicker("pplEmployee");
        RemoveUsersFromPeoplePicker("pplManagers");
        if ($(this).val() == "Self") {
            
            AddUserToPeoplePicker();
            PopulatePeoplePicker("pplEmployee");           

        }
        
    });

   $("#submitForm").click(function(){
       var loginName = JSON.parse($("#pplEmployee_TopSpan_HiddenInput").attr("value"))[0].Key;
       var userID="";
       getUserId(loginName).then(function(result) {
            userID = result;
            GetRequestID(userID);
        });
      
       
   });
   $("#cancelSubmission").click(function(){
       window.location.href = _spPageContextInfo.webAbsoluteUrl+"/Pages/newrequest.aspx";
   });
   
   $(".heading_title").text($(document).find("title").text().trim());
   $("#submitForm").attr("disabled","disabled");
   $("#submitForm").css({"color": "rgba(0,0,0,0.38)"});
   
   
   $("#pplEmployee input:last").blur(function(){
        FormFieldsValidation();
   });
   
   $("#pplManagers input:last").blur(function(){
       FormFieldsValidation();
   });

});

$(window).on("load", function () {
    //$('.sp-peoplepicker-editorInput').on('change', function () {
    //    if ($(this).attr("id").toLowerCase().indexOf("pplemployee") >= 0) {
    //        PopulatePeoplePicker();
    //    }
    //});
    
    $("#leftContainer .sp-peoplepicker-topLevel").addClass("inputCtrlClass");
   
    this.SPClientPeoplePicker.SPClientPeoplePickerDict.pplEmployee_TopSpan.OnUserResolvedClientScript = function (peoplePickerId, selectedUsersInfo) {
        
        if ($("#radioGroup input[type='radio']:checked").attr("id").toLowerCase() == "radioothers") {
        console.log("pplEmployee reslove is called");
            
             var curUserJSON = JSON.parse($("#pplEmployee_TopSpan_HiddenInput").attr("value"));

            if(curUserJSON[0] != undefined && curUserJSON[0].Key != "") 
            {
            PopulatePeoplePicker("pplEmployee");
            var spclientPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplEmployee_TopSpan"];
    	    spclientPeoplePicker.SetEnabledState(false);
    	    $("#pplEmployee a").click(function() {
              var spclientPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplEmployee_TopSpan"];
    	      spclientPeoplePicker.SetEnabledState(true);
              RemoveUsersFromPeoplePicker("pplManagers");
              FormFieldsValidation();

             });

    	   }
        }
        FormFieldsValidation();
    };
      
     this.SPClientPeoplePicker.SPClientPeoplePickerDict.pplManagers_TopSpan.OnUserResolvedClientScript = function (peoplePickerId, selectedUsersInfo) { 
     
              console.log("pplManagers reslove is called");
	          var spclientPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplManagers_TopSpan"];
	    	      spclientPeoplePicker.SetEnabledState(false);

	            $("#pplManagers a").click(function() {
	              var spclientPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplManagers_TopSpan"];
	    	      spclientPeoplePicker.SetEnabledState(true);
	              FormFieldsValidation();
	             });
        FormFieldsValidation();
	         
	   };   
	   
	  

   	 	
	   $("#txtRequestDetails").blur(function(){
	              FormFieldsValidation();              
			     
			   });	   
	   
});


// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId) {

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    if (peoplePickerElementId.toLowerCase() == "pplemployee") {
        schema['AllowMultipleValues'] = false;
    }
    else{
        schema['AllowMultipleValues'] = true;
    }
    
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '280px';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}
//$(".pplEmployee").spPeoplePicker(null, null);
// Query the picker for user information.
function getUserInfo() {

    // Get the people picker object from the page.
    var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

    // Get information about all users.
    var users = peoplePicker.GetAllUserInfo();
    var userInfo = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        for (var userProperty in user) { 
            userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
        }
    }
    $('#resolvedUsers').html(userInfo);

    // Get user keys.
    var keys = peoplePicker.GetAllUserKeys();
    $('#userKeys').html(keys);

    // Get the first user's ID by using the login name.
    getUserId(users[0].Key);
}

// Get the user ID.
function getUserId(loginName) {
    var deferred = $.Deferred();
    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);
    context.executeQueryAsync(function ensureUserSuccess() {
								    console.log(user.get_id());
								    deferred.resolve(user.get_id());
								},

								function onFail(sender, args) {
								    console.log('Query failed. Error: ' + args.get_message());
								    deferred.reject(args.get_message());
								
								} );
                                
    return deferred.promise();
}


function getManagerFromUserProfile(curUserAccName) {
    curUserAccName = encodeURIComponent(curUserAccName);          
    var requestHeaders = {
        "Accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    };
    var urlValue = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Manager')?@v='" + curUserAccName+"'";
    $.ajax({        
        url: urlValue,
        type: "GET", 
        data: {},
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: function (data) {
            if (data.d.GetUserProfilePropertyFor != null && data.d.GetUserProfilePropertyFor != "") {
               
               var managerLogin = data.d.GetUserProfilePropertyFor;
               var managerEmail = managerLogin.split('|')[2];
               var userField = $("input[class='sp-peoplepicker-editorInput']").get(1);
               var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(userField);
               peoplepicker.AddUserKeys(managerEmail);
        
            }
            else {
               
            }
        },
        error: function (jqxr, errorCode, errorThrown) {
          console.log("error while getting manager using user");
        
        }
    });
}


function AddUserToPeoplePicker()
{
    var userField = $("input[class='sp-peoplepicker-editorInput']").get(0); // simplified user control search, real word scenario, first search proper row in your form
    var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(userField);
    peoplepicker.AddUserKeys(_spPageContextInfo.userLoginName); // or display name
    $("#pplEmployee_TopSpan_ResolvedList").find("span[class='sp-peoplepicker-userSpan']").find("a").css("display","none");
    var employeePeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplEmployee_TopSpan"];
    employeePeoplePicker.SetEnabledState(false);
}

function RemoveUsersFromPeoplePicker(peoplePickerId)
{
    
    var spclientPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerId+"_TopSpan"]; 
     
    if (spclientPeoplePicker) {
    spclientPeoplePicker.SetEnabledState(true);
    var eleId = "#"+peoplePickerId+"_TopSpan_ResolvedList"
    //Get the Resolved Users list from Client People Picker
    var ResolvedUsers = $(eleId).find("span[class='sp-peoplepicker-userSpan']");

    //Clear the Client People Picker

    $(ResolvedUsers).each(function (index) {

    spclientPeoplePicker.DeleteProcessedUser(this);

    });
    }
}

function PopulatePeoplePicker(peoplePickerId) {

    setTimeout(function() {
        console.log("Populate pplManagers is called");

        var curUserJSON = JSON.parse($("#"+peoplePickerId+"_TopSpan_HiddenInput").attr("value"));
      //  for(var i=0;i<curUserJSON.length;i++)
	//	{ 
	//	  managersColl.push(curUserJSON[i].Key);
	//	}
	//	for(var j=0;j<managersColl.length;j++)
	//	{
	//	  getManagerFromUserProfile(managersColl[j]);
	//	}
        if (curUserJSON[0] != undefined && curUserJSON[0].Key != "") {
            var curUserAccName = curUserJSON[0].Key;
            getManagerFromUserProfile(curUserAccName);
            var managerPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplManagers_TopSpan"];
   		    managerPeoplePicker.SetEnabledState(false);            
        }        

    }, 2000);
}







function GetLastItemId(userID) {
    var deferred = $.Deferred();
    //var userId = _spPageContextInfo.userId;
    var caml = "<View><Query><Where>"
        + "<Eq><FieldRef Name='Author' LookupId='TRUE' /><Value Type='Integer'>"
        + userID  + "</Value></Eq></Where>"
        + "<OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy>"
        + "</Query><RowLimit>1</RowLimit></View>";
    var ctx = SP.ClientContext.get_current()
    var web = ctx.get_web()
    var list = web.get_lists().getByTitle("ITRequest")
    var query = new SP.CamlQuery();
    query.set_viewXml(caml);
    var items = list.getItems(query);
    ctx.load(items)
    ctx.executeQueryAsync(function () {
        // success actions
        var count = items.get_count();
        //should only be 1
        if (count > 1) {
            throw "Something is wrong. Should only be one latest list item / doc";
        }

        var enumerator = items.getEnumerator();
        enumerator.moveNext();
        var item = enumerator.get_current();
        var id = item.get_id();
        // do something with your result!!!!
        //return id;
        //alert(guidString);
        deferred.resolve(id);

    }, function () {
        //failure handling comes here
        alert("failed");
        });
    return deferred.promise();
}
var requestID = "";
function GetRequestID(userID) {
    var currentDate = new Date();
    GetLastItemId(userID).then(function (result) {
        itemID = result + 1;
        requestID = formatDate(currentDate) + "_Tillid_" + itemID;
        var managerID = "";
        var employeeID = "";
        var curUserManagerJSON = JSON.parse($("#pplManagers_TopSpan_HiddenInput").attr("value"))[0].Key;
        var curUserEmployeeJSON = JSON.parse($("#pplManagers_TopSpan_HiddenInput").attr("value"))[0].Key;
	    getUserId(curUserManagerJSON).then(function(result) {
	            managerID= result; 
				getUserId(curUserEmployeeJSON).then(function(result) {
				            employeeID= result; 
				            AddItemToList(managerID,employeeID);          
				        });  
	        });
                
    });
    
}

function formatDate(paramDate) {
    var dd = paramDate.getDate();
    var mm = paramDate.getMonth() + 1;
    var yyyy = paramDate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return formattedStringDate = dd + '-' + mm + '-' + yyyy;
}




function AddItemToList(managerID,employeeID) {
    var requestForValue = $("#radioGroup input:radio:checked").first().parent().text().trim();
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle('ITRequest');
    var listItemCreationInformation = new SP.ListItemCreationInformation();
    this.listItem = list.addItem(listItemCreationInformation);
    listItem.set_item('Title', "");
    listItem.set_item('RequestFor', requestForValue);
    listItem.set_item('Comments', $("#txtRequestDetails").val());
    listItem.set_item('ManagerID', managerID);
    listItem.set_item('Status', "Not Started");
    listItem.set_item('RequestID', requestID);
    //listItem.set_item("RequesterID", _spPageContextInfo.userId);
    if (requestForValue == "Self") {
        listItem.set_item("RequesterID", _spPageContextInfo.userId);
    }
    else{
        listItem.set_item("RequesterID", employeeID);
    }
    /*else {
        GetUserId($("#txtEmployeeID").val()).then(function (result) {
            userIdValue = result;
        });
        listItem.set_item("RequesterID", userIdValue);
    }*/
    listItem.update();
    context.load(listItem);
    context.executeQueryAsync(function OnSuccess() {
        console.log("Item created successfully");
        alert("Your request intialized successfully");
    }, function OnFailure(sender, args) {
        console.log(args.get_message());
    });
}



function RequestDetailsValidation()
{

	var error = 0;
    var name = $("#txtRequestDetails").val();

    var regex_length = /^[A-Za-z0-9]{3,255}$/;

    if(!regex_length.test(name)){
        error = 1;
        //alert("Name should be between 3-6 characters");
    }
    else{}

    if(error){
        return false;
    }else{
        return true;
    }
}


function validateEmployeePeoplePicker(curUser)
{
  if(curUser != undefined){
    if(curUser.IsResolved){
      $("#errMsgEmployee").hide();
    }
    else{
	     $("#errMsgEmployee").text("Please enter a valid employee");
	     $("#errMsgEmployee").show();

	   }
  }
  else
	{ 
	  $("#errMsgEmployee").text("Please enter a employee");
	  $("#errMsgEmployee").show();
    	     
	}
    
}


function validateManagerPeoplePicker(curManager)
{
   if(curManager != undefined){
	   if(curManager.IsResolved){
	     $("#errMsgManagers").hide();
	   }
	   else{
	     $("#errMsgManagers").text("Please enter a valid manager");
	     $("#errMsgManagers").show();

	   }
   }
   else
    { 	           
      $("#errMsgManagers").text("Please enter a manager");
      $("#errMsgManagers").show();
    }
    
}

function FormFieldsValidation()
{
      var validationStatus = RequestDetailsValidation();
	  var curUserJSON = JSON.parse($("#pplEmployee_TopSpan_HiddenInput").attr("value"));
	    if($("#pplManagers_TopSpan_HiddenInput").attr("value") !=undefined)
	    {
		      var curManagersJSON = JSON.parse($("#pplManagers_TopSpan_HiddenInput").attr("value"));
		      if(validationStatus)
		      {
		           $("#errMsgRequestId").hide();
		           if(curUserJSON[0] != undefined && curManagersJSON[0] != undefined)
			        {
			          if(curUserJSON[0].IsResolved && curManagersJSON[0].IsResolved)
			          {
			            $("#submitForm").removeAttr("disabled","disabled");
			            $("#submitForm").css({"color": "rgba(255, 255, 255, 0.87)"});  
			          }
			          else if(!curUserJSON[0].IsResolved)
			          {
			            $("#errMsgEmployee").text("Please enter a valid employee");
	                    $("#errMsgEmployee").show();

			          }		
			          else
			          {
				         $("#errMsgManagers").text("Please enter a valid manager");
	                     $("#errMsgManagers").show();

			          }	          
			          
			        }   
			        else
		          	{ 
		          	  $("#submitForm").attr("disabled","disabled");
		              $("#submitForm").css({"color": "rgba(0,0,0,0.38)"});
		             
		            }
		
			  }
			  else
			  { 
		        $("#submitForm").attr("disabled","disabled");	        
		        $("#submitForm").css({"color": "rgba(0,0,0,0.38)"});
		        $("#errMsgRequestId").text("Must be in between 3 to 255 characters");
		        $("#errMsgRequestId").show();	              
	            
			  }
		      
		       validateManagerPeoplePicker(curManagersJSON[0]);

	   }
		    
	  validateEmployeePeoplePicker(curUserJSON[0]);

}