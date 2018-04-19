
var momentDateValue = "";
$(document).ready(function () {

    var updateItemControl = '<input type="button" name="updateItem" value="Update Item" accesskey="O" class="ms-ButtonHeightWidth" target="_self">';
     
    JSRequest.EnsureSetup();
    var idValue = JSRequest.QueryString["ID"];
    var itemUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('DataList')/items("+idValue+")";
    
    $("input[name$='diidIOSaveItem']").parent().append(updateItemControl);
    $("input[id$='diidIOSaveItem']").hide();
    $("input[name='updateItem']").click(function () {
        var textField = GetFieldByDisplayName("Title");
        //Check if the input is empty
        if (textField && !textField.val().trim()) {
            //Write a message indicating to the user that the field is empty
            WriteErrorMessage(textField, "Please enter a value");
        }
        else {
            UpdateNewItem();
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
        function UpdateNewItem() {
            // Creating item using REST API into Sharepoint List
            var title = $("[id*='Title'][id$='TextField']").val();
            var singleLine = $("[id*='Field_SingleLine'][id$='TextField']").val();
            var multiLine = $("[id*='Field_MultiLine'][id$=TextField_inplacerte]").text();
            var numberElement = $("[id*='Field_Number'][id$='NumberField']").val();
            if (numberElement !== undefined) {
                var number = numberElement;
            }
            var boolean = $("[id*='Field_Yes_x002f_No'][id$='BooleanField']").is(':checked');
            var person = $("[id*='Field_Person'][id$='ClientPeoplePicker']").find('span.ms-entity-resolved').text();                 
            var dateElement = $("[id*='Field_Date'][id$='DateTimeFieldDate']").val();
            if (momentDateValue !== undefined && dateElement !==undefined) {
                momentDateValue = moment(new Date(dateElement));
                var date = momentDateValue.format("MM/DD/YYYY");
            }

         
            var choice = $("[id*='Field_Choice'][id$='DropDownChoice']").val();
            var hyperLink = $("[id*='Field_HyperLink'][id$='UrlFieldUrl']").val();

            var hyperLinkDescription = $("[id*='Field_HyperLink'][id$='UrlFieldDescription']").val();

            var picture = $("[id*='Field_Picture'][id$='UrlFieldUrl']").val();
            var pictureDescription = $("[id*='Field_Picture'][id$='UrlFieldDescription']").val();
            var currencyElement = $("[id*='Field_Currency'][id$='CurrencyField']").val();
            if (currencyElement !== undefined) {
                var currency = currencyElement;

            }

            var lookup = $("[id*='Field_LookUp'][id$='LookupField']").find('option:selected').val();

            var multiplePersons = $("[id*='Field_MultiplePersons'][id$='ClientPeoplePicker']").find('span.ms-entity-resolved').text();
            var choiceArray = [];
            for (var i = 0; i < $("[id*='Field_MultipleChoices'][id$='MultiChoiceTable']").find('input:checked').next('label').length; i++) {
                var multipleChoices = $("[id*='Field_MultipleChoices'][id$='MultiChoiceTable']").find('input:checked').next('label')[i].innerText;
                choiceArray.push(multipleChoices);
            }
            var lookUpArray = [];
            for (var i = 0; i < $("[id*='Field_MultipleLookUp'][id$='SelectResult']").find('option').length; i++) {
                var multiLookUP = $("[id*='Field_MultipleLookUp'][id$='SelectResult']").find('option')[i].value;
                lookUpArray.push(parseInt(multiLookUP));
            }
            

            UpdateItem(itemUrl, title, singleLine, multiLine, number,  person, date, choice, hyperLink, picture, currency, lookup, multiplePersons, choiceArray, lookUpArray);

           
        }
        
    });

});


function UpdateItem(itemUrl, title, singleLine, multiLine, number, person, date, choice, hyperLink, picture, currency, lookup, multiplePersons, choiceArray, lookUpArray) {

    $.ajax({
        url: itemUrl,
        type: "POST", //Specifies the operation to create the list item
        data: JSON.stringify({
            __metadata: { type: "SP.Data.DataListListItem" },
            Title: title,
            Field_SingleLine: singleLine,
            Field_MultiLine: multiLine,
            Field_Number: parseInt(number),
            Field_PersonId: _spPageContextInfo.userId,
            Field_Date: date == "Invalid date" ? null : date,
            Field_Choice: choice,
            Field_HyperLink: { __metadata: { "type": "SP.FieldUrlValue" }, Url: hyperLink, Description: hyperLink },
            Field_Picture: { __metadata: { "type": "SP.FieldUrlValue" }, Url: picture, Description: picture },
            Field_Currency: parseInt(currency),
            Field_LookUpId: parseInt(lookup),
            Field_MultiplePersonsId: { "results": [_spPageContextInfo.userId, _spPageContextInfo.userId, _spPageContextInfo.userId] },
            Field_MultipleChoices: { "results": choiceArray },
            Field_MultipleLookUpId: { "results": lookUpArray }
        }),


        headers:
        {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE" ,
            "IF-MATCH": "*"
        },

        success: function (data) {

            alert("Item Updated successfully");
            window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/DataList/AllItems.aspx";
        },
        error: function (error) {
            console.log(JSON.stringify(error));

        }

    });

}








