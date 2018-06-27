var myReqArrayItems = new Array();  
var arrayFields = new Array();
var arrayFieldValues = new Array();  
var ApprovalFormArray = [];
var idValue = "";
var commentsInfo = "";
$(document).ready(function () {
    
    JSRequest.EnsureSetup();
    idValue = JSRequest.QueryString["itemID"];
    window.workflowInstanceID = JSRequest.QueryString["workflowInstanceForItem"];
    GetItemDetails(idValue);
    GetTaskID();
	//DrawWorkFlowHistory();
	DrawWorkFlowTasks();
    });   
    
$(window).on("load",function(){
		 setTimeout(function(){
				 if($("#approvalFooter").length>0)
				    { 
				      $("#viewdetailsFooter").hide();
				    }
				    else
				    {
				      $("#viewdetailsFooter").show();
				
				    }          
		 },200);

 
});

var taskComments = new Array();
var taskAssignedToID = "";
var taskStatus = "";
function GetComments()
{
     var itemtypeITReq = "SP.Data.WorkflowTasksItem";
     for(var i=0;i<arrayRelatedItems.length;i++){           
       requestUriITReq =_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Workflow Tasks')/items("+arrayRelatedItems[i].TaskID+")?$select=Status,Action_x0020_Taken,Created,Comments,AssignedTo/Title,AssignedTo/Id&$expand=AssignedTo";
		 $.ajax(
		    {
		        url: requestUriITReq,
		        async: false,
		        type: "GET",				                
		        headers: {
	 					  "Accept": "application/json; odata=verbose"
					     },
	            success: function (data) {
	               var date = new Date(data.d.Created)
	               var dateVariable = date;
                   dateOccured = FormatDate(dateVariable);
		          taskAssignedToID  = data.d.AssignedTo.Id;		          	          
		          taskComments.push({
			            taskid: arrayRelatedItems[i].TaskID, 
			            taskComments: data.d.Comments,
			            taskStatus : data.d.Action_x0020_Taken,
			            taskAssignedTo : data.d.AssignedTo.Title,
			            taskCreated : dateOccured
			        });
		       
		        },
		        error: function (err) {
		             console.log(JSON.stringify(err));
	
		        }
		    }); 
     }
	 


}

var arrayRelatedItems=[];
function GetTaskID()
{
  
	  //itemID=GetParameterValues("itemID");
		jQuery.ajax({
	        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Workflow Tasks')/items?$select=ID,Title,Status,AssignedTo/Title,AssignedTo/Id,RelatedItems,PercentComplete&$expand=AssignedTo&$filter=(AssignedTo/Id eq "+_spPageContextInfo.userId+")",
	        type: "GET",
	        async: false,
	        headers: { "accept": "application/json;odata=verbose"},
	        success: function (data) {
	            if (data.d.results) {
	                $.each(data.d.results,function(key,value){
	                    relatedItemjson=JSON.parse(value.RelatedItems);
	                    if(idValue==relatedItemjson[0].ItemId)
	                    {
	                    	arrayRelatedItems.push({index:idValue,ID:value.ID,TaskID:value.ID});
	                    }
	                });                        
	
	            }
	            GetComments();
	        },
	        error: function (err) {
	            console.log(JSON.stringify(err));
	        }
	    });

}
    function GetItemDetails(idValue)
    {
      	var context = new SP.ClientContext();
	    var list = context.get_web().get_lists().getByTitle("ITRequest");
	    this.oItem= list.getItemById(idValue);   
	    context.load(oItem);		
		context.executeQueryAsync(Function.createDelegate(this, this.onSuccess), Function.createDelegate(this, this.OnFail));    
    }
    
    function onSuccess(sender,args)
    {
     if (oItem.get_item("RequesterID") != null) {
                requester = oItem.get_item("RequesterID").get_lookupValue();
                
            } else {
                requester = "NA";
            }
            
     if (oItem.get_item("ManagerID") != null) {
                manager = oItem.get_item("ManagerID")[0].get_lookupValue();
            } else {
                manager = "NA";
            }
            
	if (oItem.get_item("ITDeskID") != null) {
                itDeskID = oItem.get_item("ITDeskID").get_lookupValue();
            } else {
                itDeskID = "NA";
            }

            
    if (oItem.get_item("Comments") != null) {
                var reg = new RegExp("<div class=\"ExternalClass[0-9A-F]+\">", "");                
                comments = oItem.get_item("Comments").replace(reg, "").replace("</div>","").trim().replace(/&#160;/g," ").replace(/<br>/g,"");
            } else {
                comments = "NA";
            }
			commentsInfo = comments;
            
	if (oItem.get_item("ManagerComments") != null) {
                var reg = new RegExp("<div class=\"ExternalClass[0-9A-F]+\">", "");                
                managerComments = oItem.get_item("ManagerComments").replace(reg, "").replace("</div>","").trim().replace(/&#160;/g," ").replace(/<br>/g,"");
            } else {
                managerComments = "NA";
            }


    if (oItem.get_item("ITDeskComments") != null) {
                var reg = new RegExp("<div class=\"ExternalClass[0-9A-F]+\">", "");                
                itDeskComments = oItem.get_item("ITDeskComments").replace(reg, "").replace("</div>","").trim().replace(/&#160;/g," ").replace(/<br>/g,"");
            } else {
                itDeskComments = "NA";
            }

            

     if (oItem.get_item("Status") != null) {
                status = oItem.get_item("Status");
            } else {
                status = "NA";
            }
            
     if (oItem.get_item("RequestID") != null) {
                requestID = oItem.get_item("RequestID");
            } else {
                requestID = "NA";
            }
     
     if (oItem.get_item("Pending_x0020_with") != null) {
                //if(oItem.get_item('Pending_x0020_with').get_lookupValue()=="ITDesk_Members" && oItem.get_item('Status')=="Approved")
                if(oItem.get_item('Status')=="Approved" ||  oItem.get_item('Status')=="Canceled"){
              		  pendingWith = "NA";
                }
                else
                pendingWith = oItem.get_item('Pending_x0020_with').get_lookupValue();
            }
	    else
                pendingWith = "NA";

	 if (oItem.get_item("Created") != null) {
	                var dateVariable = oItem.get_item('Created');
                    createdOn = FormatDate(dateVariable);	       
                         } 
                    
                    else {
	                createdOn = "NA";
	            }
       
        if (oItem.get_item("Author") != null) {
                createdBy = oItem.get_item("Author").get_lookupValue();
            } else {
                createdBy = "NA";
            }
       
        if (oItem.get_item("Category") != null) {
                category = oItem.get_item("Category").get_lookupValue();
            } else {
                category = "NA";
            }

        //var myReqArrayItems = { "Request ID": requestID,"Comments":comments,"Created On": createdOn,"Pending With": pendingWith,"Manager":manager,"Manager Comments":managerComments,"IT Desk":itDeskID,"IT Desk Comments": itDeskComments,"Status": status,"Created By":createdBy};
        var myReqArrayItems = { "Request ID": requestID,"Comments":comments,"Created On": createdOn,"Pending With": pendingWith,"Manager":manager,"Created By":createdBy,"IT Desk":itDeskID,"Status": status,"Category":category};
        
        $.each( myReqArrayItems, function( key, value ) {
			  arrayFields.push(key);
			  arrayFieldValues.push(value);
				});
		$(".fieldLbl").each(function(index){ 
			  $(this).text(arrayFields[index]);
			  
			});
       	$(".fieldValueLbl").each(function(index){ 
			  $(this).text(arrayFieldValues[index]);
			  
			});
			//updateWFHistoryItem();
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


   function DrawWorkFlowTasks() {       

		txtHTML = "";

        var Header = "<thead>" +
            "<tr>" +
            "<th>Action Taken By</th>" +
            "<th>Action Taken</th>" +
            "<th>Comments</th>" +
            "<th>Action Taken On</th>" +                       
            "</tr>" +
            "</thead>";

        txtHTML += Header;
        txtHTML += "<tbody class='row-border hover order-column dataTable' role='grid'>";        
        
        
        for(var i=0;i<taskComments.length;i++) {
              if(taskComments[i].taskStatus.toLowerCase()!="not started"&&taskComments[i].taskStatus.toLowerCase()!=""){
		     	txtHTML += '<tr>' +   
			    '<TD>' + taskComments[i].taskAssignedTo + '</TD>' +
			    '<TD>' + taskComments[i].taskStatus + '</TD>' +
			    '<TD>' + taskComments[i].taskComments+ '</TD>' +
			    '<TD>' + taskComments[i].taskCreated  + '</TD>';
               // '<TD><a onclick="getViewDetails(' + rowID + ')">View</a></TD>';
                txtHTML += "</tr>";
            }
		}
         txtHTML += "</tbody>";

        //Bind the HTML data to the Table
        $("#idworkflowHistory").append(txtHTML);

        table = $('#idworkflowHistory').DataTable(
            {
                "columnDefs": [
                    { "targets": [0], "visible": true, "width": "25%" },
                    { "targets": [1], "visible": true, "width": "25%" },
                    { "targets": [2], "visible": true,"width": "25%" },
                    { "targets": [3], "className": "dt-center","visible": true, "width": "25%" }                    
                ]
            }
        );
        //table.clear();
        table.draw();
        $(".sorting_asc").removeClass('sorting_asc').addClass('sorting');

}
