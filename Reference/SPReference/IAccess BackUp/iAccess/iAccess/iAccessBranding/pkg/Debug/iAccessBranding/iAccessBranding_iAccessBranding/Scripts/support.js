var qs = getQueryStrings();
var MembershipGroupId = qs["MembershipGroupId"];
$(document).ready(function () {
    $('#suiteBarLeft').children().wrap('<a href="' + _spPageContextInfo.webAbsoluteUrl + '/SitePages/Dashboard.aspx" style="text-decoration:none;cursor:pointer"></a>');
});
var g_pageLoadAnimationParams = { elementSlideIn: "sideNavBox", elementSlideInPhase2: "contentBox" };
var currentYear = (new Date()).getFullYear();
$('document').ready(function () {
    var path = "";
    var href = window.location.pathname;
    var groupPath = window.location.pathname;
    var s = href.split("/");
    var i = 5;
    var j = 3;
    var k = 4;
    if (MembershipGroupId != null && MembershipGroupId != undefined && MembershipGroupId != "undefined" && MembershipGroupId != "") {
        var url = "/_api/Web/SiteGroups/GetById(" + MembershipGroupId + ")"
        var getGroupName = getListItem(url, false);
        path = "<A HREF=" + _spPageContextInfo.webAbsoluteUrl + "/SitePages/Dashboard.aspx>Home</A> | <A HREF=" + groupPath + "?MembershipGroupId=" + MembershipGroupId + ">" + getGroupName + "</A>";
    } else if (s[k] == "Lists") {
        path = "<A HREF=\"" + href.substring(0, href.indexOf("/" + s[j]) + s[j].length + 1) + "/\">Home</A> | <A HREF=\"" + href.substring(0, href.indexOf("/" + s[i]) + s[i].length + 1) + "/\">" + s[i].replace("%20", " ") + "</A>";
    } else if (s[i] == "Forms") {
        path = "<A HREF=\"" + href.substring(0, href.indexOf("/" + s[j]) + s[j].length + 1) + "/\">Home</A> | <A HREF=\"" + href.substring(0, href.indexOf("/" + s[k]) + s[k].length + 1) + "/\">" + s[k].replace("%20", " ") + "</A>";
    }
    $("#contentrow").prepend('<div id="BreadCrumb">' + path + '</div>');
    AppendMenuFontAwesomeIcons();
    $("#siteactiontd").append('<span href="javascript:void(0);" onclick="javascript:introJs().start();"><i style="color:white;cursor:pointer" class="material-icons">important_devices</i><span>');
    $('.ms-core-brandingText').css("padding-left", "180px");
    $('.ms-core-brandingText').html("iAccess");
    $('.ms-core-brandingText').css("color", "white");
    $('.ms-core-brandingText').css("font-size", "25px");
    $('.ms-core-brandingText').css("font-stretch", "expanded");
    $('.ms-core-brandingText').css("font-weight", "600");
    $("#year").text(currentYear);

    //$('#s4-ribbonrow').hide();


    //Table
    $('.table1 table').stackedRows();
    $('.table2 table').stackedRows({
        firstRowHeader: false
    });
    $('.table3 table').stackedRows({
        altRowStyle: false
    });

    $("#show-view-request").hide();

    $("#show-pending-approval").hide();

    $(document).on("click", "#view-request", function (e) {
        $("#show-view-request").show();
        return false;
    });

    $(document).on("click", "#pending-approval", function (e) {
        $("#show-pending-approval").show();
        return false;
    });

    //       For Menu Icons       //

    function AppendMenuFontAwesomeIcons() {
        var elements = document.querySelectorAll('ul[id^=zz][id$=_RootAspMenu] li span.menu-item-text');

        for (var i = 0; i < elements.length; i++) {
            var icon = "";
            // Set the FontAwesome icon based on the text of the menu item...
            switch (elements[i].innerHTML) {
                case 'Home':
                    icon = 'home';
                    break;
                case 'Dashboard':
                    icon = 'dashboard';
                    break;
                case 'Search':
                    icon = 'search';
                    break;
                case 'Reports':
                    icon = 'insert_chart';
                    break;
                case 'Master Data':
                    icon = 'settings';
                    break;
                case 'Help':
                    icon = 'help_outline';
                    break;
                case 'User Mapping':
                    icon = 'description';
                    break;
                case 'Admin':
                    icon = 'people';
                    break;

            }
            elements[i].innerHTML = '<i class="material-icons" id=' + icon + ' style="position:absolute;margin-left:-28px;">' + icon + '</i>' + elements[i].innerHTML;
        }
    }
    _spBodyOnLoadFunctionNames.push('AppendMenuFontAwesomeIcons');
});

$(window).resize(function () {
    var width = $(window).width();
    if (width < "500") {
        $("#description").parent().parent().parent().parent().attr("style", "display:none!important");
        $("#settings").parent().parent().parent().parent().attr("style", "display:none!important");
    } else {
        $("#description").parent().parent().parent().parent().attr("style", "display:grid");
        $("#settings").parent().parent().parent().parent().attr("style", "display:grid");
    }
});

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
                ListItem = data.d.LoginName;
            }
        },
        error: function (data) {
            //AddErrorLog("getListItem", data.message);
        }
    });
    return ListItem;
}
