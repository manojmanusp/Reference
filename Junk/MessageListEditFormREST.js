var userInfo = "";
var selectedLookUpName = "";
var listName = "MessageList";
var momentValue = "";
JSRequest.EnsureSetup();
var idValue = JSRequest.QueryString["ID"];
var itemUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName +"')/items(" + idValue + ")";
var arrayManagerIds = new Array();
            

function UpdateItemMessageList(listName, title, contactPerson, messageDetails, dateMessage, emailValue, userInfo, statusValue) {
    ///<summary>Function to create item in Message List</summary>
    ///<param name="listName">List Name</param>
    /// <param name="title">Title of new Item</param>
    /// <param name="contactPerson">ContactPersons value for lookup column</param>
    /// <param name="messageDetails">Message Details value for Item</param>
    /// <param name="date">Date value for Item</param>
    
    $.ajax({
        url: itemUrl,
        type: "POST",
        async: false,
        data: JSON.stringify({
            __metadata: { type: "SP.Data.MessageListListItem" },
            "Title": title,
            "ContactPersonId": contactPerson,
            "MessageDetails": messageDetails,
            "MessageDate": dateMessage == "Invalid date" ? null : dateMessage,
            "Email": emailValue,
            "ManagersId": { "results": [userInfo] },
            "Status": statusValue
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
            //SendEmailToEmployee(window.emailValue, window.messageDetails);
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
            
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });   
}

function GerManagerIDEditFrom(managersValue) {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('User Information List')/items?$filter=ImnName eq '" + managersValue + "'";
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
        userInfo = data.d.results[0].Id;        
    }

    function onError(error) {
        alert("error");
    }
}
 
function BindEmailValue(selectedLookUpName) {
    ///<summary>When selected change event of ContactPersons field fires, it populates the email value to control</summary>
    ///<param name="selectedLookUpName">selected Contact Person</param>    
    
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('CustomerContacts')/items?$filter=FullName eq '" + selectedLookUpName + "'";

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

function GetUserIdLookUpName(selectedLookUpName){
    ///<summary>get the user id of selected value on change event of ContactPersons field</summary>
    ///<param name="selectedLookUpName">selected Contact Person</param>
    // var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('User Information List')/items?$filter=ImnName eq '" + selectedLookUpName + "'";
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('ManagersList')/items?$select=Managers/Title,Managers/Id&$expand=Managers&$filter=Title eq '" + selectedLookUpName + "'";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: url,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

    function onSuccess(data) {
        for (var i = 0; i < data.d.results[0].Managers.results.length; i++) {
            userInfo = data.d.results[0].Managers.results[i].Id;
        }
        BindManagerNameToControl(userInfo);
        
    }

    function onError(error) {
        alert("error");
    }
}

function BindManagerNameToControl(userInfo) {
    ///<summary>Bind Manager Name to PeoplePicker control</summary>
    ///<param name="userInfo">ID of Manager</param>
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userInfo + ")";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

    function onSuccess(data) {
        var loginName = data.d.Title;
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

function SendEmailToEmployee(employeeEmail, emailBody) {
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
                'To': { 'results': [employeeEmail] },
                'Subject': "Test mail",
                'Body': emailBody
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
            var textField = GetFieldByDisplayName("Title");
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
                var title = $("[id*='Title'][id$='TextField']").val();
                var contactPerson = parseInt($("[id*='ContactPerson'][id$='LookupField']").find('option:selected').val());
               // var messageDetails = $("[id*='MessageDetails'][id$=TextField_inplacerte]").text();
                var dateElement = $("[id*='MessageDate'][id$='DateTimeFieldDate']").val();
                if (momentValue !== undefined && dateElement !==undefined)
                {
                    momentValue = moment(new Date(dateElement));
                    var dateMessage = momentValue.format("MM/DD/YYYY");
                }
                window.messageDetails = $("[id*='MessageDetails'][id$=TextField_inplacerte]").text();
                window.emailValue = $("input[id*='Email'][id$='TextField']").val();    
               // var emailValue = $("input[id*='Email'][id$='TextField']").val();                
                var managersValue = $("[id*='Managers'][id$='ClientPeoplePicker']").find("span.ms-entity-resolved").text();
                var statusValue = $("[id*='Status'][id$='DropDownChoice']").val();
                
                 GerManagerIDEditFrom(managersValue);
                 UpdateItemMessageList(listName, title, contactPerson, messageDetails, dateMessage, emailValue, userInfo, statusValue);
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
            selectedLookUpName = $(this).find('option:selected').text();
            
            if (selectedLookUpName !== "(None)") {
                BindEmailValue(selectedLookUpName);

                GetUserIdLookUpName(selectedLookUpName);
            }
            else {
              $("[id$='ClientPeoplePicker'][title='Managers']").find("span.sp-peoplepicker-initialHelpText.ms-helperText").attr("style", "display:block");
            }
         });
    }
});








