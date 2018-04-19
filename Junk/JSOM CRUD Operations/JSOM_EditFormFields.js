$(document).ready(function () {

    var updateJSOMItemControl = '<input type="button" name="updateItemJSOM" value="Update Item JSOM" accesskey="O" class="ms-ButtonHeightWidth" target="_self">';   
    var listName = "DataList";
    JSRequest.EnsureSetup();
    var idValue = JSRequest.QueryString["ID"];    
    $("input[id$='diidIOSaveItem']").hide();
    $("input[name='updateItem']").parent().append(updateJSOMItemControl);
    $("input[name='updateItemJSOM']").click(function () {
        var textField = GetFieldByDisplayName("Title");
        //Check if the input is empty
        if (textField && !textField.val().trim()) {
            //Write a message indicating to the user that the field is empty
            WriteErrorMessage(textField, "Please enter a value");
        }
        else {
            UpdateJSOMNewItem();
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


        function UpdateJSOMNewItem() {

            // Creating item using REST API into Sharepoint List
            var title = $("[id*='Title'][id$='TextField']").val();
            var singleLine = $("[id*='Field_SingleLine'][id$='TextField']").val();
            var multiLine = $("[id*='Field_MultiLine'][id$=TextField_inplacerte]").text();
            var numberElement = $("[id*='Field_Number'][id$='NumberField']").val();
            if (numberElement == "") {
                number = null;
            }
            if (numberElement !== undefined && number !== null) {
                var number = parseFloat(numberElement);
            }
            var boolean = $("[id*='Field_Yes_x002f_No'][id$='BooleanField']").is(':checked');
            var person = $("[id*='Field_Person'][id$='ClientPeoplePicker']").find('span.ms-entity-resolved').text();


            var dateElement = $("[id*='Field_Date'][id$='DateTimeFieldDate']").val();
            if (dateElement !== undefined) {
                var date = dateElement == "" ? null : dateElement;
            }
            var choice = $("[id*='Field_Choice'][id$='DropDownChoice']").val();
            var hyperLink = $("[id*='Field_HyperLink'][id$='UrlFieldUrl']").val();

            var hyperLinkDescription = $("[id*='Field_HyperLink'][id$='UrlFieldDescription']").val();

            var picture = $("[id*='Field_Picture'][id$='UrlFieldUrl']").val();
            var pictureDescription = $("[id*='Field_Picture'][id$='UrlFieldDescription']").val();
            var currencyElement = $("[id*='Field_Currency'][id$='CurrencyField']").val();
            if (currencyElement == "") {
                currency = null;
            }
            if (currencyElement !== undefined && currency !== null) {
                var currency = parseFloat(currencyElement);

            }

            var lookup = parseInt($("[id*='Field_LookUp'][id$='LookupField']").find('option:selected').val());

            var multiplePersons = $("[id*='Field_MultiplePersons'][id$='ClientPeoplePicker']").find('span.ms-entity-resolved').text();
            var choiceArray = [];
            for (var i = 0; i < $("[id*='Field_MultipleChoices'][id$='MultiChoiceTable']").find('input:checked').next('label').length; i++) {
                var multipleChoices = $("[id*='Field_MultipleChoices'][id$='MultiChoiceTable']").find('input:checked').next('label')[i].innerText;
                choiceArray.push(multipleChoices);
            }
            var lookUpArray = [];

            for (var i = 0; i < $("[id*='Field_MultipleLookUp'][id$='SelectResult']").find('option').length; i++) {
                var multiLookUP = new SP.FieldLookupValue();
                multiLookUP.set_lookupId($("[id*='Field_MultipleLookUp'][id$='SelectResult']").find('option')[i].value);
                lookUpArray.push(multiLookUP);
            }

            UpdateItemJSOM(listName, idValue, title, singleLine, multiLine, number, person, date, choice, hyperLink, picture, currency, lookup, choiceArray, lookUpArray);

            
        }
        
    });

});

function UpdateItemJSOM(listName, idValue, title, singleLine, multiLine, number, person, date, choice, hyperLink, picture, currency, lookup, choiceArray, lookUpArray)

{
    var multiplePersons = _spPageContextInfo.userId;
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle(listName);
    var listItem = list.getItemById(idValue);    
    listItem.set_item('Title', title);
    listItem.set_item('Field_SingleLine', singleLine);
    listItem.set_item('Field_MultiLine', multiLine);
    listItem.set_item('Field_Number', number);
    listItem.set_item('Field_Person', _spPageContextInfo.userId);
    listItem.set_item('Field_Date', date);
    listItem.set_item('Field_Choice', choice);
    listItem.set_item('Field_HyperLink', hyperLink);
    listItem.set_item('Field_Picture', picture);
    listItem.set_item('Field_Currency', currency);
    listItem.set_item('Field_LookUp', lookup);
    listItem.set_item('Field_MultiplePersons', multiplePersons);
    listItem.set_item('Field_MultipleChoices', choiceArray);
    listItem.set_item('Field_MultipleLookUp', lookUpArray);
    listItem.update();    
    context.executeQueryAsync(Function.createDelegate(this, this.UpdateItemSuccess), Function.createDelegate(this, this.UpdateItemFailed));
}

function UpdateItemSuccess(sender,args)
{
    alert("Item Updated Successfully");
    window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/DataList/AllItems.aspx";
}

function UpdateItemFailed(sender, args)
{
    console.log("Message : "+args.get_message()+"/n Trace : "+args.get_stackTrace());
}
