var userInfo = "";
var listName = "MessageList";
var momentValue = "";
var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+listName+"')/items";
var arrayManagerIds = new Array();

function AddItemMessageList(listName, title, contactPerson, messageDetails, dateMessage, emailValue, userInfo, statusValue) {
    ///<summary>Function to create item in Message List</summary>
    ///<param name="listName">List Name</param>
    /// <param name="title">Title of new Item</param>
    /// <param name="contactPerson">ContactPersons value for lookup column</param>
    /// <param name="messageDetails">Message Details value for Item</param>
    /// <param name="date">Date value for Item</param>
    
    $.ajax({
        url: siteUrl,
        type: "POST",
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
            "X-HTTP-Method": "POST"
        },

        success: function (data) {

            alert("Item created successfully");
            var employeeEmail = data.d.Email;
            var emailBody = $.parseHTML(data.d.MessageDetails)[0].innerText;
         //   SendEmailToEmployee(employeeEmail, emailBody);
        },
        error: function (error) {
            console.log(JSON.stringify(error));

        }
    });

    
}

function GerManagerIDNewFrom(managersValue) {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('User Information List')/items?$filter=ImnName eq '" + managersValue + "'";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: url,
        contentType: "application/json;odata=verbose",
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
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/lists/getbytitle('User Information List')/items?$filter=ImnName eq '" + selectedLookUpName + "'";
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
        userInfo = data.d.results[0].Id;
        BindPeoplePickerValue(userInfo);
    }

    function onError(error) {
        alert("error");
    }
}

function BindPeoplePickerValue(userInfo) {
    ///<summary>Get Managers ID's from Managers List of particular Employee</summary>
    ///<param name="userInfo">User id of selected Contact Person </param>
    
    var urlValue = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('ManagersList')/items?$filter=Employee eq '" + userInfo + "'";
    $.ajax({
        url: urlValue,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            // get Managers Id of the employee selected in ContactPersons field
            for (var i = 0; i < data.d.results[0].ManagersId.results.length; i++) {
                var id = data.d.results[0].ManagersId.results[i];
                arrayManagerIds.push(id);
                
                // Set the value to Managers field based on userid retrieved
                BindManagerNameToControl(id);
            }
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });

    function BindManagerNameToControl(userID) {
        ///<summary>Bind Manager Name to PeoplePicker control</summary>
        ///<param name="userID">ID of Manager</param>
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userID + ")";
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
    if ($("input#addListItemREST").length == 0) {
        // Creating custom Add button
        var addControlREST = '<input type="button" id="addListItemREST" name="addListItemREST" value="Add Item REST" class="ms-ButtonHeightWidth">';
        $("input[id$='diidIOSaveItem']").parent().append(addControlREST);

        //To hide OOTB Save and Cancel buttons in NewForms
        $("input[id$='diidIOSaveItem']").hide();
        $("input[id$='diidIOGoBack']").hide();

        
        //Click event for custom add button
        $("input[name='addListItemREST']").click(function () {
            var textField = GetFieldByDisplayName("Title");
            if ($("span.errorMessage.ms-formvalidation.ms-csrformvalidation").length > 0) {
                $("span.errorMessage.ms-formvalidation.ms-csrformvalidation").empty();
            }
            //Check if the input is empty
            if (textField && !textField.val().trim()) {  
                
                //Write a message indicating to the user that the field is empty
                WriteErrorMessage(textField, "Please enter a value");
            }
            else {
                SaveNewItem();
            }
              
            function WriteErrorMessage(inputElement, message) {
                 ///<summary>Writes the validation message under the respective control</summary>
                var errorMessageMarkup = '<span class="errorMessage ms-formvalidation ms-csrformvalidation"><span role="alert">' + message + '<br></span>';
                $(inputElement).parent().append(errorMessageMarkup);
            }

            
            function GetFieldByDisplayName(fieldName) {
                 ///<summary>Gets a jQuery object that represents a field element</summary>
                var field = $('input[title="' + fieldName + ' Required Field"]');
                return field;
            }
            
            function SaveNewItem() {
                ///<summary>Create a new item in MessageList</summary>
                
                var title = $("[id*='Title'][id$='TextField']").val();
                var contactPerson = parseInt($("[id*='ContactPerson'][id$='LookupField']").find('option:selected').val());
                var messageDetails = $("[id*='MessageDetails'][id$=TextField_inplacerte]").text();
                var dateElement = $("[id*='MessageDate'][id$='DateTimeFieldDate']").val();
                if (momentValue !== undefined && dateElement !==undefined)
                {
                    momentValue = moment(new Date(dateElement));
                    var dateMessage = momentValue.format("MM/DD/YYYY");
                }
                
                var emailValue = $("input[id*='Email'][id$='TextField']").val();   
                var managersValue = $("[id*='Managers'][id$='ClientPeoplePicker']").find("span.ms-entity-resolved").text();
                var statusValue = $("[id*='Status'][id$='DropDownChoice']").val();
                GerManagerIDNewFrom(managersValue);
                AddItemMessageList(listName, title, contactPerson, messageDetails, dateMessage, emailValue, userInfo, statusValue);
            }

        });

        // Creating custom cancel button
        var cancelControlREST = '<input type="button" id="cancelListItemREST" name="cancelListItemREST" value="Cancel Item REST" class="ms-ButtonHeightWidth">';
        var cancelUrl = _spPageContextInfo.webAbsoluteUrl + '\u002fLists\u002fMessageList\u002fAllItems.aspx';
        $("input[name='addListItemREST']").parent().append(cancelControlREST);

        //Click event for custom Cancel button
        $("input[name='cancelListItemREST']").click(function () {
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
            //STSNavigate(cancelUrl);
            //return false;
            //WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("cancelListItem", "", true, "", "", false, true))
        });

        //Change event for ContactPersons field value
        $("[id*='ContactPerson'][id$='LookupField']").change(function () {
            $("[id$='ClientPeoplePicker'][title='Managers']").find("span.sp-peoplepicker-resolveList").text("");
            $("input[id*='Email'][id$='TextField']").val("");
            var selectedLookUpName = $(this).find('option:selected').text();
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








