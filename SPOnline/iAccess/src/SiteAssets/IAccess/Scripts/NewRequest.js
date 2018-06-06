$(window).on("load", function () {

    $(".mdl-layout__container").css("cssText", "position:relative !important");
    //$(".radioprimary").addClass("md-checked");
    //$(".md-checked").css("background-color", "white !important");
});

    
$(function () {
    // keys and configurations
    var configStoreListName = "Config Store";
    var configStoreCategory = "iAccess";
    var currentUser = null;
    var clientContext;
    var collListItem;
    var requestersId = [];
    var requestType = "";

    //$.showLoader();
   // $(".mdl-layout__container").css("cssText", "position:relative !important");
   
    var keyCollection = {
        "RepositoryListName": "", // default value
        "CommentBoxValidationMessage": "",
        "InitiateProcessSuccessMessage": "",
        "RequestorEmptyValidationMessage": "",
        "ManagerEmptyValidationMessage": "",
      
    };

   

    var keys = Object.keys(keyCollection);
    var query = new CamlBuilder()
        .Where().TextField("Key").In(keys)
        .And().TextField("Category").EqualTo(configStoreCategory).ToString();

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', start());



    function start() {
        console.log("process started");
        clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
        web = clientContext.get_web();
        var oList = web.get_lists().getByTitle(configStoreListName);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View><Query>' + query + '</Query></View>');
        collListItem = oList.getItems(camlQuery);
        currentUser = web.get_currentUser();
        clientContext.load(currentUser);
        clientContext.load(collListItem);
        clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));
    }

    function onQuerySucceeded(sender, args) {
        var listItemEnumerator = collListItem.getEnumerator();
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            if (!keyCollection[oListItem.get_item('Key')]) {
                keyCollection[oListItem.get_item('Key')] = oListItem.get_item('Title');
            }
        }
        $('#txtEmployeeID').val(currentUser.get_title());
        getManagerFromUserProfile(currentUser.get_loginName().split("|")[1]);
        initializePeoplePicker();
        //$.hideLoader();
    }

    function onQueryFailed(sender, args) {
        //$.hideLoader();
        //$.showError(args.get_message() + '\n' + args.get_stackTrace());
    }


    $("#btnCancel").click(function () {
        redirectToRefererPage();
    });
    $("#btnCancel1").click(function () {
        redirectToRefererPage();
    });

    $('#rdSelf').change(function () {
        toggleSelfOrEmployee();
    });

    $('#rdOther').change(function () {
        toggleSelfOrEmployee();
    });

    function toggleSelfOrEmployee() {
        if ($('#rdSelf').is(':checked')) {
            $('#divrequesters').hide();
            $('#divSelf').show();
            try {
                if (currentUser != null)
                    getManagerFromUserProfile(currentUser.get_loginName().split("|")[1]);
            } catch (e) { }
        }
        else {
            $('#divrequesters').show();
            $('#divSelf').hide();

            if (getOtherUserLoginName() != "") {
                getManagerFromUserProfile(getOtherUserLoginName().split("|")[1]);
            }
            else {
                $("#divManager").spPeoplePicker(null, null);
            }
        }
    }

    toggleSelfOrEmployee();

    $('#BtnSubmitConfirmed').click(function () {
        if (validateNewRequest()) {
            if ($(".requestfor input:radio:checked").first().parent().text().trim() != "Self") {
                getUserInfo();
            }
            else {
                saveNewRequest();
            }
        }
    });

    function saveNewRequest() {
        if (requestType == "Edit" || requestType == "") {
            if (validateNewRequest()) {
                // calling jquery plugin method for secondary level authentication
                $.performSecondLevelAuthentication(function (status) {
                    //$.showLoader();
                    // Get the people picker object from the page.
                    var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.divManager_TopSpan;
                    // Get information about all users.
                    var users = peoplePicker.GetAllUserInfo();
                    if (users.length > 0) {
                        var context = new SP.ClientContext.get_current();
                        var manager = context.get_web().ensureUser(users[0].Key);
                        context.load(manager);
                        context.executeQueryAsync(function () {
                            var item = [];
                            item.managerId = manager.get_id();
                            item.RequestFor = $(".requestfor input:radio:checked").first().parent().text().trim();
                            item.Comments = $("#txtRequestComments").val();
                            if (item.RequestFor == "Self") {
                                item.RequesterID = _spPageContextInfo.userId;
                            }
                            else {
                                item.RequesterID = requestersId[0];
                            }
                            item.Status = "Not Started";
                            var result = fnAddToList("ITRequest", getNewRequestItem(item));
                            if (result > 0) {
                                //$.hideLoader();
                                $.showInfo(keyCollection["InitiateProcessSuccessMessage"]);
                                setTimeout(redirectToRefererPage, 5000);
                            }
                        }, Function.createDelegate(null, onFail));
                    }
                });
            }
        }
    }

    function getNewRequestItem(requestItem) {
        var itemType = GetItemTypeForListName("ITRequest");
        if (requestType == "Edit" || requestType == "") {
            var admin = $.parseJSON($.replaceAll(requestItem.ITAdministratorId, "'", "\""));
            var item = {
                "__metadata": {
                    "type": itemType
                },
                "Title": "",
                "RequestFor": requestItem.RequestFor,
                "RequestType": requestItem.RequestType,
                "Comments": requestItem.Comments,
                "RequesterId": requestItem.RequesterID,
                "AdministratorId": admin,
                "ManagerId": requestItem.managerId,
                "RequestId": getRequestUniqueId(),
                "Status": requestItem.Status
            };
            return item;
        }
        else {
            var item = {
                "__metadata": {
                    "type": itemType
                },
                "Status": requestItem.Status
            };
            return item;
        }
    }
    function validateNewRequest() {
        if ($(".requestfor input:radio:checked").first().parent().text().trim() != "Self") {
            var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.requesters_TopSpan;
            // Get information about all users.
            var users = peoplePicker.GetAllUserInfo();
            if (users.length == 0) {
                //$.showError(keyCollection["RequestorEmptyValidationMessage"]);
                return false;
            }
        }
        // Get the people picker object from the page.
        var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.divManager_TopSpan;
        // Get information about all users.
        var users = peoplePicker.GetAllUserInfo();
        if (users.length == 0) {
            //$.showError(keyCollection["ManagerEmptyValidationMessage"]);
            return false;
        }
        if ($.trim($('#txtRequestComments').val()) == "") {
            //$.showError(keyCollection["CommentBoxValidationMessage"]);
            return false;
        }
        return true;
    }

    function initializePeoplePicker() {
        var requesters = $("#requesters");
        requesters.spPeoplePicker(null);
        this.SPClientPeoplePicker.SPClientPeoplePickerDict.requesters_TopSpan.OnUserResolvedClientScript = onUserChanged;
    }

    //Function to get parameter value from the Query string
    function GetParamValuesByName(querystring) {
        name = querystring.replace(/[[]/, "\[").replace(/[]]/, "\]");
        var regexS = "[\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace("/+/g", " "));
        }
    }

   

   
    function AssignPeoplePicker(requesterid) {
        $.requesters = [1];
        clientContext = new SP.ClientContext.get_current();
        var web = clientContext.get_web();
        $.requesters[0] = web.getUserById(requesterid);
        clientContext.load($.requesters[0]);
        clientContext.executeQueryAsync(function () {
            var requestedUsers = new Array(1);
            var user;
            user = new Object();
            var requesterID = $.requesters[0];
            user.AutoFillDisplayText = requesterID.get_title();
            user.AutoFillKey = requesterID.get_loginName();
            user.Description = requesterID.get_email();
            user.DisplayText = requesterID.get_title();
            user.EntityType = "User";
            user.IsResolved = true;
            user.Key = requesterID.get_loginName();
            user.Resolved = true;
            $.requesters[0] = user;
            $("#requesters").spPeoplePicker($.requesters, null);

            this.SPClientPeoplePicker.SPClientPeoplePickerDict.requesters_TopSpan.OnUserResolvedClientScript = onUserChanged;

            if (requestType = "View") {
                setTimeout(function () {
                    $("#requesters span").attr("disabled", true);
                    $("#requesters input").attr("disabled", true)
                    $("#requesters a").remove();
                }, 10000);
            }
        });
    }

    function onUserChanged(peoplePickerId, selectedUsersInfo) {
        if (selectedUsersInfo.length > 0)
            getManagerFromUserProfile(selectedUsersInfo[0].Key.split('|')[1]);
    }

    function getOtherUserLoginName() {
        // Get the people picker object from the page.
        var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.requesters_TopSpan;
        // Get information about all users.
        var users = peoplePicker.GetAllUserInfo();
        if (users.length > 0)
            return users[0].Key;
        else {
            return "";
        }
    }

    // Query the picker for user information.
    function getUserInfo() {
        if (getOtherUserLoginName() != "")
            getUserId(getOtherUserLoginName());
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
        requestersId.push(this.user.get_id());
        saveNewRequest();
    }

    function onFail(sender, args) {
        //$.showError('Query failed. Error: ' + args.get_message());
    }

    function redirectToRefererPage() {
        var ref = document.referrer;
        if (ref) {
            window.location.href = document.referrer;
        }
        else {
            // redirect
            window.location.href = _spPageContextInfo.webAbsoluteUrl;
        }
    }

    function getManagerFromUserProfile(loginName) {
        var requestHeaders = {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        };

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Manager')?@v='" + loginName + "'",
            type: "GET",
            data: {},
            async: false,
            contentType: "application/json;odata=verbose",
            headers: requestHeaders,
            success: function (data) {
                if (data.d.GetUserProfilePropertyFor != null && data.d.GetUserProfilePropertyFor != "") {
                    $('#divManager').html(data.d.GetUserProfilePropertyFor);
                    assignManagerPeoplePicker(data.d.GetUserProfilePropertyFor);
                }
                else {
                    $("#divManager").spPeoplePicker(null, null);
                }
            },
            error: function (jqxr, errorCode, errorThrown) {
                $("#divManager").spPeoplePicker(null, null);
            }
        });
    }

    function assignManagerPeoplePicker(managerLoginName) {
        $.requesters = [1];
        clientContext = new SP.ClientContext.get_current();
        var web = clientContext.get_web();
        $.requesters[0] = web.ensureUser(managerLoginName);
        clientContext.load($.requesters[0]);
        clientContext.executeQueryAsync(function () {
            var requestedUsers = new Array(1);
            var user;
            user = new Object();
            var requesterID = $.requesters[0];
            user.AutoFillDisplayText = requesterID.get_title();
            user.AutoFillKey = requesterID.get_loginName();
            user.Description = requesterID.get_email();
            user.DisplayText = requesterID.get_title();
            user.EntityType = "User";
            user.IsResolved = true;
            user.Key = requesterID.get_loginName();
            user.Resolved = true;
            $.requesters[0] = user;
            $("#divManager").spPeoplePicker($.requesters, null);
            //setTimeout(disablePicker, 1000);
        });
    }

    function disablePicker() {
        var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.divManager_TopSpan;
        if (peoplePicker != null) {
            peoplePicker.SetEnabledState(false);
        }
        else {
            setTimeout(disablePicker, 1000);
        }
    }

    generateRequestUniqueId();

    function generateRequestUniqueId() {
        $('#lblRequestUniqueId').html(getCombination() + "XXXXXXX");
    }

    function getRequestUniqueId() {
        var combination = getCombination();
        var number = "0000000" + getMaximumId();
        combination += number.substring(number.length - 7);
        return combination;
    }

    function getCombination() {
        var requestId = '';
        if ($("#ddlPlant").val() != "Select") {
            requestId += $("#ddlPlant option:selected").text().substring(0, 4);
            if ($("#ddlDepartment").val() != null && $("#ddlDepartment").val() != "Select") {
                requestId += $("#ddlDepartment option:selected").text().substring(0, 4);
            }
        }
        requestId += new Date().getFullYear().toString().substring(2);
        return requestId;
    }

    function getMaximumId() {
        var maximumRecordIdinList = 0;
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('GMPRequest')/items?$select=ID&$orderby=ID desc&$top=1";
        var requestHeaders = {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        };
        $.ajax({
            url: url,
            type: "GET",
            data: {},
            async: false,
            contentType: "application/json;odata=verbose",
            headers: requestHeaders,
            success: function (data) {
                if (data != null && data.d != null && data.d.results != null && data.d.results.length > 0) {
                    maximumRecordIdinList = data.d.results[0].ID;
                }
            },
            error: function (jqxr, errorCode, errorThrown) {
            }
        });
        return maximumRecordIdinList;
    }
});