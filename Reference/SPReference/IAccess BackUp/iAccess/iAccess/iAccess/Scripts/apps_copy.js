var Invoice_Prj_Name = [];
var Invoice_Cr_Name = [];
var Invoice_Status = [];
var Invoice_querystring = "";
var CR_querystring = "";
var contacts = [];
var Client_Cr_Name = [];
var Client_Prj_Name = [];
var Client_Status = [];
var Client_Type = [];
var efforts = [];
var crs = [];



var configStoreListName = "Config Store";
var configStoreCategory = "iAccess";
var currentUser = null;
var clientContext;
var collListItem;
var requestersId = [];
var requestType = "";

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

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', checkSP());

function checkSP() {
    console.log("sp.js loaded");
}





$(window).on("load", function () {

    $(".mdl-layout__container").css("cssText", "position:relative !important");

});

var blankapp = angular.module('BlankApp', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'peoplePickerCombo']);

blankapp.controller("clientcontroll", ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {

    //$scope.data = {
    //    group1: 'Self'
    //}   
    //$scope.result = "self";
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
    clientContext.executeQueryAsync(onQuerySucceeded, onQueryFailed);


    function onQuerySucceeded(sender, args) {
        var listItemEnumerator = collListItem.getEnumerator();
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            if (!keyCollection[oListItem.get_item('Key')]) {
                keyCollection[oListItem.get_item('Key')] = oListItem.get_item('Title');
            }
        }
        $scope.EmployeeID = currentUser.get_title();
        $scope.RadioChange = function (s) {
            if (s == "Self") {

                $scope.EmployeeID = currentUser.get_title();
                $("#txtEmployeeID").attr("ng-readonly", "true");
                $("#txtEmployeeID").attr("readonly", "readonly");
                console.log("value added");
            }


            else {
                $scope.EmployeeID = "";
                $("#txtEmployeeID").attr("ng-readonly", "false");
                $("#txtEmployeeID").removeAttr("readonly");
            }

        };
        //$scope.radioChanged = function (item) {
        //    console.log(item);

        //        console.log("radio changed");
        //        if ($scope.result == "self") {
        //            $scope.EmployeeID = currentUser.get_title();
        //            console.log("value added");
        //        }


        //    else {
        //        $scope.EmployeeID = "";
        //    }

        //};

        // getManagerFromUserProfile(currentUser.get_loginName().split("|")[1]);
        // initializePeoplePicker();
        //$.hideLoader();
    }

    function onQueryFailed(sender, args) {
        //$.hideLoader();
        //$.showError(args.get_message() + '\n' + args.get_stackTrace());
    }
    contacts_user();
    var vm = this;

    //Simulate a service
    vm.userLookupService = function (q) {
        var d = $q.defer();
        //debugger;
        $timeout(function () {
            var list = contacts;
            list = list.map(function (a, i) {
                return {
                    UserName: i
                    , Name: a.Name
                    , DisplayName: a.Title
                    , Email: a.Id

                }
            });
            var r = new RegExp(q, 'ig');
            var response;
            if (angular.isNumber(q)) {
                response = [list[q]];
            }
            else response = (list.filter(function (a) {
                return r.test(a.DisplayName);
            }).slice(0, 10));
            d.resolve(response);
        }, 100);
        return d.promise;
    };

    //New Code  
    $scope.$watch('ctrl.users', function (newval, oldval) {
        if (angular.isDefined(newval) && newval.length > 0) {
            vm.isMandatory = false;
            $("people-picker").removeClass("Mandatory");
        }
        else if (angular.isDefined(oldval)) {
            vm.isMandatory = true;
            $("people-picker").addClass("Mandatory");
        }
    }, true);

    var Client_listDisplayName = "Client";
    var Account_Manager_Entry = [];
    var Client_Name_Entry = "";
    var Location_Entry = "";
    var Billing_Address_Entry = "";
    var Contact_Mobile_Entry = "";
    var Client_querystring = "";
    var querystring_mode = ""
    Client_querystring = $.getUrlVar('ITrack_ID');
    querystring_mode = $.getUrlVar('Mode');
    if (Client_querystring == "") {
        $(".heading_title").html("New Client");
    }
    else {
        $("#btnsave > span").html("Update");
        $(".heading_title").html("Edit Client");
        EditFormEntry();
    }
    function EditFormEntry() {
        querystring_mode = $.getUrlVar('Mode');
        if (querystring_mode == "disp") {
            $scope.isClicked = true;
            $(".heading_title").html("View Client");
            $(".formbtnbg").hide();
            $(".formbackbtnbg").show();
        }
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Client_listDisplayName + "')/items(" + Client_querystring + ")?$select=Title,ID,Location,BillingAddress,Contact,AccountManager/Id,AccountManager/Title,AccountManager/Name&$expand=AccountManager";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                var accountmanager = [];
                $scope.firstname = data.d.Title;
                $scope.Location = data.d.Location;
                $scope.BillingAddress = data.d.BillingAddress;
                $scope.ContactDetails = data.d.Contact;
                if (data.d.AccountManager != null) {
                    if (data.d.AccountManager.results.length > 0) {
                        for (var a = 0; a < data.d.AccountManager.results.length; a++) {
                            accountmanager.push(data.d.AccountManager.results[a].Name.toString());
                        }
                    }
                }
                vm.users = accountmanager;
                vm.userLookupService = function (q) {
                    var d = $q.defer();
                    $timeout(function () {
                        var list = contacts;
                        list = list.map(function (a, i) {
                            return {
                                UserName: i
                                , Name: a.Name
                                , DisplayName: a.Title
                                , Email: a.Id

                            }
                        });
                        var r = new RegExp(q, 'ig');
                        var response;
                        if (angular.isNumber(q)) {
                            response = [list[q]];
                        } else response = (list.filter(function (a) {
                            return r.test(a.Name);
                        }).slice(0, 10));
                        d.resolve(response);
                    }, 100);

                    return d.promise;

                };
                //New Code  
                $scope.$watch('ctrl.users', function (newval, oldval) {
                    if (angular.isDefined(newval) && newval.length > 0) {
                        vm.isMandatory = false;
                        $("people-picker").removeClass("Mandatory");
                    }
                    else if (angular.isDefined(oldval)) {
                        vm.isMandatory = true;
                        $("people-picker").addClass("Mandatory");
                    }


                }, true);

            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
        $("#btnsave > span").html("Update");
    }
    $scope.goBack = function () {
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/Client.aspx"
    }
    $scope.saveitem = function () {
        $scope.isClicked = true;
        $(".load_con").show();
        FormEntry();
        BindClientEntry();
        function FormEntry() {
            Client_Name_Entry = $scope.firstname;
            Location_Entry = $scope.Location;
            Billing_Address_Entry = $scope.BillingAddress;
            Contact_Mobile_Entry = $scope.ContactDetails;
            if ($scope.ctrl.users.length > 0) {
                for (var con_i = 0; con_i < $scope.ctrl.users.length; con_i++) {
                    Account_Manager_Entry.push($scope.ctrl.users[con_i].Email);
                }
            }
            console.log(Account_Manager_Entry);
        }
        function BindClientEntry() {
            var requestUri = "";
            var Header_Body = "";
            if (Client_querystring != "") {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Client_listDisplayName + "')/items(" + Client_querystring + ")";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                }
            }
            else {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Client_listDisplayName + "')/items";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }
            var itemtype = getListItemType(Client_listDisplayName);
            $.ajax(
                {
                    url: requestUri,
                    async: false,
                    type: "POST",
                    data: JSON.stringify({
                        '__metadata': { 'type': itemtype },
                        'Title': Client_Name_Entry,
                        'Location': Location_Entry,
                        'BillingAddress': Billing_Address_Entry,
                        'Contact': Contact_Mobile_Entry,
                        'AccountManagerId': {
                            results: Account_Manager_Entry
                        }
                    }),
                    headers: Header_Body,
                    success: function (data) {
                        //window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/Clients.aspx";
                        window.location.href = document.referrer;
                    },
                    error: function (err) {
                        $scope.isClicked = false;
                        $(".load_con").hide();

                        console.log("Feedback List Item Error Message: " + JSON.stringify(err));
                    }
                });
        }

    };
    $scope.cancelitem = function () {
        window.location.href = document.referrer;
    }
    $scope.clearitem = function () {
        $scope.firstname = "";
        $scope.Location = "";
        $scope.BillingAddress = "";
        $scope.ContactDetails = "";
        $scope.ctrl.contacts = [];
    }
}]);
//Client Controller Ended


//Project Screen Controller Started
blankapp.controller("projectscontroll", ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {
    contacts_user();

    //New Code
    var vm = this;
    //vm.users = [];
    //Simulate a service
    vm.userLookupService = function (q) {
        var d = $q.defer();
        //debugger;
        $timeout(function () {
            var list = contacts;
            list = list.map(function (a, i) {
                return {
                    UserName: i
                    , Name: a.Name
                    , DisplayName: a.Title
                    , Email: a.Id

                }
            });
            var r = new RegExp(q, 'ig');
            var response;
            if (angular.isNumber(q)) {
                response = [list[q]];
            } else response = (list.filter(function (a) {
                return r.test(a.Name);
            }).slice(0, 10));
            d.resolve(response);
        }, 100);

        return d.promise;

    };
    //New Code  
    $scope.$watch('ctrl.users', function (newval, oldval) {
        if (angular.isDefined(newval) && newval.length > 0) {
            vm.isMandatory = false;
            $("people-picker").removeClass("Mandatory");
        }
        else if (angular.isDefined(oldval)) {
            vm.isMandatory = true;
            $("people-picker").addClass("Mandatory");
        }


    }, true);


    var project_listDisplayName = "Project";
    var Project_Manager_Entry = [];
    var Project_Name_Entry = "";
    var Client_Name_Entry = "";
    var Status_Entry = "";
    var Type_Entry = "";
    var Amount_Entry = "";
    var Total_cost_Entry = "";
    var project_querystring = "";
    project_querystring = $.getUrlVar('ITrack_ID');
    $scope.prjnameitems = [];
    $scope.statusitems = [];
    $scope.crnameitems = [];
    $scope.typeitems = [];
    DrpClientName();
    LoadStatusDropdown();
    LoadTypeDropdown();
    //Client Drop Down Bind Method Started
    function DrpClientName() {
        var clientnamehtml = "";
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Client')/items";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    if (data.d.results.length > 0) {
                        Client_Cr_Name.push({ Title: "Select", ID: "Select" });
                        for (var i = 0; i < data.d.results.length; i++) {
                            Client_Cr_Name.push({ Title: data.d.results[i].Title, ID: data.d.results[i].ID });
                        }
                        $scope.crnameitems = Client_Cr_Name;
                    }
                }

            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
    }
    //Client Drop Down Bind Method Ended

    //Other DropDown Bind Method Started
    function LoadStatusDropdown() {
        // and StaticName eq 'ProjectType'
        var requesturl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + project_listDisplayName + "')/fields?$filter=StaticName eq 'Status'";
        $.ajax({
            url: requesturl,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" },
            async: false,
            success: function (data) {
                if (data.d.results) {
                    Client_Status.push({ Title: "Select", ID: "Select" });
                    for (var j = 0; j < data.d.results[0].Choices.results.length; j++) {
                        Client_Status.push({ Title: data.d.results[0].Choices.results[j], ID: data.d.results[0].Choices.results[j] });
                    }
                    $scope.statusitems = Client_Status;

                }
            },
            error: function (xhr) {
                //alert(xhr.status + ': ' + xhr.statusText);
            }
        });
    }
    function LoadTypeDropdown() {
        // and StaticName eq 'ProjectType'
        var requesturl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + project_listDisplayName + "')/fields?$filter=StaticName eq 'ProjectType'";
        $.ajax({
            url: requesturl,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" },
            async: false,
            success: function (data) {
                if (data.d.results) {
                    Client_Type.push({ Title: "Select", ID: "Select" });
                    for (var j = 0; j < data.d.results[0].Choices.results.length; j++) {
                        Client_Type.push({ Title: data.d.results[0].Choices.results[j], ID: data.d.results[0].Choices.results[j] });
                    }
                    $scope.typeitems = Client_Type;

                }
            },
            error: function (xhr) {
                //alert(xhr.status + ': ' + xhr.statusText);
            }
        });
    }
    //Other DropDown Bind Method Ended
    if (project_querystring == "") {
        $(".heading_title").html("New Project");
    }
    else {
        $("#btnsave").html("Update");
        $(".heading_title").html("Edit Project");
        EditFormEntry();
    }
    function EditFormEntry() {
        var querystring_mode = "";
        querystring_mode = $.getUrlVar('Mode');
        if (querystring_mode == "disp") {
            $scope.isClicked = true;
            $(".heading_title").html("View Project");
            $(".formbtnbg").hide();
            $(".formbackbtnbg").show();
        }

        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + project_listDisplayName + "')/items(" + project_querystring + ")?$select=ProjectType,Status,Title,TotalAmount,Client/Id,Client/Title,Manager/Id,Manager/Title,Manager/Name&$expand=Client,Manager";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                $scope.amount = data.d.TotalAmount;
                //$scope.totalcost = data.d.Total_x0020_Cost;
                $scope.projectname = data.d.Title;
                if (data.d.Client.Id != null) {
                    //$("#drpclientname").val(data.d.Client_x0020_Name.Id);
                    $scope.crname = data.d.Client.Id;
                }
                else {
                    //$("#drpclientname").val("Select");
                    $scope.crname = "Select";
                }
                if (data.d.Status != null) {
                    $scope.status = data.d.Status;
                }
                else {
                    $scope.status = "Select";
                }
                if (data.d.ProjectType != null) {
                    $scope.type = data.d.ProjectType;
                }
                else {
                    $scope.type = "Select";
                }
                var projectmanager = [];
                if (data.d.Manager != null) {
                    if (data.d.Manager.results.length > 0) {
                        for (var a = 0; a < data.d.Manager.results.length; a++) {
                            projectmanager.push(data.d.Manager.results[a].Name);
                        }
                    }
                }
                //$scope.ctrl.contacts = projectmanager;
                vm.users = projectmanager;
                //Simulate a service
                vm.userLookupService = function (q) {
                    var d = $q.defer();
                    //debugger;
                    $timeout(function () {
                        var list = contacts;
                        list = list.map(function (a, i) {
                            return {
                                UserName: i
                                , Name: a.Name
                                , DisplayName: a.Title
                                , Email: a.Id

                            }
                        });
                        var r = new RegExp(q, 'ig');
                        var response;
                        if (angular.isNumber(q)) {
                            response = [list[q]];
                        } else response = (list.filter(function (a) {
                            return r.test(a.Name);
                        }).slice(0, 10));
                        d.resolve(response);
                    }, 100);

                    return d.promise;

                };
                //New Code  
                $scope.$watch('ctrl.users', function (newval, oldval) {
                    if (angular.isDefined(newval) && newval.length > 0) {
                        vm.isMandatory = false;
                        $("people-picker").removeClass("Mandatory");
                    }
                    else if (angular.isDefined(oldval)) {
                        vm.isMandatory = true;
                        $("people-picker").addClass("Mandatory");
                    }


                }, true);


            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
    }
    $scope.goBack = function () {
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/Projects.aspx"
    }
    $scope.saveitem = function () {
        $scope.isClicked = true;
        $(".load_con").show();
        FormEntry();
        BindProjectEntry();
        //Get Form Entry Method Started
        function FormEntry() {
            Project_Name_Entry = $scope.projectname;
            Client_Name_Entry = $scope.crname;
            Status_Entry = $scope.status;
            Type_Entry = $scope.type;
            Amount_Entry = $scope.amount;

            if ($scope.ctrl.users.length > 0) {
                for (var con_i = 0; con_i < $scope.ctrl.users.length; con_i++) {
                    Project_Manager_Entry.push($scope.ctrl.users[con_i].Email);
                }
            }
            console.log(Project_Manager_Entry);

        }
        //Get Form Entry Method Ended
        //Post method started
        function BindProjectEntry() {
            var requestUri = "";
            var Header_Body = "";
            if (project_querystring != "") {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + project_listDisplayName + "')/items(" + project_querystring + ")";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                }
            }
            else {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + project_listDisplayName + "')/items";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    //"X-HTTP-Method": "MERGE",
                    //"If-Match": "*"
                }
            }
            var itemtype = getListItemType(project_listDisplayName);
            $.ajax(
                {
                    url: requestUri,
                    async: false,
                    type: "POST",
                    data: JSON.stringify({
                        '__metadata': { 'type': itemtype },
                        //'Feedback_x0020_ID' : FeedbackId,
                        'Title': Project_Name_Entry,
                        'ManagerId': {
                            results: Project_Manager_Entry
                        },
                        'ClientId': Client_Name_Entry,
                        'Status': Status_Entry,
                        'ProjectType': Type_Entry,
                        'TotalAmount': Amount_Entry


                    }),
                    headers: Header_Body,
                    success: function (data) {
                        //window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/Clients.aspx";
                        window.location.href = document.referrer;
                    },
                    error: function (err) {
                        //alert("Feedback List Item Error Message: " + JSON.stringify(err));
                        $scope.isClicked = false;
                        $(".load_con").hide();
                        console.log("Feedback List Item Error Message: " + JSON.stringify(err));
                    }
                });
        }
        //Post method ended

    };
    $scope.cancelitem = function () {
        window.location.href = document.referrer;
    }
    $scope.clearitem = function () {
        $scope.projectname = "";
        $scope.status = "Select";
        $scope.crname = "Select";
        $scope.type = "Select";
        $scope.ctrl.contacts = [];
        $scope.amount = "";
        $scope.totalcost = "";
    }

}]);
//Project Screen Controller Ended

//Invoice Screen Controller Started
blankapp.controller("invoiceprjnamecontroll", function ($scope) {
    $scope.projectname = "";
    $scope.crname = "";
    $scope.status = "";
    $scope.uniqueid = "";
    var listDisplayName = "InvoiceBreakups";
    $("#txtuniqueid").attr("readonly", true);
    $scope.prjnameitems = [];
    $scope.statusitems = [];
    BindInvoiceprjname("Project");
    Invoice_querystring = $.getUrlVar('ITrack_ID');
    LoadAllDropdown();


    if (Invoice_querystring == "") {
        $(".heading_title").html("New Invoice");
        var uniqueid_value = UniqueIDFormat();
        $scope.uniqueid = uniqueid_value;
        $scope.status = "Select";
        //DrpCRname();
        //DrpEffortname();

    }
    else {
        $("#btnsave").html("Update");
        //DrpCRname();
        //DrpEffortname();
        $(".heading_title").html("Edit Invoice");
        EditFormEntry();
    }



    function BindInvoiceprjname(prjnamelistname) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + prjnamelistname + "')/items";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    if (data.d.results.length > 0) {
                        //projectnamehtml += '<option value="Select">Select</option>';
                        Invoice_Prj_Name.push({ Title: "Select", ID: "Select" });
                        for (var i = 0; i < data.d.results.length; i++) {
                            Invoice_Prj_Name.push({ Title: data.d.results[i].ProjectName, ID: data.d.results[i].ID });
                        }
                        $scope.prjnameitems = Invoice_Prj_Name;
                    }
                }
            },
            error: function (err) {
                alert("Invoice Project Name DropDown Method Error Occured:" + JSON.stringify(err));
            }
        });
        $scope.projectname = $scope.prjnameitems[0].value;
    }
    function LoadAllDropdown() {
        var requesturl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listDisplayName + "')/fields?$filter=StaticName%20eq%20%27Status%27";
        $.ajax({
            url: requesturl,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" },
            async: false,
            success: function (data) {
                if (data.d.results) {
                    Invoice_Status.push({ Title: "Select", ID: "Select" });
                    for (var j = 0; j < data.d.results[0].Choices.results.length; j++) {
                        Invoice_Status.push({ Title: data.d.results[0].Choices.results[j], ID: data.d.results[0].Choices.results[j] });
                    }
                    $scope.statusitems = Invoice_Status;

                }
            },
            error: function (xhr) {
                alert("Invoice Status DropDown Method Error Occured:" + JSON.stringify(err));
            }
        });

    }
    function EditFormEntry() {
        var querystring_mode = "";
        querystring_mode = $.getUrlVar('Mode');
        if (querystring_mode == "disp") {
            $scope.isClicked = true;
            $(".heading_title").html("View Invoice");
            $(".formbtnbg").hide();
            $(".formbackbtnbg").show();
        }


        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listDisplayName + "')/items(" + Invoice_querystring + ")?$select=Title,Status,UniqueID0,TotalAmount,Effort/Id,Effort/Title,CR/Id,CR/Title&$expand=Effort,CR";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {


                $scope.invoicename = data.d.Title;
                //$scope.crname = data.d.CR_x0020_NameId;
                $scope.status = data.d.Status;
                $scope.uniqueid = data.d.UniqueID0;
                $scope.TotalAmount = data.d.TotalAmount;
                $scope.effort1 = "";
                $scope.cr = "";
                effortReplace = lookupTitle(data.d.Effort.results);
                if (effortReplace != "")
                    $.each(effortReplace, function (key, value) {
                        $scope.effort1 += value + "; ";
                    });
                crReplace = lookupTitle(data.d.CR.results);
                if (crReplace != "")
                    $.each(crReplace, function (key, value) {
                        $scope.cr += value + "; ";
                    });

                efforts = lookupId(data.d.Effort.results);
                crs = lookupId(data.d.CR.results);
                $scope.crname = crs;
                $scope.effort = efforts;


            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
    }



    function DrpCRname() {
        Invoice_Cr_Name = [];
        var projectnamehtml = "";
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('CR')/items?$select=ID,Title";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    Invoice_Cr_Name.push({ Title: "Select", ID: "Select" });
                    if (data.d.results.length > 0) {
                        for (var i = 0; i < data.d.results.length; i++) {
                            Invoice_Cr_Name.push({ Title: data.d.results[i].Title, ID: data.d.results[i].ID });
                        }
                        $scope.critems = Invoice_Cr_Name;
                    }
                    else {
                        $scope.critems = Invoice_Cr_Name;
                    }
                }


            },
            error: function (err) {

                alert("Invoice CR Name DropDown Method Error Occured:" + JSON.stringify(err));

            }

        });
    }
    $scope.goBack = function () {
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/Invoices.aspx"
    }
    $scope.$on('Update', function (event, args) {
        $scope.message = args.message;
        console.log($scope.message);
    });

    function DrpEffortname() {
        Invoice_Cr_Name = [];
        var projectnamehtml = "";
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('effort')/items?$select=ID,Title";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    Invoice_Cr_Name.push({ Title: "Select", ID: "Select" });
                    if (data.d.results.length > 0) {
                        for (var i = 0; i < data.d.results.length; i++) {
                            Invoice_Cr_Name.push({ Title: data.d.results[i].Title, ID: data.d.results[i].ID });
                        }
                        $scope.effort1items = Invoice_Cr_Name;
                    }
                    else {
                        $scope.effort1items = Invoice_Cr_Name;
                    }
                }


            },
            error: function (err) {

                alert("Invoice CR Name DropDown Method Error Occured:" + JSON.stringify(err));

            }

        });
    }

    function updateFlag(listName, Id, flagval) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listName + "')/items(" + Id + ")";
        var itemtype = getListItemType(listName);
        flag = flagval;
        jQuery.ajax({
            url: requestUri,
            type: "POST",
            async: true,
            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json; odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
            },
            data: JSON.stringify({
                '__metadata': { 'type': itemtype },
                'IsBilled_x003f_': flag
            }),

            success: function (data) {

                console.log(listName + " flag Updated" + JSON.stringify(data));

            },
            error: function (err) {

                console.log(listName + " flag Updation Failed:" + JSON.stringify(err));

            }

        });

    }
    function updateInvoice(listName, lookupId, Title) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listName + "')/items";
        var itemtype = getListItemType(listName);
        jQuery.ajax({
            url: requestUri,
            type: "POST",
            async: false,
            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json; odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()

            },
            data: JSON.stringify({
                '__metadata': { 'type': itemtype },
                'InvoiceUniqueIDId': lookupId,
                'Title': Title
            }),

            success: function (data) {

                console.log(listName + " Updated" + JSON.stringify(data));

            },
            error: function (err) {

                console.log(listName + " Updation Failed:" + JSON.stringify(err));

            }

        });

    }


    $scope.saveitem = function () {
        $scope.isClicked = true;
        $(".load_con").show();
        BindInoivceEntry();

        function BindInoivceEntry() {
            var projectname = 0;
            var crname = 0;
            var status = "";
            var requestUri = "";
            var Header_Body = "";
            if (Invoice_querystring != "") {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listDisplayName + "')/items(" + Invoice_querystring + ")";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                }
            }
            else {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listDisplayName + "')/items";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    //"X-HTTP-Method": "MERGE",
                    //"If-Match": "*"
                }
            }
            var itemtype = getListItemType(listDisplayName);
            projectname = $scope.projectname;
            if ($scope.crname != "Select" && $scope.crname != undefined) {
                crname = $scope.crname;
            }
            if ($scope.status != "Select") {
                status = $scope.status;
            }
            itemsCR = [];
            var amountval = 0;
            $.each(flagCRArray, function (key, value) {
                updateFlag("CR", value, false);
            });
            $.each($("#DataTable_tbody_CRInvoice").find("tr input[type='checkbox']:checked"), function (key, value) {
                updateFlag("CR", $(value).attr("id"), true);
                itemsCR.push(parseInt($(value).attr("id")));
                //amountval=amountval+parseInt($(value).parent().parent().find('td.amount').text());

            });

            itemsEffort = [];
            $.each(flagEffortArray, function (key, value) {
                updateFlag("Effort", value, false);
            });
            $.each($("#DataTable_tbody_EffortsInvoice").find("tr input[type='checkbox']:checked"), function (key, value) {
                updateFlag("Effort", $(value).attr("id"), true);
                itemsEffort.push(parseInt($(value).attr("id")));
                //amountval=amountval+parseInt($(value).parent().parent().find('td.amount').text());
            });
            data = {
                __metadata: { 'type': itemtype },
                //'Feedback_x0020_ID' : FeedbackId,
                "Title": $scope.invoicename,
                //'CR_x0020_NameId': crname,
                "Status": status,
                "UniqueID0": $scope.uniqueid,
                "TotalAmount": $scope.TotalAmount,
                "EffortId": { '__metadata': { type: 'Collection(Edm.Int32)' }, 'results': itemsEffort },
                "CRId": { '__metadata': { type: 'Collection(Edm.Int32)' }, 'results': itemsCR }
            };
            $.ajax(
                {
                    url: requestUri,
                    async: false,
                    type: "POST",
                    data: JSON.stringify(data),
                    headers: Header_Body,
                    success: function (data) {
                        //window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/Clients.aspx";
                        if (Invoice_querystring == "") {
                            updateInvoice("Invoice", data.d.ID, $scope.uniqueid);
                        }
                        window.location.href = document.referrer;
                    },
                    error: function (err) {
                        //alert("Feedback List Item Error Message: " + JSON.stringify(err));
                        $scope.isClicked = false;
                        $(".load_con").hide();
                        console.log("Feedback List Item Error Message: " + JSON.stringify(err));
                    }
                });
        }

    }
    $scope.cancelitem = function () {
        window.location.href = document.referrer;
    }
    $scope.clearitem = function () {
        $scope.projectname = $scope.prjnameitems[0].value;
        $scope.crname = "";
        $scope.status = "Select";
        $scope.uniqueid = UniqueIDFormat();
    }
    $scope.onChange = function (drpid) {
        Invoice_Cr_Name = [];
        $scope.crname = "";
        var drp_ID = drpid;
        $scope.crnameitems = [];
        DrpCRname(drp_ID);

        function DrpCRname(drp_value) {
            var projectnamehtml = "";
            var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('CR')/items?$select=ID,CRName,Project_x0020_Name/Id,Project_x0020_Name/ProjectName&$expand=Project_x0020_Name&$filter=Project_x0020_Name/Id eq '" + drp_value + "'";
            jQuery.ajax({
                url: requestUri,
                type: "GET",
                async: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    if (data.d.results) {
                        Invoice_Cr_Name.push({ Title: "Select", ID: "Select" });
                        if (data.d.results.length > 0) {
                            for (var i = 0; i < data.d.results.length; i++) {
                                Invoice_Cr_Name.push({ Title: data.d.results[i].CRName, ID: data.d.results[i].ID });
                            }
                            $scope.crnameitems = Invoice_Cr_Name;
                        }
                        else {
                            $scope.crnameitems = Invoice_Cr_Name;
                        }
                    }


                },
                error: function (err) {

                    alert("Invoice CR Name DropDown Method Error Occured:" + JSON.stringify(err));

                }

            });
            $scope.crname = $scope.crnameitems[0].value;
        }
    }



});
//Invoice Screen Controller Ended

//Effort Screen Controller Started
blankapp.controller("effortcontroller", ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {
    var Effort_listDisplayName = "Effort";
    var Tot_Estimate_Hours_Entry = "";
    var Tot_Proposed_Hours_Entry = "";
    var Tot_Approved_Hours_Entry = "";
    var Actual_Hours_Spent_Entry = "";
    var Project_Name_Entry = 0;
    var CR_Name_Entry = 0;
    var Start_Date_Entry;
    var End_Date_Entry;
    var Module_Name = "";
    var Actual_Start_Date_Entry;
    var Actual_End_Date_Entry;
    var description = "";
    $scope.controls = [{
        index: s4(),
        Resource: null,
        Role: null
    }];
    $scope.common = {};
    $scope.common.isMandatory = true;
    contacts_user();
    //var vm = this;
    $scope.common.users = "";
    //Simulate a service
    $scope.common.userLookupService = function (q) {

        console.log("Q", q);
        var d = $q.defer();
        //debugger;
        $timeout(function () {
            var list = contacts;
            list = list.map(function (a, i) {
                return {
                    UserName: i
                    , Name: a.Name
                    , DisplayName: a.Title
                    , Email: a.Id

                }
            });
            var r = new RegExp(q, 'ig');
            var response;
            if (angular.isNumber(q)) {
                response = [list[q]];
            }
            else response = (list.filter(function (a) {
                return r.test(a.DisplayName);
            }).slice(0, 10));
            d.resolve(response);
        }, 100);
        return d.promise;
    };

    //New Code  
    $scope.$watch('common.users', function (newval, oldval) {
        if (angular.isDefined(newval) && newval.length > 0) {
            $scope.common.isMandatory = false;
            $("people-picker").removeClass("Mandatory");
        }
        else if (angular.isDefined(oldval)) {
            $scope.common.isMandatory = true;
            $("people-picker").addClass("Mandatory");
        }
    }, true);


    var effort_querystring = "";
    $scope.prjnameitems = [];
    BindInvoiceprjname("Project");
    effort_querystring = $.getUrlVar('ITrack_ID');

    if (effort_querystring == "") {
        $(".heading_title").html("New Effort");
    }
    else {
        $("#btnsave").html("Update");
        $(".heading_title").html("Edit Effort");
        //DrpCRname();
        EditFormEntry();
    }
    $scope.common.delete = function (item) {
        if (effort_querystring != "") {
            id = $scope.controls[$scope.controls.findIndex(x => x.index == item)].Id;
            if (id != "" && id != undefined) {
                $("#dialog-confirm").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    title: "Alert",
                    open: function () {
                        var markup = '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"> </span>Are you sure want to delete this Allocation?</p>';
                        $(this).html(markup);
                    },
                    buttons: {
                        "Confirm": function () {
                            $(this).dialog("close");
                            $('.load_con').show();
                            flag = allocationdelete("Allocation", id)
                            if (flag = true)
                                $scope.controls.splice($scope.controls.findIndex(x => x.index == item), 1);
                            $('.load_con').hide();

                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    }
                });

            }
            else {
                $scope.controls.splice($scope.controls.findIndex(x => x.index == item), 1);
            }
        }
        else
            $scope.controls.splice($scope.controls.findIndex(x => x.index == item), 1);

    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    //addNewRow();    
    $scope.addNewRow = function () {
        $scope.controls.push({
            index: s4(),
            Resource: null,
            Role: null
        });
    };

    function BindInvoiceprjname(prjnamelistname) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + prjnamelistname + "')/items";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    if (data.d.results.length > 0) {
                        //projectnamehtml += '<option value="Select">Select</option>';
                        Invoice_Prj_Name.push({ Title: "Select", ID: "Select" });
                        for (var i = 0; i < data.d.results.length; i++) {
                            Invoice_Prj_Name.push({ Title: data.d.results[i].Title, ID: data.d.results[i].ID });
                        }
                        $scope.prjnameitems = Invoice_Prj_Name;
                    }
                }
            },
            error: function (err) {
                alert("Invoice Project Name DropDown Method Error Occured:" + JSON.stringify(err));
            }
        });
        $scope.projectname = $scope.prjnameitems[0].value;
    }
    function DrpCRname() {
        Invoice_Cr_Name = [];
        var projectnamehtml = "";
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('CR')/items?$select=ID,CRName,Project_x0020_Name/Id,Project_x0020_Name/ProjectName&$expand=Project_x0020_Name";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    Invoice_Cr_Name.push({ Title: "Select", ID: "Select" });
                    if (data.d.results.length > 0) {
                        for (var i = 0; i < data.d.results.length; i++) {
                            Invoice_Cr_Name.push({ Title: data.d.results[i].CRName, ID: data.d.results[i].ID });
                        }
                        $scope.crnameitems = Invoice_Cr_Name;
                    }
                    else {
                        $scope.crnameitems = Invoice_Cr_Name;
                    }
                }


            },
            error: function (err) {

                alert("Invoice CR Name DropDown Method Error Occured:" + JSON.stringify(err));

            }

        });
    }
    function EditFormEntry() {
        var querystring_mode = "";
        querystring_mode = $.getUrlVar('Mode');
        if (querystring_mode == "disp") {
            $scope.isClicked = true;
            $(".heading_title").html("View Effort");
            $(".formbtnbg").hide();
            $(".formbackbtnbg").show();
        }


        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Effort_listDisplayName + "')/items(" + effort_querystring + ")";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                var startdateSplit = "";
                var startdate = "";
                var EnddateSplit = "";
                var Enddate = "";
                var ActualstartdateSplit = "";
                var Actualstartdate = "";
                var ActualEnddateSplit = "";
                var ActualEnddate = "";

                if (data.d.StartDate1 != null && data.d.StartDate1 != "Invalid Date") {
                    startdateSplit = data.d.StartDate1.split('T')[0].split('-');
                    startdate = startdateSplit[1] + "-" + startdateSplit[2] + "-" + startdateSplit[0];
                }
                if (data.d.EndDate1 != null && data.d.EndDate1 != "Invalid Date") {
                    EnddateSplit = data.d.EndDate1.split('T')[0].split('-');
                    Enddate = EnddateSplit[1] + "-" + EnddateSplit[2] + "-" + EnddateSplit[0];
                }
                if (data.d.ActualStartDate != null && data.d.ActualStartDate != "Invalid Date") {
                    ActualstartdateSplit = data.d.ActualStartDate.split('T')[0].split('-');
                    Actualstartdate = ActualstartdateSplit[1] + "-" + ActualstartdateSplit[2] + "-" + ActualstartdateSplit[0];
                }
                if (data.d.ActualEndDate != null && data.d.ActualEndDate != "Invalid Date") {
                    ActualEnddateSplit = data.d.ActualEndDate.split('T')[0].split('-');
                    ActualEnddate = ActualEnddateSplit[1] + "-" + ActualEnddateSplit[2] + "-" + ActualEnddateSplit[0];
                }

                $scope.modulename = data.d.Title;
                $scope.estimatehours = data.d.TotalEstimatedHours;
                $scope.totproposedhours = data.d.TotalProposedHours;
                $scope.totapprovedhours = data.d.TotalApprovedHours;
                $scope.actualhours = data.d.ActualHoursSpent;
                $scope.projectname = data.d.ProjectId;
                $scope.startdate = new Date(startdate);
                $scope.enddate = new Date(Enddate);
                $scope.actualstartdate = new Date(Actualstartdate);
                $scope.actualenddate = new Date(ActualEnddate);
                $scope.description = data.d.Description;

            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
        var url1 = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items?$select=ID,StartDate,EndDate,Effort/Title,Effort/Id,Employee/Title,Employee/Id,Role/Title,Role/Id&$expand=Role,Employee,Effort&$filter=EffortId eq " + effort_querystring;
        jQuery.ajax({

            url: url1,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results.length > 0)
                    $scope.controls = [];
                $.each(data.d.results, function (key, value) {
                    var startdateSplit = "";
                    var startdate = null;
                    var EnddateSplit = "";
                    var Enddate = null;

                    if (value.StartDate != null && value.StartDate != "Invalid Date") {
                        startdateSplit = value.StartDate.split('T')[0].split('-');
                        startdate = startdateSplit[1] + "-" + startdateSplit[2] + "-" + startdateSplit[0];
                        startdate = new Date(startdate);
                    }
                    if (value.EndDate != null && value.EndDate != "Invalid Date") {
                        EnddateSplit = value.EndDate.split('T')[0].split('-');
                        Enddate = EnddateSplit[1] + "-" + EnddateSplit[2] + "-" + EnddateSplit[0];
                        Enddate = new Date(Enddate);
                    }
                    $scope.controls.push({
                        index: s4(),
                        Resource: value.Employee.Id,
                        Role: value.Role.Id,
                        Resourcestartdate: startdate,
                        Resourceenddate: Enddate,
                        Id: value.ID
                    });


                });
                console.log("Allocation Retrieved", $scope.controls);

            },
            error: function (err) {

                alert("Allocation Retrieved Error Occured:" + JSON.stringify(err));

            }

        });
    }
    $scope.goBack = function () {
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/Efforts.aspx"
    }
    $scope.saveitem = function () {
        $scope.isClicked = true;
        $(".load_con").show();
        var cr_checkvalue = false;
        FormEntry();
        BindEffortEntry();

        //Get Form Entry Method Started
        function FormEntry() {
            console.log("FormEntry");
            Tot_Estimate_Hours_Entry = $scope.estimatehours;
            Tot_Proposed_Hours_Entry = $scope.totproposedhours;
            Tot_Approved_Hours_Entry = $scope.totapprovedhours;
            Actual_Hours_Spent_Entry = $scope.actualhours;
            Project_Name_Entry = $scope.projectname;
            if ($scope.startdate != "" && $scope.startdate != undefined)
                Start_Date_Entry = $scope.startdate.format("yyyy-MM-dd");
            if ($scope.enddate != "" && $scope.enddate != undefined)
                End_Date_Entry = $scope.enddate.format("yyyy-MM-dd");
            if ($scope.actualstartdate != "" && $scope.actualstartdate != undefined)
                Actual_Start_Date_Entry = $scope.actualstartdate.format("yyyy-MM-dd");
            if ($scope.actualenddate != "" && $scope.actualenddate != undefined)
                Actual_End_Date_Entry = $scope.actualenddate.format("yyyy-MM-dd");
            Module_Name = $scope.modulename;
            description = $scope.description;
        }
        //Get Form Entry Method Ended

        //Post method started
        function BindEffortEntry() {
            console.log("BindEffortEntry");
            var requestUri = "";
            var Header_Body = "";
            if (effort_querystring != "") {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Effort_listDisplayName + "')/items(" + effort_querystring + ")";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                }
            }
            else {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Effort_listDisplayName + "')/items";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    //"X-HTTP-Method": "MERGE",
                    //"If-Match": "*"
                }
            }

            var itemtype = getListItemType(Effort_listDisplayName);
            console.log(itemtype);
            $.ajax(
                {
                    url: requestUri,
                    async: false,
                    type: "POST",
                    data: JSON.stringify({
                        '__metadata': { 'type': itemtype },
                        //'Feedback_x0020_ID' : FeedbackId,
                        'TotalEstimatedHours': Tot_Estimate_Hours_Entry,
                        'TotalProposedHours': Tot_Proposed_Hours_Entry,
                        'TotalApprovedHours': Tot_Approved_Hours_Entry,
                        'ActualHoursSpent': Actual_Hours_Spent_Entry,
                        'ProjectId': Project_Name_Entry,
                        'StartDate1': Start_Date_Entry,
                        'EndDate1': End_Date_Entry,
                        'ActualStartDate': Actual_Start_Date_Entry,
                        'ActualEndDate': Actual_End_Date_Entry,
                        'Title': Module_Name,
                        'Description': description


                    }),
                    headers: Header_Body,
                    success: function (data) {
                        //window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/Clients.aspx";
                        var EditAllocationValue = [];
                        $scope.controls.forEach(function (value) {
                            if (value.Resource != null && value.Role != null) {
                                var Start_Date_Entry;
                                var End_Date_Entry;
                                if (value.Resourcestartdate != "" && value.Resourcestartdate != undefined)
                                    Start_Date_Entry = value.Resourcestartdate.format("yyyy-MM-dd");
                                else
                                    Start_Date_Entry = null;
                                if (value.Resourceenddate != "" && value.Resourceenddate != undefined)
                                    End_Date_Entry = value.Resourceenddate.format("yyyy-MM-dd");
                                else
                                    End_Date_Entry = null;
                                EditAllocationValue.push({ "Resource": value.Resource, "Role": value.Role, "StartDate": Start_Date_Entry, "EndDate": End_Date_Entry, "Id": value.Id });

                            }
                        });
                        var url;
                        if (effort_querystring != "") {

                            $.each(EditAllocationValue, function (key, value) {
                                if (value.Id != undefined && value.Id != "") {
                                    url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items(" + value.Id + ")"
                                    allocation("EffortId", effort_querystring, value, Header_Body, url);
                                }
                                else {
                                    url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items"
                                    header = {
                                        "Accept": "application/json;odata=verbose",
                                        "content-type": "application/json; odata=verbose",
                                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                        //"X-HTTP-Method": "MERGE",
                                        //"If-Match": "*"
                                    };
                                    allocation("EffortId", effort_querystring, value, header, url);
                                }
                            });
                        }
                        else {

                            $.each(EditAllocationValue, function (key, value) {
                                url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items"
                                allocation("EffortId", data.d.Id, value, Header_Body, url)
                            });
                        }
                        window.location.href = document.referrer;
                    },
                    error: function (err) {
                        $scope.isClicked = false;
                        $(".load_con").hide();
                        //alert("Feedback List Item Error Message: " + JSON.stringify(err));
                        console.log("Effort List Item Error Message: " + JSON.stringify(err));
                    }
                });
        }
        //Post method ended       
    }

    $scope.cancelitem = function () {
        window.location.href = document.referrer;
    }
    $scope.clearitem = function () {
        $scope.projectname = $scope.prjnameitems[0].value;
        $scope.crname = "";
        $scope.estimatehours = "";
        $scope.totproposedhours = "";
        $scope.totapprovedhours = "";
        $scope.actualhours = "";
        $scope.startdate = new Date();
        $scope.enddate = new Date();
    }

    $scope.onChange = function (drpid) {
        Invoice_Cr_Name = [];
        $scope.crname = "";
        var drp_ID = drpid;
        $scope.crnameitems = [];
        //DrpCRname(drp_ID);

        function DrpCRname(drp_value) {
            var projectnamehtml = "";
            var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('CR')/items?$select=ID,Title,Project/Id,Project/Title&$expand=Project$filter=Project/Id eq '" + drp_value + "'";
            jQuery.ajax({
                url: requestUri,
                type: "GET",
                async: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    if (data.d.results) {
                        Invoice_Cr_Name.push({ Title: "Select", ID: "Select" });
                        if (data.d.results.length > 0) {
                            for (var i = 0; i < data.d.results.length; i++) {
                                Invoice_Cr_Name.push({ Title: data.d.results[i].CRName, ID: data.d.results[i].ID });
                            }
                            $scope.crnameitems = Invoice_Cr_Name;
                        }
                        else {
                            $scope.crnameitems = Invoice_Cr_Name;
                        }
                    }


                },
                error: function (err) {

                    alert("Invoice CR Name DropDown Method Error Occured:" + JSON.stringify(err));

                }

            });
            $scope.crname = $scope.crnameitems[0].value;
        }
    }

    //Duplicate Validation method started
    function duplicate_validate(duplicate_value, duplicate_field) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + Effort_listDisplayName + "')/items?$select=Project/Id,Project/Title&$expand=Project&$filter=" + duplicate_field + "/Id%20eq%20'" + duplicate_value + "'";
        //" + duplicate_value + "'";
        var bool_duplicate = true;
        console.log(requestUri);
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results.length > 0) {
                    console.log(data.d);

                    bool_duplicate = false;
                }

            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
        return bool_duplicate;
    }
    //Duplicate Validation method ended
}]);
//Effort Screen Controller Ended

blankapp.directive('resallocation', function ($mdCompiler) {
    return {
        restrict: 'E',
        scope: {
            control: '=control',
            common: '=common',
            index: '=index'
        },

        link: function (scope, element, attrs) {

            $mdCompiler.compile({
                templateUrl: '/sites/branding/siteassets/TillidITracker/CustomCode/CRAllocation.html'
            }).then(function (compileData) {
                compileData.link(scope);
                element.prepend(compileData.element);
                //scope.Resourceitems=Bind_DropDown("Employee");
                scope.Roleitems = Bind_DropDown("BillingRate");
                function Bind_DropDown(prjnamelistname) {
                    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + prjnamelistname + "')/items";
                    var returnval = [];
                    jQuery.ajax({
                        url: requestUri,
                        type: "GET",
                        async: false,
                        headers: { "accept": "application/json;odata=verbose" },
                        success: function (data) {
                            if (data.d.results) {
                                returnval.push({ Title: "Select", ID: "Select" });
                                if (data.d.results.length > 0) {
                                    //projectnamehtml += '<option value="Select">Select</option>';                        
                                    for (var i = 0; i < data.d.results.length; i++) {
                                        returnval.push({ Title: data.d.results[i].Title, ID: data.d.results[i].ID });
                                    }

                                }
                            }

                        },
                        error: function (err) {
                            alert(prjnamelistname + " DropDown Method Error Occured:" + JSON.stringify(err));
                        }

                    });
                    return returnval;

                }


            });


        },

    }



});


//CR Screen Controller Started
blankapp.controller("CRScontroll", function ($scope) {
    var listDisplayName = "CR";
    $scope.projectname = "";
    $scope.crname = "";
    $scope.status = "";
    $scope.totalcost = "";
    $scope.amount = "";
    $scope.controls = [{
        index: s4(),
        Resource: null,
        Role: null
    }];
    $scope.prjnameitems = [];
    $scope.statusitems = [];
    $scope.Resourceitems = [];
    $scope.Roleitems = [];
    $scope.projectname = [];
    $scope.common = {};
    $scope.prjnameitems = Bind_DropDown("Project");
    LoadAllDropdown();
    CR_querystring = $.getUrlVar('ITrack_ID');

    $scope.common.delete = function (item) {
        var flag = false;
        if (CR_querystring != "") {
            id = $scope.controls[$scope.controls.findIndex(x => x.index == item)].Id;
            if (id != "" && id != undefined) {
                /*$( "#dialog-confirm" ).dialog({
                    height: "auto",
                    width: 400,
                    resizable: false,
                    modal: true,
                    title:"Alert",
                    open: function() {
                        var markup = '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"> </span>Are you sure want to delete this Allocation?</p>';
                            $(this).html(markup);
                      },
                    buttons: {
                      "Confirm": function()
                      {
                          $( this ).dialog( "close" );
                          
                      },
                      Cancel: function() {
                        $( this ).dialog( "close" );
                      }
                    }
                });  */
                $('.load_con').show();
                flag = allocationdelete("Allocation", id)
                if (flag == true) {
                    $scope.controls.splice($scope.controls.findIndex(x => x.index == item), 1);
                }
                $('.load_con').hide();


            }
            else {
                $scope.controls.splice($scope.controls.findIndex(x => x.index == item), 1);
            }
        }
        else
            $scope.controls.splice($scope.controls.findIndex(x => x.index == item), 1);

    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    //addNewRow();    
    $scope.addNewRow = function () {
        $scope.controls.push({
            index: s4(),
            Resource: null,
            Role: null
        });
    };

    if (CR_querystring != "") {
        $("#btnsave .ng-scope").html("Update");
        $(".heading_title").html("Edit CR");
        EditFormEntry();
    }
    else {
        $(".heading_title").html("New CR");
    }

    function EditFormEntry() {
        var querystring_mode = "";
        querystring_mode = $.getUrlVar('Mode');
        if (querystring_mode == "disp") {
            $scope.isClicked = true;
            $(".heading_title").html("View CRs");
            $(".formbtnbg").hide();
            $(".formbackbtnbg").show();
        }


        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listDisplayName + "')/items(" + CR_querystring + ")";
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {

                if (data.d.ProjectId != null) {
                    $scope.projectname = data.d.ProjectId;
                }
                else {
                    $scope.projectname = $scope.prjnameitems[0].value;
                }
                $scope.crname = data.d.Title;
                if (data.d.Status != null) {
                    $scope.status = data.d.Status;
                }
                else {
                    $scope.status = "Select";
                }
                $scope.totalcost = data.d.TotalCost;
                $scope.amount = data.d.Amount;

            },
            error: function (err) {

                alert("Error Occured:" + JSON.stringify(err));

            }

        });
        var url1 = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items?$select=ID,StartDate,EndDate,CR/Title,CR/Id,Employee/Title,Employee/Id,Role/Title,Role/Id&$expand=Role,Employee,CR&$filter=CRId eq " + CR_querystring;
        jQuery.ajax({

            url: url1,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results.length > 0)
                    $scope.controls = [];
                $.each(data.d.results, function (key, value) {
                    var startdateSplit = "";
                    var startdate = null;
                    var EnddateSplit = "";
                    var Enddate = null;

                    if (value.StartDate != null && value.StartDate != "Invalid Date") {
                        startdateSplit = value.StartDate.split('T')[0].split('-');
                        startdate = startdateSplit[1] + "-" + startdateSplit[2] + "-" + startdateSplit[0];
                        startdate = new Date(startdate);
                    }
                    if (value.EndDate != null && value.EndDate != "Invalid Date") {
                        EnddateSplit = value.EndDate.split('T')[0].split('-');
                        Enddate = EnddateSplit[1] + "-" + EnddateSplit[2] + "-" + EnddateSplit[0];
                        Enddate = new Date(Enddate);
                    }
                    $scope.controls.push({
                        index: s4(),
                        Resource: value.Employee.Id,
                        Role: value.Role.Id,
                        Resourcestartdate: startdate,
                        Resourceenddate: Enddate,
                        Id: value.ID
                    });


                });
                console.log("Allocation Retrieved", $scope.controls);

            },
            error: function (err) {

                alert("Allocation Retrieved Error Occured:" + JSON.stringify(err));

            }

        });
    }

    function Bind_DropDown(prjnamelistname) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + prjnamelistname + "')/items";
        var returnval = [];
        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results) {
                    returnval.push({ Title: "Select", ID: "Select" });
                    if (data.d.results.length > 0) {
                        //projectnamehtml += '<option value="Select">Select</option>';                        
                        for (var i = 0; i < data.d.results.length; i++) {
                            returnval.push({ Title: data.d.results[i].Title, ID: data.d.results[i].ID });
                        }

                    }
                }

            },
            error: function (err) {
                alert(prjnamelistname + " DropDown Method Error Occured:" + JSON.stringify(err));
            }

        });
        return returnval;

    }
    function LoadAllDropdown() {
        var requesturl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('CR')/fields?$filter=StaticName%20eq%20%27Status%27";
        $.ajax({
            url: requesturl,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" },
            async: false,
            success: function (data) {
                if (data.d.results) {
                    Invoice_Status.push({ Title: "Select", ID: "Select" });
                    for (var j = 0; j < data.d.results[0].Choices.results.length; j++) {
                        Invoice_Status.push({ Title: data.d.results[0].Choices.results[j], ID: data.d.results[0].Choices.results[j] });
                    }
                    $scope.statusitems = Invoice_Status;

                }
            },
            error: function (xhr) {
                alert("Invoice Status DropDown Method Error Occured:" + JSON.stringify(err));
            }
        });

    }
    //Check the Duplicate Entry in CR Name Method Started
    function CR_Name_Duplicate_Entry(Projectnameentry, crnameentry) {
        var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('CR')/items?$filter=Project/Id%20eq%20" + Projectnameentry + "&$select=Title,ID,Project/Id,Project/Title&$expand=Project";
        var bool_CRName = "0";

        jQuery.ajax({
            url: requestUri,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                if (data.d.results != null) {
                    if (data.d.results.length > 0) {
                        for (d = 0; d < data.d.results.length; d++) {
                            if (crnameentry == data.d.results[d].Title) {
                                bool_CRName = "1";
                                return bool_CRName;
                            }
                        }
                    }
                }
            },
            error: function (err) {

                alert("Duplicate Error Occured:" + JSON.stringify(err));

            }

        });
        return bool_CRName;
    }
    $scope.goBack = function () {
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/CRs.aspx"
    }

    /*$scope.delete = function (item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    }*/



    //Check the Duplicate Entry in CR Name Method Ended
    $scope.saveitem = function () {
        $scope.isClicked = true;
        $(".load_con").show();
        if (CR_Name_Duplicate_Entry($scope.projectname, $scope.crname) == "0") {

            BindCREntry();
        }
        if (CR_querystring != "")
            BindCREntry();
        function BindCREntry() {
            var CR_Name_Entry = "";
            var Project_Name_Entry = "";
            var Status_Entry = "";
            var Amount_Entry = "";
            var Total_Cost_Entry = "";
            var requestUri = "";
            var Header_Body = "";
            var AllocationValue = [];
            if (CR_querystring != "") {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listDisplayName + "')/items(" + CR_querystring + ")";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                }
            }
            else {
                requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listDisplayName + "')/items";
                Header_Body = {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    //"X-HTTP-Method": "MERGE",
                    //"If-Match": "*"
                }
            }
            var itemtype = getListItemType(listDisplayName);
            //alert($scope.crname);
            CR_Name_Entry = $scope.crname;
            Project_Name_Entry = $scope.projectname;
            Status_Entry = $scope.status;
            Amount_Entry = $scope.amount;
            Total_Cost_Entry = $scope.totalcost;
            /*$scope.controls.forEach(function(value){
                if (value.Resource!=null&&value.Role!=null){
                var Start_Date_Entry;
                var End_Date_Entry;
                if(value.Resourcestartdate!="" && value.Resourcestartdate!=undefined)
                    Start_Date_Entry = value.Resourcestartdate.format("yyyy-MM-dd");
                else
                    Start_Date_Entry=null;
                if(value.Resourceenddate!="" && value.Resourceenddate!=undefined)
                    End_Date_Entry = value.Resourceenddate.format("yyyy-MM-dd");
                else
                    Start_Date_Entry=null;
                    End_Date_Entry.push({"Resource":value.Resource,"Role":value.Role,"StartDate":Start_Date_Entry,"EndDate":End_Date_Entry,"Id":value.Id});

                }                
            });*/
            $.ajax(
                {
                    url: requestUri,
                    async: false,
                    type: "POST",
                    data: JSON.stringify({
                        '__metadata': { 'type': itemtype },
                        //'Feedback_x0020_ID' : FeedbackId,
                        'Title': CR_Name_Entry,
                        'ProjectId': Project_Name_Entry,
                        'Status': Status_Entry,
                        'Amount': Amount_Entry,
                        'TotalCost': Total_Cost_Entry

                    }),
                    headers: Header_Body,
                    success: function (data) {
                        //window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/Clients.aspx";                        
                        var EditAllocationValue = [];
                        $scope.controls.forEach(function (value) {
                            if (value.Resource != null && value.Role != null) {
                                var Start_Date_Entry;
                                var End_Date_Entry;
                                if (value.Resourcestartdate != "" && value.Resourcestartdate != undefined)
                                    Start_Date_Entry = value.Resourcestartdate.format("yyyy-MM-dd");
                                else
                                    Start_Date_Entry = null;
                                if (value.Resourceenddate != "" && value.Resourceenddate != undefined)
                                    End_Date_Entry = value.Resourceenddate.format("yyyy-MM-dd");
                                else
                                    End_Date_Entry = null;
                                EditAllocationValue.push({ "Resource": value.Resource, "Role": value.Role, "StartDate": Start_Date_Entry, "EndDate": End_Date_Entry, "Id": value.Id });

                            }
                        });
                        var url;
                        if (CR_querystring != "") {

                            $.each(EditAllocationValue, function (key, value) {
                                if (value.Id != undefined && value.Id != "") {
                                    url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items(" + value.Id + ")"
                                    allocation("CRId", CR_querystring, value, Header_Body, url);
                                }
                                else {
                                    url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items"
                                    header = {
                                        "Accept": "application/json;odata=verbose",
                                        "content-type": "application/json; odata=verbose",
                                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                        //"X-HTTP-Method": "MERGE",
                                        //"If-Match": "*"
                                    };
                                    allocation("CRId", CR_querystring, value, header, url);
                                }
                            });
                        }
                        else {

                            $.each(EditAllocationValue, function (key, value) {
                                url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Allocation')/items"
                                allocation("CRId", data.d.Id, value, Header_Body, url)
                            });
                        }

                        window.location.href = document.referrer;
                    },
                    error: function (err) {
                        //alert("Feedback List Item Error Message: " + JSON.stringify(err));
                        $scope.isClicked = false;
                        console.log("Feedback List Item Error Message: " + JSON.stringify(err));
                    }
                });
        }

    }
    $scope.cancelitem = function () {
        window.location.href = document.referrer;
    }
    $scope.clearitem = function () {
        $scope.projectname = $scope.prjnameitems[0].value;
        $scope.crname = "";
        $scope.status = "Select";
        $scope.totalcost = "";
        $scope.amount = "";
    }

});
//CR Screen Controller Ended

//Common Method Started
function contacts_user() {
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers";
    jQuery.ajax({
        url: requestUri,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            if (data.d.results) {
                if (data.d.results.length > 0) {
                    for (var i = 0; i < data.d.results.length; i++) {
                        if (data.d.results[i].Email !== "" || data.d.results[i].Email !== undefined)
                            contacts.push({ Name: data.d.results[i].LoginName, Id: data.d.results[i].Id, Title: data.d.results[i].Title });
                    }
                    console.log(contacts);
                }
            }
        },
        error: function (err) {
            alert("Invoice Project Name DropDown Method Error Occured:" + JSON.stringify(err));
        }
    });
}
function lookupTitle(value) {
    var arrayTitle = [];
    $.each($(value), function (key, index) {
        arrayTitle.push(index.Title)
    });
    return arrayTitle;
}
function lookupId(value) {
    var arrayTitle = [];
    $.each($(value), function (key, index) {
        arrayTitle.push(index.Id)
    });
    return arrayTitle;
}


function getListItemType(name) {
    return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
}
function UniqueIDFormat() {
    var dt = new Date();
    var time = "ITrack" + dt.getDate() + "" + dt.getFullYear() + "" + dt.getHours() + "" + dt.getMinutes();
    return time;
}

(function ($) {
    $.getUrlVar = function (key) {
        var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
        return result && unescape(result[1]) || "";
    };
})(jQuery);

function allocationdelete(listDisplayName, target) {
    var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listDisplayName + "')/items(" + target + ")";
    var flag;
    jQuery.ajax({
        url: restUrl,
        type: "POST",
        async: false,
        headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE"
        },
        success: function (data, status, xhr) {
            console.log(target + " is deleted from allocation successfully")
            flag = true;
        },
        error: function (err) {
            console.log(target + " is deleted from allocation failed : " + JSON.stringify(err))
            flag = false;
        }
    });
    return flag;
}
function allocation(LookupColumnName, LookupId, AllocationArray, Header_Body, URL) {
    var data;
    if (LookupColumnName == "CRId")
        data = JSON.stringify({
            '__metadata': { 'type': 'SP.Data.AllocationListItem' },
            //'Feedback_x0020_ID' : FeedbackId,
            'EmployeeId': AllocationArray.Resource,
            'RoleId': AllocationArray.Role,
            'StartDate': AllocationArray.StartDate,
            'EndDate': AllocationArray.EndDate,
            'CRId': LookupId

        })
    else if (LookupColumnName == "EffortId")
        data = JSON.stringify({
            '__metadata': { 'type': 'SP.Data.AllocationListItem' },
            //'Feedback_x0020_ID' : FeedbackId,
            'EmployeeId': AllocationArray.Resource,
            'RoleId': AllocationArray.Role,
            'StartDate': AllocationArray.StartDate,
            'EndDate': AllocationArray.EndDate,
            'EffortId': LookupId

        })
    $.ajax(
        {
            url: URL,
            async: false,
            type: "POST",
            data: data,
            headers: Header_Body,
            success: function (data) {
                console.log("Allocation Updated");
            },
            error: function (err) {

                console.log(" Allocation Failed " + JSON.stringify(err));
            }
        });
}


//Common Method Ended