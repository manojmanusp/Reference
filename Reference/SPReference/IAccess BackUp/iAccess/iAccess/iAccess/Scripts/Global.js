var width = "";
var currencyFor = "";
//for Inserting Item to the List

/* For upload Document */
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function uploadDocument(AttachmentArray, TransactionId, cycle) {
    if (cycle == undefined || cycle == null || cycle == "") {
        cycle = 100;
    }
    if (!window.FileReader) {
        alert("This browser does not support the HTML5 File APIs");
        return;
    }

    if (AttachmentArray != null && AttachmentArray.length > 0) {
        for (i = 0; i < AttachmentArray.length; i++) { 
            var fileName = AttachmentArray[i].Filename;
            fileName = fileName.splice(fileName.lastIndexOf("."), 0, "_" + TransactionId.toString());
            Upload(AttachmentArray[i].Content, fileName, TransactionId, cycle);
        }
    }
}

function Upload(buffer, fileName, TransactionId, cycle) {
    var url = String.format(
        "{0}/_api/Web/Lists/getByTitle('PPSRMDocumentAttachements')/RootFolder/Files/Add(url='{1}', overwrite=true)?$expand=ListItemAllFields",
        _spPageContextInfo.webAbsoluteUrl, fileName);
    $.ajax({
        url: url,
        type: "POST",
        data: buffer,
        //contentType: "application/json;odata=verbose;charset=utf-8",
        async: false,
        processData: false,
        headers: {
            Accept: "application/json;odata=verbose;charset=utf-8",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()//,
            //"Content-Length": buffer.byteLength
        },
        success: function (data) {
            updateItemFields(data.d.ListItemAllFields.Id, TransactionId, true);
        },
        error: function (data) {
            //alert('Error on add content to upload documents' + data.message);
            //AddErrorLog("Upload Document",data.message);
        }
    });
}

function updateItemFields(docID, TransactionId, boolValue, cycle) {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('PPSRMDocumentAttachements')/Items(" + docID + ")";
    var saveObj = {
        "__metadata": { "type": "SP.Data.PPSRMDocumentAttachementsItem" },
        'TransactionId': TransactionId,
        'Active': boolValue
    };
    if (cycle != undefined && cycle > 0 && cycle != 100) {
        saveObj['Cycle'] = cycle;
    }


    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data: JSON.stringify(saveObj),
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": "*"
        },
        success: function (data) {

        },
        error: function (data) {
            //alert('Error while update the metadata in document library' + data.message);
            //AddErrorLog("Error while update the metadata in document library",data.message);
        }
    });
}


/* End Upload Document */
function AddItem(url, items, callbackfn) {
    var ID = "";
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + url,
        type: "POST",
        contentType: "application/json;odata=verbose",
        async: false,
        data: JSON.stringify(items),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            if (callbackfn != undefined && callbackfn != null && typeof (callbackfn) == "function") {
                callbackfn(data.d.ID);
            }
            ID = data.d.ID;
        },
        error: function (data) {
            debugger;
        }
    });
    return ID;
}

//for Get List Items

function getListItem(url, idFlag) {
    var ListItem = "";
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + url,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        }, success: function (data) {
            if (idFlag) {
                ListItem = data.d;
            }
            else {
                ListItem = data.d.results;
            }
        },
        error: function (data) {
            //AddErrorLog("getListItem", data.message);
        }
    });
    return ListItem;
}

//for PeoplePicker user Name

function getUserNameFromGroup(e) {
    var pplPickerId = e.id;
    $("#AppendUserName").html('');
    $('.userTable').DataTable().destroy();
    //switch (pplPickerId) {
    //case 'SCMMember':
    var url = "/_api/web/sitegroups/getbyname('SCM Members')/users";//Should Be Changed
    var pplSCMMember = getListItem(url, false);
    var string = "";
    pplSCMMember.forEach(function (items) {
        var LoginName = items.LoginName;
        LoginName = LoginName.split('\\');
        LoginName = LoginName[1];
        string += '<tr><td><a href="#" data-dismiss="modal" onclick="bindName(\'' + LoginName + ',' + pplPickerId + '\');">' + items.Title + '</a></td><td>' + items.Email + '</td><td>' + LoginName + '</td></tr>';
    });
    $("#AppendUserName").html(string);
    // break;
    //  default:
    //        break;
    //  }

    $('.userTable').DataTable({ fixedHeader: true });
    $('.userTable').removeAttr('style');
    $('.table > thead > tr > th').removeAttr('style');
}

//Bind User Name to the People Picker

function bindName(SCMMemberIds) {
    SCMMemberIds = SCMMemberIds.split(',');
    var divName = SCMMemberIds[1] + "_TopSpan"
    var divPeople = SPClientPeoplePicker.SPClientPeoplePickerDict[divName];
    var userObj = { 'Key': SCMMemberIds[0] };
    divPeople.AddUnresolvedUser(userObj, true);
}

//Get User Profiles

function getManagerFromUserProfile(profileName, currentPage) {
    var currentPage = currentPage;
    profileName = profileName.split("|");
    profileName = profileName[1];
    var requestHeaders = {
        "Accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    };
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='Manager')?@v='" + profileName + "'",
        type: "GET",
        data: {},
        async: false,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: function (data) {
            //alert(data.d.GetUserProfilePropertyFor);
            $("#hdnManagerId").val(data.d.GetUserProfilePropertyFor);
        },
        error: function (jqxr, errorCode, errorThrown) {
        }
    });
}

//To Format Date & Time
/*function getHolidayFormatDate(objDate) {
    objDate = new Date(objDate);
    return objDate.format("yyyy-MM-dd");
}*/

function GetFormattedDateandTime(objDate) {
    if (objDate != null && objDate != undefined && objDate != "undefined" && objDate != "" && objDate != "null") {
        objDate = new Date(objDate);
        return objDate.format("dd-MMM-yyyy");
    }
}

//For Mobile Responsive Feature

$(window).resize(function () {
    width = $(window).width();
    if (width < "835") {
        $(".table-responsive-vertical .table > tbody > tr > td:first-child").css("display", "block");
        $(".table-responsive-vertical .table > tbody > tr > td:not(:first-child)").css("display", "none");
        $('#PendingRequestIcon').html('<i class="material-icons">queue</i>');
        $('#PublishedRequestIcon').html('<i class="material-icons">done_all</i>');
        $('#PendingApprovalIcon').html('<i class="material-icons">assignment_late</i>');
        $('#AlreadyApprovedIcon').html('<i class="material-icons">library_books</i>');
        $("#TableName").show();
        $("#TableName").html($('.mdl-tabs__tab.is-active').attr("title"));
    } else {
        $(".table-responsive-vertical .table > tbody > tr > td:first-child").css("display", "none");
        $("tr td:not(:first-child)").css("display", "table-cell");
        $('#PendingRequestIcon').html('Pending Requests');
        $('#PublishedRequestIcon').html('My Completed Request');
        $('#PendingApprovalIcon').html('Pending activities');
        $('#AlreadyApprovedIcon').html('Already completed activities');
        $("#TableName").hide();
    }
});

//To Toggle the Table in Mobile Responsive

function tableShow(objChk) {
    var width = $(window).width();
    if (width < "835") {
        if ($("#tr" + objChk + " td:not(:first-child)").css("display") == "block") {
            $("#tr" + objChk + " td:not(:first-child)").css("display", "none");
        }
        else {
            $("#tr" + objChk + " td:not(:first-child)").css("display", "block");

        }
    }

};

//To get User Login name

function GetCurrentUsername() {
    var ctxt = new SP.ClientContext.get_current();
    this.website = ctxt.get_web();
    this.currentUser = website.get_currentUser();
    ctxt.load(currentUser);
    ctxt.executeQueryAsync(Function.createDelegate(this, this.onSucceess), Function.createDelegate(this, this.onFail));
}



function onSucceess(sender, args) {
    var userName = currentUser.get_title();
    var loginName = currentUser.get_loginName()
    getManagerFromUserProfile(loginName);
}



function onFail(sender, args) {

}


//To Get Query String Values

function getQueryStrings() {
    var assoc = {};
    var decode = function (s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');
    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }
    return assoc;
}


//To Update List Item

function Update(endpointUri, payload, callbackfn) {
    //var Flag = false;
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + endpointUri,
        type: "POST",
        async: false,
        data: JSON.stringify(payload),
        contentType: "application/json;odata=verbose",
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": "*"
        },
        success: function (data) {
            if (callbackfn != undefined && callbackfn != null && typeof (callbackfn) == "function") {
                var matches = endpointUri.match(/items\((.*)\)/);
                if (matches != null && matches.length > 1) {
                    callbackfn(matches[1]);
                }
            }
            // Flag = true;
        },
        error: function (data) {
            alert("Error while update the request" + data.responseText);
            //AddErrorLog("Error while update the Request", data.responseText);
            //Flag = false;
        }
    });
    // return Flag;
}

//to Set Title in Mobile View

function tableTitle(e) {
    if (e != undefined && e != "undefined") {
        var title = e.title;
        if (width < "835") {
            $("#TableName").show();
            $("#TableName").html(title);
        } else {
            $("#TableName").hide();
        }
    }
}

function GetAttachments(transactionId) {
    var documentUrl = "/_api/Web/Lists/GetByTitle('PPSRMDocumentAttachements')/Items?$select=ID,EncodedAbsUrl,LinkFilename,Created,TransactionId&$filter=(TransactionId eq '" + transactionId + "' and Active eq 1)";
    return getListItem(documentUrl, false);
}

//To get User Group 
function IsMember() {
    var URL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/?$expand=groups";
    $.ajax({
        url: URL,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            Groups = data.d.Groups.results;
        },
        error: function () {
            //alert("Error Occured while retrieving userinfo");
        }
    });

    return Groups;
}
function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[a-zA-Z0-9'.,\b.,&\s]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}


function getCurrencyType(e) {
    currencyFor = e.attributes["for"].value;
    $('.cssload-container').show();
    var getCurrencyUrl = "/_api/Web/Lists/GetByTitle('Currency')/Items";
    var getCurrencyList = getListItem(getCurrencyUrl, false);
    var string = "";
    $(getCurrencyList).each(function (index, item) {
        if (item.HexaCode != "undefined" && item.HexaCode != null && item.HexaCode != undefined && item.HexaCode != "") {
            var HexaCode = item.HexaCode.indexOf(",");
            if (HexaCode > -1) {
                item.HexaCode = item.HexaCode.replace(/,/g, '&#x');
            }
        }
        if (item.Title == "INR") {
            item.HexaCode = "&#2352";
        } else {
            item.HexaCode = "&#x" + item.HexaCode;
        }
        string += '<tr id=' + item.Title + '><td><a onclick="bindValue(this);" data-dismiss="modal" class="' + item.Title + '"</a>' + item.Title + '</td><td style="font-size:large">' + item.HexaCode + '</td></tr>';
    });
    $("#AppendCurrency").append(string);
    $('.currencyTable').DataTable().destroy();
    $('.currencyTable').DataTable();
    $('.cssload-container').hide();
}

function bindValue(e) {
    var foo = $("#" + e.className).text().split("-").join(""); // remove hyphens
    if (foo.length > 0) {
        foo = foo.match(new RegExp('.{1,3}', 'g')).join("-");
    }
    $("#" + currencyFor).val(foo);
    //$("#"+currencyFor).val($("#"+e.className).text());
}


function GetQueryStrings() {
    var assoc = {};
    var decode = function (s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');
    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }
    return assoc;
}