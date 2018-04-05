var userInfoUpdateItem = "";
var selectedLookUpEditForm = "";
var listNameEditForm = "MessageList";
var momentValueEditForm = "";
JSRequest.EnsureSetup();
var idValueEditForm = JSRequest.QueryString["ID"];
var itemUrlEditForm = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetBytitle('" + listNameEditForm +"')/items(" + idValueEditForm + ")";
var arrayManagerIdsEditForm = new Array();
            

function UpdateItemMessageList(titleEditForm, contactPersonEditForm,messageDetailsEditForm, dateElementEditForm,emailValueEditForm, userInfoUpdateItem, statusValueEditForm) {
    ///<summary>Function to create item in Message List</summary>    
    /// <param name="title">title of new Item</param>
    /// <param name="contactPerson">ContactPersons value for lookup column</param>
    /// <param name="messageDetails">Message Details value for Item</param>
    /// <param name="date">Date value for Item</param>
    
    $.ajax({
        url: itemUrlEditForm,
        type: "POST",
        async: false,
        data: JSON.stringify({
            __metadata: { type: "SP.Data.MessageListListItem" },
            "title": titleEditForm,
            "ContactPersonId": contactPersonEditForm,
            "MessageDetails": messageDetailsEditForm,
            "MessageDate": dateElementEditForm == "Invalid date" ? null : dateElementEditForm,
            "Email": emailValueEditForm,
            "ManagersId": { "results": [userInfoUpdateItem] },
            "Status": statusValueEditForm
        }),
        headers:
        {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "IF-MATCH": "*"

        },

        success: function (data) {
            alert("Item Updated successfully");            
            //SendEmailToEmployeeEditFrom(window.emailValue, window.messageDetails);
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
            
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });   
}

function GerManagerIDEditFrom(managersValueEditForm) {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('User Information List')/items?$filter=ImnName eq '" + managersValueEditForm + "'";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: url,
        contentType: "application/json;odata=verbose",
        async:false,
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

    function onSuccess(data) {
        userInfoUpdateItem = data.d.results[0].Id;        
    }

    function onError(error) {
        alert("error");
    }
}
 
function BindEmailValueEditForm(selectedLookUpEditForm) {
    ///<summary>When selected change event of ContactPersons field fires, it populates the email value to control</summary>
    ///<param name="selectedLookUpEditForm">selected Contact Person</param>    
    
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetBytitle('CustomerContacts')/items?$filter=FullName eq '" + selectedLookUpEditForm + "'";

        $.ajax({
            url: url,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data){
                // set the value to email field
                $("input[id*='Email'][id$='TextField']").val(data.d.results[0].Email);                                
            },
            error: function (error){
                alert(JSON.stringify(error));
            }
        });    
    
}

function GetUserIdLookUpNameEditFrom(selectedLookUpEditForm){
    ///<summary>get the user id of selected value on change event of ContactPersons field</summary>
    ///<param name="selectedLookUpEditForm">selected Contact Person</param>
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('User Information List')/items?$filter=ImnName eq '" + selectedLookUpEditForm + "'";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: url,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

    function onSuccess(data)
    {
        userInfoUpdateItem = data.d.results[0].Id;
        BindPeoplePickerValueEditFrom(userInfoUpdateItem);
    }

    function onError(error) {
        alert("error");
    }
}

function BindPeoplePickerValueEditFrom(userInfoUpdateItem) {
    ///<summary>Get Managers ID's from Managers List of particular Employee</summary>
    ///<param name="userInfoUpdateItem">User id of selected Contact Person </param>
    
    var urlValue = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetBytitle('ManagersList')/items?$filter=Employee eq '" + userInfoUpdateItem + "'";
    $.ajax({
        url: urlValue,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            // get Managers Id of the employee selected in ContactPersons field
            for (var i = 0; i < data.d.results[0].ManagersId.results.length; i++) {
                var idEditForm = data.d.results[0].ManagersId.results[i];
                arrayManagerIdsEditForm.push(idEditForm);
                
                // Set the value to Managers field based on userid retrieved
                BindManagerNameToControlEditForm(idEditForm);
            }
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });

    function BindManagerNameToControlEditForm(userIDEditForm) {
        ///<summary>Bind Manager Name to PeoplePicker control</summary>
        ///<param name="userID">ID of Manager</param>
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userIDEditForm + ")";
        var requestHeaders = { "accept": "application/json;odata=verbose" };
        $.ajax({
            url: requestUri,
            contentType: "application/json;odata=verbose",
            headers: requestHeaders,
            success: onSuccess,
            error: onError
        });

        function onSuccess(data) {
            var loginName = data.d.title;
            var controlName = "Managers";
            var ppDiv = $("[id$='ClientPeoplePicker'][title='" + controlName + "']");         // Select the People Picker DIV
            var ppEditor = ppDiv.find("[title='" + controlName + "']");                      
            var spPP = SPClientPeoplePicker.SPClientPeoplePickerDict[ppDiv[0].id];           // Get the instance of the People Picker from the Dictionary
            ppEditor.val(loginName)                                                          // Set the value
            spPP.AddUnresolvedUserFromEditor(true);
        }

        function onError(error) {
            alert("error");
        }
    }

}

function SendEmailToEmployeeEditFrom(emailEditForm, messageBodyEditForm) {
    ///<summary>Send an email after successfull creation of an item in MessageList</summary>
    ///<param name="employeeEmail">Email of selected employee in ContactPerson</param>
    ///<param name="emailBody">MessageDetails of selected employee in ContactPerson</param>
    var urlTemplate = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: 'POST',
        async: false,
        data: JSON.stringify({
            'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': "murali@chennaitillidsoft.onmicrosoft.com",
                'To': { 'results': [emailEditForm] },
                'Subject': "Test mail",
                'Body': messageBodyEditForm
            }
        }
        ),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            alert("Mail sent");
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}

$(document).ready(function () {
    if ($("input#updateListItem").length == 0) {
        // Creating custom Add button
        var updateMessageListControl = '<input type="button" id="updateListItem" name="updateListItem" value="Update Item" class="ms-ButtonHeightWidth">';
        $("input[id$='diidIOSaveItem']").parent().append(updateMessageListControl);

        //To hide OOTB Save and Cancel buttons in NewForms
        $("input[id$='diidIOSaveItem']").hide();
        $("input[id$='diidIOGoBack']").hide();

        
        //Click event for custom add button
        $("input[name='updateListItem']").click(function () {
            var textField = GetFieldByDisplayName("title");
            //Check if the input is empty
            if (textField && !textField.val().trim()) {                
                //Write a message indicating to the user that the field is empty
                WriteErrorMessage(textField, "Please enter a value");
            }
            else {
                UpdateMessageListItem();
            }
            //Append an error message to a field       
            function WriteErrorMessage(inputElement, message) {
                var errorMessageMarkup = '<span class="errorMessage ms-formvalidation ms-csrformvalidation"><span role="alert">' + message + '<br></span>';
                $(inputElement).parent().append(errorMessageMarkup);
            }

            //Gets a jQuery object that represents a field element
            function GetFieldByDisplayName(fieldName) {
                var field = $('input[title="' + fieldName + ' Required Field"]');
                return field;
            }
            
            function UpdateMessageListItem() {
                 ///<summary>Update an item in MessageList</summary>
                var titleEditForm = $("[id*='title'][id$='TextField']").val();
                var contactPersonEditForm = parseInt($("[id*='ContactPerson'][id$='LookupField']").find('option:selected').val());
               // var messageDetails = $("[id*='MessageDetails'][id$=TextField_inplacerte]").text();
                var dateElementEditForm = $("[id*='MessageDate'][id$='DateTimeFieldDate']").val();
                if (momentValueEditForm !== undefined && dateElement !==undefined)
                {
                    momentValueEditForm = moment(new Date(dateElement));
                    var dateMessageEditForm = momentValueEditForm.format("MM/DD/YYYY");
                }
                window.messageDetailsEditForm = $("[id*='MessageDetails'][id$=TextField_inplacerte]").text();
                window.emailValueEditForm = $("input[id*='Email'][id$='TextField']").val();    
               // var emailValue = $("input[id*='Email'][id$='TextField']").val();                
                var managersValueEditForm = $("[id*='Managers'][id$='ClientPeoplePicker']").find("span.ms-entity-resolved").text();
                var statusValueEditForm = $("[id*='Status'][id$='DropDownChoice']").val();
                
                 GerManagerIDEditFrom(managersValue);
                 UpdateItemMessageList(titleEditForm, contactPersonEditForm, window.messageDetailsEditForm, dateElementEditForm, window.emailValueEditForm, userInfoUpdateItem, statusValueEditForm);
            }

        });

        // Creating custom cancel button
        var cancelMessgeListControl = '<input type="button" id="cancelMessageListItem" name="cancelMessageListItem" value="Cancel Item" class="ms-ButtonHeightWidth">';
        var cancelUrl = _spPageContextInfo.webAbsoluteUrl + '\u002fLists\u002fMessageList\u002fAllItems.aspx';
        $("input[name='updateListItem']").parent().append(cancelMessgeListControl);

        //Click event for custom Cancel button
        $("input[name='cancelMessageListItem']").click(function () {
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
        });

       
        //Change event for ContactPersons field value
        $("[id*='ContactPerson'][id$='LookupField']").change(function () {
            $("[id$='ClientPeoplePicker'][title='Managers']").find("span.sp-peoplepicker-resolveList").text("");
            $("input[id*='Email'][id$='TextField']").val("");
            selectedLookUpEditForm = $(this).find('option:selected').text();
            
            if (selectedLookUpEditForm !== "(None)") {
                BindEmailValueEditFormEditForm(selectedLookUpEditForm);

                GetUserIdLookUpNameEditFrom(selectedLookUpEditForm);
            }
            else {
              $("[id$='ClientPeoplePicker'][title='Managers']").find("span.sp-peoplepicker-initialHelpText.ms-helperText").attr("style", "display:block");
            }
         });
    }
});








