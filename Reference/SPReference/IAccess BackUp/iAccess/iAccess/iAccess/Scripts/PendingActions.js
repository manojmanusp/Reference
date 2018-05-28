$(function () {
    var userId = _spPageContextInfo.userId;

    // keys and configurations
    var configStoreListName = "Config Store";
    var configStoreCategory = "iAccess";
    var keyCollection = {
        "NoRecordsFoundMsg": ""
    };

    var keys = Object.keys(keyCollection);
    var query = new CamlBuilder()
        .Where().TextField("Key").In(keys)
        .And().TextField("Category").EqualTo(configStoreCategory).ToString();

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', start);

    function start() {
        var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
        var oList = clientContext.get_web().get_lists().getByTitle(configStoreListName);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View><Query>' + query + '</Query></View>');
        this.collPCListItem = oList.getItems(camlQuery);
        clientContext.load(this.collPCListItem);
        clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));
    }

    function onQuerySucceeded(sender, args) {
        var listItemEnumerator = this.collPCListItem.getEnumerator();
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            if (!keyCollection[oListItem.get_item('Key')]) {
                keyCollection[oListItem.get_item('Key')] = oListItem.get_item('Title');
            }
        }
        captureUserGroups();
    }

    function captureUserGroups() {
        var URL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/?$expand=groups";
        $.ajax({
            url: URL,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data != null && data.d != null && data.d.Groups != null && data.d.Groups.results != null) {
                    var groups = data.d.Groups.results;
                    var assignedTo = '(';
                    for (var index = 0; index < groups.length; index++) {
                        assignedTo += " (PendingWith/Id eq " + groups[index].Id + ")";
                        if (index < groups.length - 1)
                            assignedTo += " or ";
                    }
                    assignedTo += ")";
                    var assignedToRes = '(';
                    for (var index = 0; index < groups.length; index++) {
                        assignedToRes += " (AssignedTo/Id eq " + groups[index].Id + ")";
                        if (index < groups.length - 1)
                            assignedToRes += " or ";
                    }
                    assignedToRes += ")";
                    LoadMyPendingActivities(assignedTo);
                    LoadMyCompletedActivities(assignedToRes);
                    LoadRejectedActivities(assignedToRes);
                    //LoadOnHoldActivities(assignedTo);
                    getTotalCounts(assignedTo);
                    $('#MyPendingActionsTabContainer').show();
                    $('#MyCompletedApprovalsDataContainer').hide();
                    // $('#MyOnHoldDataContainer').hide();
                    $('#MyRejectedDataContainer').hide();
                }
                else {
                    LoadMyPendingActivities("");
                    LoadMyCompletedActivities("");
                    LoadRejectedActivities("");
                    //LoadOnHoldActivities("");
                    getTotalCounts("");
                }
            },
            error: function (sender, args) {
                console.log(args.get_message() + '\n' + args.get_stackTrace());
            }
        });
    }

    function onQueryFailed(sender, args) {
        console.log(args.get_message() + '\n' + args.get_stackTrace());
    }

    function LoadMyPendingActivities(assignedTo) {
        var url = "/_api/Web/Lists/GetByTitle('SKUApplicationItem')/Items?$select=AssignedTo/Id,SKUApplication/Title,SKUApplication/Id,PendingWith/Id,PendingWith/Title,SKUApplication/UniqueID0,*&$expand=AssignedTo/Id,PendingWith,SKUApplication/Title,SKUApplication/UniqueID0&$filter= (" + assignedTo + " and ( (Status eq 'Pending Acknowledgement') or (Status eq 'In Progress') or (Status eq 'Completed and Pending Acknowledgement by Next team') ) and (DisplayInDashboard eq 1))&$orderby=Id desc";
        var items = getListItem(url, false);
        if (items.length > 0) {
            var template = Handlebars.compile($('#myPendingActionsTemplate').html());
            var model = { "items": [] };
            $(items).each(function (index, item) {
              
                model.items.push({
                    'SlNo': index + 1,
                    'UniqueID': item.SKUApplication.UniqueID0,
                    'Application': item.SKUApplication.Title,
                    'WbsItem': item.Title,
                    'PlanedStartDate': GetFormattedDate(item.PlannedStartDate),
                    'PlanedEndDate': GetFormattedDate(item.PlannedEndDate),
                    'Status': item.Status,
                    'Remarks': item.Remarks,
                    'ActionId': item.Id,
                    'ApplicationId': item.SKUApplication.Id
                });
                //});
            });
            $('#MyPendingActionsTabContainer').html(template(model));
            $('.MyPendingApprovalsCount').text(" (" + items.length + ")");

            $('#MyPendingActionsTabContainer table').DataTable({
                fixedHeader: true,
                "aaSorting": [1, 'asc']
            });
            $('#MyPendingActionsTabContainer table').removeAttr('style');

            $('.table > thead > tr > th').removeAttr('style');
        }
        else {
            var template = Handlebars.compile($('#noRecordsFoundTemplte').html());
            var model = { "NoRecordFoundMsg": keyCollection["NoRecordsFoundMsg"] };
            $('#MyPendingActionsTabContainer').html(template(model));
            $('.MyPendingApprovalsCount').text('');
        }
        $('#MyPendingActionsTabContainer').show();
        $('#MyCompletedApprovalsDataContainer').hide();
    }

    function GetFormattedDate(objDate) {
        objDate = new Date(objDate);
        return objDate.format("dd-MMM-yyyy");
    }

    function LoadMyCompletedActivities(assignedToRes) {
        var url = "/_api/Web/Lists/GetByTitle('SKUApplicationItem')/Items?$select=AssignedTo/Id,PendingWith/Id,PendingWith/Title,SKUApplication/Title,SKUApplication/Id,SKUApplication/UniqueID0, *&$expand=AssignedTo/Id,PendingWith,SKUApplication/Title,SKUApplication/UniqueID0&$filter=( " + assignedToRes + " and (Status eq 'Completed') and (DisplayInDashboard eq 1))&$orderby=Id desc";
        var items = getListItem(url, false);
        if (items.length > 0) {
            var template = Handlebars.compile($('#myCompletedActionsTemplate').html());
            var model = { "items": [] };
            $(items).each(function (index, item) {
              

                model.items.push({
                    'SlNo': index + 1,
                    'UniqueID': item.SKUApplication.UniqueID0,
                    'Application': item.SKUApplication.Title,
                    'WbsItem': item.Title,
                    'ActualStartDate': GetFormattedDate(item.StartDate),
                    'ActualEndDate': GetFormattedDate(item.DueDate),
                    'Status': item.Status,
                    'Remarks': item.Remarks,
                    'ActionId': item.Id,
                    'ApplicationId': item.SKUApplication.Id
                });
                // });
            });
            $('#MyCompletedApprovalsDataContainer').html(template(model));
            $('.MyCompletedApprovalsCount').text(" (" + items.length + ")");

            $('#MyCompletedApprovalsDataContainer table').DataTable({
                fixedHeader: true,
                "aaSorting": [1, 'asc']
            });
            $('#MyCompletedApprovalsDataContainer table').removeAttr('style');

            $('.table > thead > tr > th').removeAttr('style');
        }
        else {
            var template = Handlebars.compile($('#noRecordsFoundTemplte').html());
            var model = { "NoRecordFoundMsg": keyCollection["NoRecordsFoundMsg"] };
            $('#MyCompletedApprovalsDataContainer').html(template(model));
            $('.MyCompletedApprovalsCount').text('');
        }
        $('#MyPendingActionsTabContainer').hide();
        $('#MyCompletedApprovalsDataContainer').show();
    }

    function LoadRejectedActivities(assignedToRes) {
        var url = "/_api/Web/Lists/GetByTitle('SKUApplicationItem')/Items?$select=AssignedTo/Id,SKUApplication/Title,PendingWith/Id,PendingWith/Title,SKUApplication/Id,SKUApplication/UniqueID0, *&$expand=AssignedTo/Id,PendingWith,SKUApplication/Title,SKUApplication/UniqueID0&$filter=( " + assignedToRes + " and (Status eq 'Rejected') and (DisplayInDashboard eq 1))&$orderby=Id desc";
        var items = getListItem(url, false);
        if (items.length > 0) {
            var template = Handlebars.compile($('#myRejectedActionsTemplate').html());
            var model = { "items": [] };
            $(items).each(function (index, item) {
                model.items.push({
                    'SlNo': index + 1,
                    'UniqueID': item.SKUApplication.UniqueID0,
                    'Application': item.SKUApplication.Title,
                    'WbsItem': item.Title,
                    'ActualStartDate': GetFormattedDate(item.StartDate),
                    'ActualEndDate': GetFormattedDate(item.DueDate),
                    'Status': item.Status,
                    'Remarks': item.Remarks,
                    'ActionId': item.Id,
                    'ApplicationId': item.SKUApplication.Id
                });
                // });
            });
            $('#MyRejectedDataContainer').html(template(model));
            $('.MyRejectedCount').text(" (" + items.length + ")");

            $('#MyRejectedDataContainer table').DataTable({
                fixedHeader: true,
                "aaSorting": [1, 'asc']
            });
            $('#MyRejectedDataContainer table').removeAttr('style');

            $('.table > thead > tr > th').removeAttr('style');
        }
        else {
            var template = Handlebars.compile($('#noRecordsFoundTemplte').html());
            var model = { "NoRecordFoundMsg": keyCollection["NoRecordsFoundMsg"] };
            $('#MyRejectedDataContainer').html(template(model));
            $('.MyRejectedCount').text('');
        }
        $('#MyPendingActionsTabContainer').hide();
        $('#MyCompletedApprovalsDataContainer').hide();
        $('#MyRejectedDataContainer').show();
    }

   

    $('#MyPendingActionsTab').click(function () {
        if ($('#MyPendingActionsTabContainer table').size() > 0) {
            $('#MyPendingActionsTabContainer').show();
            $('#MyRejectedDataContainer').hide();
            $('#MyOnHoldDataContainer').hide();
            $('#MyCompletedApprovalsDataContainer').hide();
        }
        else {
            LoadMyPendingActivities();
        }
    });

    $('#MyCompletedApprovalsTab').click(function () {
        if ($('#MyCompletedApprovalsDataContainer table').size() > 0) {
            $('#MyPendingActionsTabContainer').hide();
            $('#MyRejectedDataContainer').hide();
            $('#MyOnHoldDataContainer').hide();
            $('#MyCompletedApprovalsDataContainer').show();
        }
        else {
            LoadMyCompletedActivities();
        }
    });

    $('#MyRejectedApprovalsTab').click(function () {
        if ($('#MyRejectedDataContainer table').size() > 0) {
            $('#MyPendingActionsTabContainer').hide();
            $('#MyCompletedApprovalsDataContainer').hide();
            $('#MyOnHoldDataContainer').hide();
            $('#MyRejectedDataContainer').show();
        }
        else {
            LoadRejectedActivities();
        }
    });


    function getTotalCounts(assignedTo) {
        var url = "/_api/Web/Lists/GetByTitle('SKUApplicationItem')/Items?$select=AssignedTo/Id,SKUApplication/Title,PendingWith/Id,PendingWith/Title,SKUApplication/Id,SKUApplication/UniqueID0, *&$expand=AssignedTo/Id,PendingWith, SKUApplication/Title,SKUApplication/UniqueID0&$filter=( " + assignedTo + " and ( (Status eq 'Pending Acknowledgement') or (Status eq 'In Progress') or (Status eq 'Completed and Pending Acknowledgement by Next team') ) and (DisplayInDashboard eq 1))&$orderby=Id desc";
        var myCompletedReqCount = getListItem(url, false);
        $(".myApprovedRequest").html(" (" + myCompletedReqCount.length + ")");

        url = "/_api/Web/Lists/GetByTitle('SKUApplicationItem')/Items?$select=AssignedTo/Id,SKUApplication/Title,PendingWith/Id,PendingWith/Title,SKUApplication/Id,SKUApplication/UniqueID0, *&$expand=AssignedTo/Id,PendingWith, SKUApplication/Title,SKUApplication/UniqueID0&$filter=( " + assignedTo + " and (Status eq 'Completed') and (DisplayInDashboard eq 1))&$orderby=Id desc";
        var alreadyApprovedCount = getListItem(url, false);
        $(".myApprovalRecords").html(" (" + alreadyApprovedCount.length + ")");

        url = "/_api/Web/Lists/GetByTitle('SKUApplicationItem')/Items?$select=AssignedTo/Id,SKUApplication/Title,PendingWith/Id,PendingWith/Title,SKUApplication/Id,SKUApplication/UniqueID0, *&$expand=AssignedTo/Id,PendingWith, SKUApplication/Title,SKUApplication/UniqueID0&$filter=( " + assignedTo + " and (Status eq 'Rejected') and (DisplayInDashboard eq 1))&$orderby=Id desc";
        var rejectedActivitiesCount = getListItem(url, false);
        $(".MyRejectedCount").html(" (" + rejectedActivitiesCount.length + ")");

       
    }
});

function GetCurrentUserGroupName() {
    var getGroupName = IsMember();
    $.each(getGroupName, function (groupIndex, item) {
        if ("Originator" == item.LoginName) {
            $('#add').show();
            $('#PendingRequest,#myApprovedRequest').show();
            //$('#MyApproval,#myApprovalRecords').hide();
            $('#MyApproval').removeClass("is-active");
            myRequest();
            myApproval();
        } else if ("SCM Members" == item.LoginName) {
            $('#add').show();
            $('#PendingRequest,#myApprovedRequest').show();
            $('#MyApproval').removeClass("is-active");
            myRequest();
            myApproval();
        } else if ("Managers" == item.LoginName) {
            $('#PendingRequest,#myApprovedRequest').show();
            //$('#MyApproval,#myApprovalRecords').hide();
            $('#MyApproval').removeClass("is-active");
            myRequest();
            myApproval();
        }
    });
}