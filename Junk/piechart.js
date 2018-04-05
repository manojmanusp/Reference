//var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/RoleAssignments?$expand=RoleDefinitionBindings,Member,Member/Users&$filter=Member/PrincipalType%20eq%208&$select=Member/Users,PrincipalId,Member/PrincipalType,Member/Title,Member/Id,Member/OwnerTitle,Member/OnlyAllowMembersViewMembership,RoleDefinitionBindings/Name,RoleDefinitionBindings/Description";
//var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/RoleAssignments?$expand=RoleDefinitionBindings,Member/Users&$select=Member/Users,Member/Title";
//var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/SiteGroups?$expand=Member/Users&$select=Member/Users,Member/Title";
var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/RoleAssignments/Groups?$expand=Users";
function GetUsersAndGroups() {
 window.arrayNew = [];
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            debugger;
            for (var i = 0; i < data.d.results.length; i++)
            {

                for (var j = 0; j < data.d.results[i].Users.results.length; j++) {
                    if (data.d.results[i].Users.results.length > 0) {
                        var groupName = data.d.results[i].Title;
                        var userName = data.d.results[i].Users.results[j].Title;
                        var userEmail = data.d.results[i].Users.results[j].Email;
                        window.arrayNew.push({ GroupName: groupName, UserName: userName, UserEmail: userEmail });
                    }
                }
            }


        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}