$(document).ready(function () {
//This makes sure all necessary Js files are loaded before you call taxonomy store
    SP.SOD.executeFunc('sp.runtime.js', false, function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        	console.log('intiated SP.ClientContext');
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));//loads sp.taxonomy.js file
            SP.SOD.executeFunc('sp.taxonomy.js', false, ScriptLoaded);
            function ScriptLoaded() {
                console.log("sp.js is loaded");
                 $("#btnSearch").kendoButton({
						    click:onSearch
						  });
                DrawKendoGrid();
            }
        });
    });

  //  $("#gridKendo").before('<div id="searchControlsDiv"><input class=k-textbox type=text id="txtSearchString" placeholder="enter search text..." /><button id="btnSearch">Search</button></div>');
    $("#searchControlsDiv").css({"float":"right","width":"20%","padding-left":"82%"});
    if($("[name='userForm']").find(".ng-empty").length>0){
    $("[name='userForm']").find("button").eq(0).attr('disabled','disabled');

    }
    
    //For New Request Form and kendo grid
    //$("[name='AccountManager']").val(_spPageContextInfo.userDisplayName);
    
            $("[name='userForm']").find("button").eq(0).click(function () {
	                   AddItemsToNewRequestList();
            });
      
		      $("[name='userForm']").find("input").blur(function(){
		      
				     if($("[name='userForm']").find(".md-input-invalid").length>0 || $("[name='userForm']").find(".ng-empty").length>0)
		                {
		
		              		 $("[name='userForm']").find("button").eq(0).attr('disabled','disabled');
		
		                }
					else{
					     	 $("[name='userForm']").find("button").eq(0).removeAttr('disabled');
						}
				               
				
				});
    
});



function AddItemsToNewRequestList() {

    var productValue;

    for (var j = 0; j < $("md-radio-button").length; j++) {
        if ($("md-radio-button").eq(j).hasClass("md-checked") == true) {

            productValue = $("md-radio-button").eq(j).text();

        }
    }

    var accountManager = $("[name='AccountManager']").val();
    var location = $("[name='Location']").val();
    var requestType = $(".md-select-value").text();
    var contactDetails = $("[name='ContactDetails']").val();

    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("NewRequestList");
    var listItemCreationInformation = new SP.ListItemCreationInformation();
    this.listItem = list.addItem(listItemCreationInformation);
    listItem.set_item('Location', location);
    listItem.set_item('ContactDetails', contactDetails);
    listItem.set_item('AccountManager', _spPageContextInfo.userId);
    listItem.set_item('RequestType', requestType);
    listItem.set_item('Product', productValue);
    listItem.update();
    context.load(listItem);
    context.executeQueryAsync(OnSuccessAdding, OnFailureAdding);

    function OnSuccessAdding() {

        alert("Item added successfully");
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/NewRequest.aspx";

    }
    function OnFailureAdding(sender, args) {
        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
    }
}


 function onSearch()
{
  	  var searchValue = $("#txtSearchString").val();
      var grid = $("#gridKendo").data("kendoGrid");
      grid.dataSource.query({
        page:1,
        pageSize:20,
        filter:{
          logic:"or",
          filters:[
            {field:"Location", operator:"contains",value:searchValue },
            {field:"ContactDetails", operator:"contains",value:searchValue },
            {field:"RequestType", operator:"contains",value:searchValue },
			{field:"Product", operator:"contains",value:searchValue },
			{field:"AccountManager", operator:"contains",value:searchValue }
            ]
         }
      });
}

function DrawKendoGrid() {

    window.arrayCollection = new Array();
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("NewRequestList");
    var query = new SP.CamlQuery();
    query.set_viewXml('<View><ViewFields><FieldRef Name=\'Location\' /><FieldRef Name=\'ContactDetails\' /><FieldRef Name=\'RequestType\' /><FieldRef Name=\'Product\' /></ViewFields></View>');
    itemColl = list.getItems(query);
    context.load(itemColl);
    context.executeQueryAsync(OnSuccess, function OnFailure(sender, args) {
        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());

    });

    function OnSuccess(sender, args) {
        var itemsEnumerator = itemColl.getEnumerator();
        while (itemsEnumerator.moveNext()) {
            var currentItem = itemsEnumerator.get_current();
            var location = currentItem.get_item("Location");
            var contactDetails = currentItem.get_item("ContactDetails");
            var requestType = currentItem.get_item("RequestType");
            var product = currentItem.get_item("Product");
            arrayCollection.push({
                'Location': location,
                'ContactDetails': contactDetails,
                'RequestType': requestType,
                'Product': product,
                'AccountManager': _spPageContextInfo.userDisplayName
            });


        }

        ///<summary>Creats a Kendo Grid for Message List</summary>

        $("#gridKendo").kendoGrid({
            dataSource: {
                type: "odata",
                data: arrayCollection,
                pageSize: 20
            },
            filterable: true,
            sortable: true,
            groupable: true,
            height: 550,
            groupable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: 'Location',
                title: "Location",
                width: 100
            },
            {
                field: 'ContactDetails',
                title: "Contact Details",
                width: 100
            }, {
                field: 'RequestType',
                title: "Request Type",
                width: 100
            }, {
                field: 'Product',
                title: "Product",
                width: 100
            }, {
                field: 'AccountManager',
                title: "Account Manager",
                width: 100
            }
            ]
        });

		//$("[data-role='droptarget']").css('display','none');
		$("#gridKendo").find("thead").css('background-color','#c1c1c1');
		$("#gridKendo").css({"margin-left":"0px","margin-right":"0px"});
    }
}

