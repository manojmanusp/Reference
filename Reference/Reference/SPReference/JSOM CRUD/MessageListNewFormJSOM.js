//window.userInfo1 = "";


$(document).ready(function () {
    if ($("input#addListItemJSOM").length == 0) {
        // Creating custom Add button
        var addControlJSOM = '<input type="button" id="addListItemJSOM" name="addListItemJSOM" value="Add Item JSOM" class="ms-ButtonHeightWidth">';
        $("input[id$='diidIOSaveItem']").parent().append(addControlJSOM);

        //To hide OOTB Save and Cancel buttons in NewForms
        $("input[id$='diidIOSaveItem']").hide();
        $("input[id$='diidIOGoBack']").hide();


        //Click event for custom add button
        $("input[name='addListItemJSOM']").click(function () {
            var textField = GetFieldByDisplayName("Title");
            if ($("span.errorMessage.ms-formvalidation.ms-csrformvalidation").length>0)
            {
                $("span.errorMessage.ms-formvalidation.ms-csrformvalidation").empty();
            }
            //WriteErrorMessage(textField, " ");
            //Check if the input is empty
            if (textField && !textField.val().trim()) {

                //Write a message indicating to the user that the field is empty
                WriteErrorMessage(textField, "Please enter a value");
            }
            else {
                SaveNewItemJSOM();
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

            function SaveNewItemJSOM() {
                ///<summary>Create a new item in MessageList</summary>
                if ($("[id*='Title'][id$='TextField']").val() != undefined) {
                    var title = $("[id*='Title'][id$='TextField']").val();
                }
                else { title = "";}
                if ($("[id*='ContactPerson'][id$='LookupField']").find('option:selected').val() != undefined) {
                    var contactPerson = parseInt($("[id*='ContactPerson'][id$='LookupField']").find('option:selected').val());
                }
                else { contactPerson = ""; }

                var messageDetails = $("[id*='MessageDetails'][id$=TextField_inplacerte]").text();
                var dateElement = $("[id*='MessageDate'][id$='DateTimeFieldDate']").val();
                if (momentValue !== undefined && dateElement !== undefined) {
                    momentValue = moment(new Date(dateElement));
                    if (momentValue.format("MM/DD/YYYY") != "Invalid date") {
                        var dateMessage = momentValue.format("MM/DD/YYYY");
                    }
                    else { dateMessage = null;}
                }
                if ($("input[id*='Email'][id$='TextField']").val() != undefined) {
                    var emailValue = $("input[id*='Email'][id$='TextField']").val();
                }
                else { emailValue = ""; }
               

                if ($("[id*='Managers'][id$='ClientPeoplePicker']").find("span.ms-entity-resolved").text() != undefined) {
                    var managersValue = $("[id*='Managers'][id$='ClientPeoplePicker']").find("span.ms-entity-resolved").text();
                }
                else { managersValue = ""; }
                if ($("[id*='Status'][id$='DropDownChoice']").val() != undefined) {
                    var statusValue = $("[id*='Status'][id$='DropDownChoice']").val();
                }
                else { statusValue = ""; }
               
                GetUserIDByNameJSOM(managersValue).then(function (userInfo1) {
                    AddItemMessageListJSOM(title, contactPerson, messageDetails, dateMessage, emailValue, statusValue, userInfo1);
                });

            }

        });

        // Creating custom cancel button
        var cancelControlJSOM = '<input type="button" id="cancelListItemJSOM" name="cancelListItemJSOM" value="Cancel Item JSOM" class="ms-ButtonHeightWidth">';

        $("input[name='addListItemJSOM']").parent().append(cancelControlJSOM);

        //Click event for custom Cancel button
        $("input[name='cancelListItemJSOM']").click(function () {
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
            //STSNavigate(cancelUrl);
            //return false;
            //WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("cancelListItem", "", true, "", "", false, true))
        });

        //Change event for ContactPersons field value
        //$("[id*='ContactPerson'][id$='LookupField']").change(function () {
        //    $("[id$='ClientPeoplePicker'][title='Managers']").find("span.sp-peoplepicker-resolveList").text("");
        //    $("input[id*='Email'][id$='TextField']").val("");
        //    var selectedLookUpName = $(this).find('option:selected').text();
        //    if (selectedLookUpName !== "(None)") {
        //        BindEmailValue(selectedLookUpName);

        //        GetUserIdLookUpName(selectedLookUpName);
        //    }
        //    else {
        //        $("[id$='ClientPeoplePicker'][title='Managers']").find("span.sp-peoplepicker-initialHelpText.ms-helperText").attr("style", "display:block");
        //    }
        //});
    }
});


function GetUserIDByNameJSOM(managersValue) {
    var deferred = $.Deferred();    
    var context = new SP.ClientContext();
    var userInfo1 = "";
    var list = context.get_web().get_lists().getByTitle("MessageList");
    if (managersValue != "") {
        var User = context.get_web().ensureUser(managersValue);
        context.load(User);
        context.executeQueryAsync(function OnSuccessAddItem(sender, args) {

            userInfo1 = User.get_id();

            deferred.resolve(userInfo1);
        },
            function OnFailureAddItem(sender, args) {
                console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
                deferred.reject(args.get_message());
            });
    }
    else {
        deferred.resolve(userInfo1);
    }
    return deferred.promise();
}

function AddItemMessageListJSOM(title, contactPerson, messageDetails, dateMessage, emailValue, statusValue, userInfo1) {
    
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("MessageList");
    var listItemCreationInformation = new SP.ListItemCreationInformation();
    this.listItem = list.addItem(listItemCreationInformation);
    listItem.set_item('Title', title);
    listItem.set_item('ContactPerson', contactPerson);
    listItem.set_item('MessageDetails', messageDetails);
    listItem.set_item('Email', emailValue);
    listItem.set_item('MessageDate', dateMessage);
    listItem.set_item('Managers', userInfo1);
    listItem.set_item('Status', statusValue);
    listItem.update();
    context.load(listItem);
    context.executeQueryAsync(function OnSuccessAddItem(sender, args) {
        alert("Item Added Successfully in JSOM");
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/MessageList/AllItems.aspx";
    },
        function OnFailureAddItem(sender, args) {
            console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
        });
}



