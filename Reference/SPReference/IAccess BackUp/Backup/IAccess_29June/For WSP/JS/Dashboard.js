﻿ var txtHTMLMyRequest = "";
    var tableMyRequest;
    var txtHTMLPendingApprovals = "";
    var tablePendingApprovals;
    var listDataMyRequest;
    var listDataPendingApprovals;
    var requestID = null;
    var created = null;
    var pendingWith = null;
    var status = null;
    var createdBy = null;
    var sNo = null;
    var arrayMyRequests = new Array();
    var arrayPendingAprrovals = new Array();
    var workflowTitle = 'NewRequestApproval';
    var workflowInstanceForItem="";
    
    $(document).ready(function () {
        //Load Finance Report List on page load
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', loadData);
    });
    function loadData() {
        DrawMyRequests();
        DrawPendingApprovals();
    }

    function FormatDate(dateVariable) {

        var month = dateVariable.getMonth() + 1;
        var date = dateVariable.getDate();
        var fullYear = dateVariable.getFullYear();
        var hours = dateVariable.getHours();
        var minutes = dateVariable.getMinutes();
        var date_value = month + "/" + date + "/" + fullYear + " " + hours + ":" + minutes;
        var months = new Array(12);
        months[0] = "Jan";
        months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
        months[7] = "Aug";
        months[8] = "Sep";
        months[9] = "Oct";
        months[10] = "Nov";
        months[11] = "Dec";
        var current_date = new Date(date_value);
        month_value = current_date.getMonth();
        day_value = current_date.getDate();
        if (day_value < 10) {
            day_value = '0' + day_value;
        }

        var twoDigitsCurrentYear = parseInt(new Date().getFullYear().toString().substr(2, 2));
        var time = current_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        return formattedDate = months[month_value] + " " + day_value + " " + twoDigitsCurrentYear + " " + time;
    }

    //Load Tools from Tools List
    function DrawMyRequests() {
        var currentClientContext = new SP.ClientContext.get_current();
        var currentWeb = currentClientContext.get_web();
        var list = currentWeb.get_lists().getByTitle('ITRequest');
        var camlQuery = new SP.CamlQuery();
        var queryItems = new SP.CamlQuery.createAllItemsQuery();
        var query = "<View><Query><OrderBy><FieldRef Name='ID' Ascending='false'/></OrderBy><Where><Eq><FieldRef Name='Author' LookupId='True' /><Value Type='Lookup'>" + _spPageContextInfo.userId + "</Value></Eq></Where></Query></View>";

        // '<View><Query><OrderBy><FieldRef Name="ID" Ascending="TRUE"/></OrderBy></Query></View>'
        queryItems.set_viewXml(query);
        listDataMyRequest = list.getItems(queryItems);
        currentClientContext.load(listDataMyRequest);
        currentClientContext.executeQueryAsync(Function.createDelegate(this, this.success), Function.createDelegate(this, this.failed));
    }
    function success() {

        txtHTMLMyRequest = "";

        var Header = "<thead>" +
            "<tr>" +
            "<th>S.No</th>" +
            "<th>Request ID</th>" +
            "<th>Created On</th>" +
            "<th>Category</th>" +
            "<th>Pending With</th>" +
            "<th>Status</th>" +
            "<th>Actions</th>" +
            "</tr>" +
            "</thead>";

        txtHTMLMyRequest += Header;
        txtHTMLMyRequest += "<tbody class='row-border hover order-column dataTable' role='grid'>";

        var listEnumerator = listDataMyRequest.getEnumerator();
        var i = 1;
        while (listEnumerator.moveNext()) {

            var currentItem = listEnumerator.get_current();

            if (currentItem.get_item('RequestID') != null) {
                requestID = currentItem.get_item('RequestID');
            } else {
                requestID = "";
            }

            if (currentItem.get_item('Created') != null) {
                var dateVariable = currentItem.get_item('Created');
                created = FormatDate(dateVariable);
                //created = currentItem.get_item('Created');
            } else {
                created = "";
            }

            if (currentItem.get_item('Pending_x0020_with') != null) {
                //if(currentItem.get_item('Pending_x0020_with').get_lookupValue()=="ITDesk_Members" && (currentItem.get_item('Status')=="Approved" || currentItem.get_item('Status')=="Canceled"))
                if(currentItem.get_item('Status')=="Approved" || currentItem.get_item('Status')=="Canceled")
                pendingWith = "----";
                else
                pendingWith = currentItem.get_item('Pending_x0020_with').get_lookupValue();
            }
            else{
                pendingWith = "----";
            }
            
            if (currentItem.get_item('Category') != null) {
                category = currentItem.get_item('Category').get_lookupValue();
             }
            else{
                category = "----";
            }

            
            if(currentItem.get_item('Status').toLowerCase() == "pending with requester")
            { 
              pendingWith = currentItem.get_item('RequesterID').get_lookupValue();
            }
            
            if (currentItem.get_item('Status') != null) {
                status = currentItem.get_item('Status');
            } else {
                status = "";
            }
            if (currentItem.get_id() != null) {
                itemID = currentItem.get_id();
            } else {
                itemID = "";
            }

			if (currentItem.get_item(workflowTitle) != null) {
				var workflowStatusValue = currentItem.get_item(workflowTitle); 
				if(workflowStatusValue != undefined)
				{
				    var count = workflowStatusValue.$2_1.split("=").length;
					workflowInstanceForItem = workflowStatusValue.$2_1.split("=")[count-1];
				}	
           	 }
           	 else {
                workflowInstanceForItem = "";
             }
             
            sNo = i;
            rowID = i - 1;
            var bindLinkToReqID = '';
            if(currentItem.get_item('Status').toLowerCase() == "pending with requester")
            {
            	bindLinkToReqID = '<a href="javascript:;" onclick="RequestDetails(\''+requestID +'\',\''+itemID +'\')">'+ requestID +'</a>';
            }
            else
            {
	            bindLinkToReqID = requestID;
            }
            viewDetailsUrl = _spPageContextInfo.webAbsoluteUrl+"/Pages/ViewDetails.aspx";
            editRequestUrl = _spPageContextInfo.webAbsoluteUrl+"/Pages/EditRequest.aspx";
            txtHTMLMyRequest += '<tr>' +
                '<TD>' + sNo + '</TD>' +
                '<TD>'+ bindLinkToReqID +'</TD>'+                
                '<TD>' + created + '</TD>' +
                '<TD>' + category + '</TD>' +
                '<TD>' + pendingWith + '</TD>' +                
                '<TD>' + status + '</TD>' +
                '<TD><a href="javascript:;" target="_blank" onclick="ViewDetails(\''+itemID +'\',\''+ workflowInstanceForItem +'\')">View</a></TD>';
               // '<TD><a onclick="getViewDetails(' + rowID + ')">View</a></TD>';
            txtHTMLMyRequest += "</tr>";
            i++;
            arrayMyRequests.push({ "Request ID": requestID, "Created On": created, "Pending With": pendingWith, "Status": status });
        }
        txtHTMLMyRequest += "</tbody>";

        //Bind the HTML data to the Table
        $("#idMyRequests").append(txtHTMLMyRequest);

        tableMyRequest = $('#idMyRequests').DataTable(
            {
                "columnDefs": [
                    { "targets": [0], "visible": true, "width": "4%" },
                    { "targets": [1], "visible": true, "width": "25%" },
                    { "targets": [2], "className": "dt-center","visible": true, "width": "15%" },
                    { "targets": [3], "visible": true, "width": "17%" },
                    { "targets": [4], "visible": true, "width": "17%" },
                    { "targets": [5], "visible": true, "width": "22%" },
                    { "targets": [6], "className": "dt-center","visible": true, "width": "17%" }

                ]
            }
        );

        tableMyRequest.draw();
    }
    function failed(sender, args) {
        alert("Data Reterival Failed: " + args.get_message());
    }


    function ViewDetails(currentItemID, workflowInstanceForItem)
    {
       window.location.href=viewDetailsUrl+"?itemID="+currentItemID +"&workflowInstanceForItem="+workflowInstanceForItem;    
    }
    
    function RequestDetails(requestID,currentItemID)
    {
       window.location.href=editRequestUrl+"?requestID="+requestID+"&itemID="+currentItemID;    
    }


    function getViewDetails(currentRowID) {

        var requestType = "My Requests";
        $("#myRequestsDetailsDiv").remove();
        if (requestType.toLowerCase() == "my requests") {
            if ($("#myRequestsDetailsDiv").length == 0) {
                $('#divMyRequests').append('<div id="myRequestsDetailsDiv" style="border:1px solid black"></div>');
            }
            $("#myRequestsDetailsDiv").append('<p id="paraMyRequest">My Request View Details</p>');
            $("#myRequestsDetailsDiv").append('<div class="myRequestLeftAlignment" ></div>');
            $("#myRequestsDetailsDiv").append('<div class="myRequestRightAlignment" ></div>');

            $(".myRequestLeftAlignment").append('<div class="rowCSS" ><div class="columnCSS" ><span>Request ID : </span><span>' + arrayMyRequests[currentRowID]["Request ID"] + '</span></div><div class="columnCSS"><span>Status : </span><span>' + arrayMyRequests[currentRowID]["Status"] + '</span></div></div>');
            

            $(".myRequestRightAlignment").append('<div class="rowCSS" style=><div class="columnCSS"><span>Created On : </span><span>' + arrayMyRequests[currentRowID]["Created On"] + '</span></div><div class="columnCSS"><span>Pending With : </span><span>' + arrayMyRequests[currentRowID]["Pending With"] + ' </span></div></div>');
            
        }
        else {
            if ($("#pendingRequestsViewDetailsDiv").length == 0) {
                $('#divPendingApprovals').append('<div id="pendingRequestsViewDetailsDiv" style="border:1px solid black"></div>');
            }
        }
    }
    function DrawPendingApprovals() {
        var currentClientContext = new SP.ClientContext.get_current();
        var currentWeb = currentClientContext.get_web();
        var list = currentWeb.get_lists().getByTitle('ITRequest');
        var camlQuery = new SP.CamlQuery();
        var queryItems = new SP.CamlQuery.createAllItemsQuery();
        var query = "<View><Query><OrderBy><FieldRef Name='ID' Ascending='false'/></OrderBy><Where><And><Eq><FieldRef Name='RequesterID' LookupId='True' /><Value Type='Lookup'>" + _spPageContextInfo.userId + "</Value></Eq><And><Neq><FieldRef Name='Status' /><Value Type='Text'>Approved</Value></Neq><Neq><FieldRef Name='Status' /><Value Type='Text'>Canceled</Value></Neq></And></And></Where></Query></View>";
        queryItems.set_viewXml(query);
        listDataPendingApprovals = list.getItems(queryItems);
        currentClientContext.load(listDataPendingApprovals);
        currentClientContext.executeQueryAsync(Function.createDelegate(this, this.PendingApprovalsuccess), Function.createDelegate(this, this.PendingAprrovalfailed));
    }
    function PendingApprovalsuccess() {


        txtHTMLPendingApprovals = "";

        var Header = "<thead>" +
            "<tr>" +
            "<th>S.No</th>" +
            "<th>Request ID</th>" +
            "<th>Created By</th>" +
            "<th>Created On</th>" +
            "<th>Category</th>" +
            "<th>Pending With</th>" +
            "<th>Status</th>" +
            "<th>Actions</th>" +
            "</tr>" +
            "</thead>";

        txtHTMLPendingApprovals += Header;
        txtHTMLPendingApprovals += "<tbody class='row-border hover order-column dataTable' role='grid'>";

        var listEnumerator = listDataPendingApprovals.getEnumerator();
        var i = 1;  
        while (listEnumerator.moveNext()) {
            var currentItem = listEnumerator.get_current();

            if (currentItem.get_item('RequestID') != null) {
                requestID = currentItem.get_item('RequestID');
            } else {
                requestID = "";
            }

            if (currentItem.get_item('Created') != null) {
                var dateVariable = currentItem.get_item('Created');
                created = FormatDate(dateVariable);
            } else {
                created = "";
            }

            if (currentItem.get_item('Pending_x0020_with') != null) {
                //if(currentItem.get_item('Pending_x0020_with').get_lookupValue()=="ITDesk_Members" && (currentItem.get_item('Status')=="Approved" || currentItem.get_item('Status')=="Canceled"))
                if(currentItem.get_item('Status')=="Approved" || currentItem.get_item('Status')=="Canceled")
                pendingWith = "----";
                else
                pendingWith = currentItem.get_item('Pending_x0020_with').get_lookupValue();
            }
            else{
                pendingWith = "----";
            }
            
            if(currentItem.get_item('Status').toLowerCase() == "pending with requester")
            { 
              pendingWith = currentItem.get_item('RequesterID').get_lookupValue();
            }
 
            if (currentItem.get_item('Status') != null) {
                status = currentItem.get_item('Status');
            } else {
                status = "";
            }
            if (currentItem.get_item('Author') != null) {
                createdBy = currentItem.get_item('Author').get_lookupValue();
            } else {
                createdBy = "";
            }
            
            
            if (currentItem.get_item('Category') != null) {
                category = currentItem.get_item('Category').get_lookupValue();
             }
            else{
                category = "----";
            }
            
            if (currentItem.get_id() != null) {
                itemID = currentItem.get_id();
            } else {
                itemID = "";
            }
           
           if (currentItem.get_item(workflowTitle) != null) {
				var workflowStatusValue = currentItem.get_item(workflowTitle); 
				if(workflowStatusValue != undefined)
				{
				    var count = workflowStatusValue.$2_1.split("=").length;
					workflowInstanceForItem = workflowStatusValue.$2_1.split("=")[count-1];
				}	
           	 }
           	 else {
                workflowInstanceForItem = "";
             }

            sNo = i;
            var bindLinkToReqID = '';
            if(currentItem.get_item('Status').toLowerCase() == "pending with requester")
            {
            	bindLinkToReqID = '<a href="javascript:;" target="_blank" onclick="RequestDetails(\''+requestID +'\',\''+itemID +'\')">'+ requestID +'</a>';
            }
            else
            {
	            bindLinkToReqID = requestID;
            }

            txtHTMLPendingApprovals += "<tr>" +
                "<TD>" + sNo + "</TD>" +
                "<TD>" + bindLinkToReqID + "</TD>" +
                "<TD>" + createdBy + "</TD>" +
                "<TD>" + created + "</TD>" +
                "<TD>" + category + "</TD>" +
                "<TD>" + pendingWith + "</TD>" +
                "<TD>" + status + "</TD>" +
                '<TD><a href="javascript:;" target="_blank" onclick="ViewDetails(\''+itemID +'\',\''+ workflowInstanceForItem +'\')">View</a></TD>';
                
            txtHTMLPendingApprovals += "</tr>";
            i++;
            arrayPendingAprrovals.push({ "Request ID": requestID, "Created On": created, "Pending With": pendingWith, "Status": status, });
        }
        txtHTMLPendingApprovals += "</tbody>";

        //Bind the HTML data to the Table
        $("#idpendingApprovals").append(txtHTMLPendingApprovals);

        tablePendingApprovals = $('#idpendingApprovals').DataTable(
            {
                "columnDefs": [
                    { "targets": [0], "visible": true, "width": "4%" },
                    { "targets": [1], "visible": true, "width": "18%" },
                    { "targets": [2], "visible": true, "width": "13%" },
                    { "targets": [3], "className": "dt-center","visible": true, "width": "16%" },
                    { "targets": [4], "visible": true, "width": "13%" },
                    { "targets": [5], "visible": true, "width": "13%" },
                    { "targets": [6], "visible": true, "width": "16%" },
                    { "targets": [7], "className": "dt-center", "visible": true, "width": "7%" }

                ]
            }
        );

        tablePendingApprovals.draw();
    }
    function PendingAprrovalfailed(sender, args) {
        alert("Data Reterival Failed: " + args.get_message());
    }