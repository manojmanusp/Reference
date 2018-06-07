// Run your custom code when the DOM is ready.
$(document).ready(function () {

    // Specify the unique ID of the DOM element where the
    // picker will render.
    initializePeoplePicker('pplEmployee');
    initializePeoplePicker('pplManagers');
    
});

$(window).on("load",function()
{
    $('.radio').change(function () {  
        
        if($(this).val() == "Self")
        {
            
            AddUserToPeoplePicker();
            getManagerFromUserProfile();
            
        }
        else{
            RemoveUsersFromPeoplePicker("pplEmployee");
            RemoveUsersFromPeoplePicker("pplManagers");
        }
    });
});

// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId) {

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = false;
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
    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);
    context.executeQueryAsync(
         Function.createDelegate(null, ensureUserSuccess), 
         Function.createDelegate(null, onFail)
    );
}

function ensureUserSuccess() {
    $('#userId').html(this.user.get_id());
}

function onFail(sender, args) {
    alert('Query failed. Error: ' + args.get_message());
}

function getManagerFromUserProfile() {
                
    var requestHeaders = {
        "Accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    };
    var urlValue = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Manager')?@v='i:0%23.f|membership|murali@chennaitillidsoft.onmicrosoft.com'";
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
          
        }
    });
}


function AddUserToPeoplePicker()
{
    var userField = $("input[class='sp-peoplepicker-editorInput']").get(0); // simplified user control search, real word scenario, first search proper row in your form
    var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(userField);
    peoplepicker.AddUserKeys(_spPageContextInfo.userLoginName); // or display name
    $("#pplEmployee_TopSpan_ResolvedList").find("span[class='sp-peoplepicker-userSpan']").find("a").css("display","none");
    var spclientPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict["pplEmployee_TopSpan"];
    spclientPeoplePicker.SetEnabledState(false);
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