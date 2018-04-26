
$(document).ready(function () {
    //This makes sure all necessary Js files are loaded before you call taxonomy store
    SP.SOD.executeFunc('sp.runtime.js', false, function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));//loads sp.taxonomy.js file
            SP.SOD.executeFunc('sp.taxonomy.js', false, ScriptLoaded);
            function ScriptLoaded() {
                console.log("sp.js is loaded");
                GetTermsFromTaxonomyStore();
            }
        });
    });
    
    BreadCrumb();
    UserMenu();
});



function BreadCrumb() {
    $("div a.crumb_title")[0].text = _spPageContextInfo.webTitle;
    $("div a.crumb_link")[0].text = document.title;
}

function GetTermsFromTaxonomyStore() {
    window.array = new Array();
    var context = SP.ClientContext.get_current();
    //Current Taxonomy Session
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    //Term Store under which to create the term.
    var termStore = taxSession.getDefaultSiteCollectionTermStore();
    //Pass ID of the Meetings Term Set
    var termSet = termStore.getTermSet('7519de14-3278-4ac4-b94a-7967098ffd3a');
    var terms = termSet.get_terms();
    context.load(terms);
    context.executeQueryAsync(function () {
        var termEnumerator = terms.getEnumerator();
        while (termEnumerator.moveNext()) {
            var currentTerm = termEnumerator.get_current().get_name();
            window.array.push(currentTerm);
            
           // console.log(currentTerm.get_name());
        }

        for (var i = 0; i < array.length; i++) {
            $(".topmenu.layout-row").find("a")[i].text = array[i];
        }

    }, function (sender, args) {
        console.log(args.get_message());
    });
}

function UserMenu()
{
    
    //$("[aria-owns='menu_container_0']").find('div.layout-column').eq(0).text(_spPageContextInfo.userDisplayName);
    $("md-menu").find("div[layout='row']").find("div").eq(0).text(_spPageContextInfo.userDisplayName);
  if($("md-menu-content").find("md-menu-item").eq(2).length>0){
  $("md-menu-content").find("md-menu-item").eq(2).remove();
  }
    $("md-menu-content").find("md-menu-item:first").text("");
    $("md-menu-content").find("md-menu-item:last").text("");
    var divMyProfileOption = '<div class="ms-fcl-tp o365cs-nfd-normal-lineheight"><a class="ms-fcl-tp o365button" role="link" href="https://chennaitillidsoft-my.sharepoint.com/person.aspx" id="O365_SubLink_ShellAboutMe" aria-labelledby="_ariaId_5" style=""><span class="_fc_3 owaimg" style="display: none;"> </span><span class="_fc_4 o365buttonLabel" id="_ariaId_5">My profile</span></a></div>';
 $("md-menu-content").find("md-menu-item:first").append(divMyProfileOption);
  var singoutUrl = 'STSNavigate2\u0028event,\u0027\u002fsites\u002foct9_QA1\u002fIAccess\u002f_layouts\u002f15\u002fSignOut.aspx\u0027\u0029;';
var divSignOutOption = '<div class="ms-fcl-tp o365cs-nfd-normal-lineheight"><a class="ms-fcl-tp o365button" role="link" href="javascript:SuiteOnClick(singoutUrl)" id="O365_SubLink_ShellSignout" aria-labelledby="_ariaId_7" style=""><span class="_fc_3 owaimg" style="display: none;"> </span><span class="_fc_4 o365buttonLabel" id="_ariaId_7">Sign out</span></a></div>';
 $("md-menu-content").find("md-menu-item:last").append(divSignOutOption);
 
}


//function AddItemsToNewRequestList() {

//    var productValue;

//    for (var j = 0; j < $("md-radio-button").length; j++) {
//        if ($("md-radio-button").eq(j).hasClass("md-checked") == true) {

//            productValue = $("md-radio-button").eq(j).text();

//        }
//    }

//    var accountManager = $("[name='AccountManager']").val();
//    var location = $("[name='Location']").val();
//    var requestType = $(".md-select-value").text();
//    var contactDetails = $("[name='ContactDetails']").val();

//    var context = new SP.ClientContext();
//    var list = context.get_web().get_lists().getByTitle("NewRequestList");
//    var listItemCreationInformation = new SP.ListItemCreationInformation();
//    this.listItem = list.addItem(listItemCreationInformation);
//    listItem.set_item('Location', location);
//    listItem.set_item('ContactDetails', contactDetails);
//    listItem.set_item('AccountManager', _spPageContextInfo.userId);
//    listItem.set_item('RequestType', requestType);
//    listItem.set_item('Product', productValue);
//    listItem.update();
//    context.load(listItem);
//    context.executeQueryAsync(OnSuccessAdding, OnFailureAdding);

//    function OnSuccessAdding() {

//        alert("Item added successfully");
//        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Pages/NewRequest.aspx";

//    }
//    function OnFailureAdding(sender, args) {
//        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
//    }
//}


//function DrawKendoGrid() {

//    window.arrayCollection = new Array();
//    var context = SP.ClientContext.get_current();
//    var list = context.get_web().get_lists().getByTitle("NewRequestList");
//    var query = new SP.CamlQuery();
//    query.set_viewXml('<View><ViewFields><FieldRef Name=\'Location\' /><FieldRef Name=\'ContactDetails\' /><FieldRef Name=\'RequestType\' /><FieldRef Name=\'Product\' /></ViewFields></View>');
//    itemColl = list.getItems(query);
//    context.load(itemColl);
//    context.executeQueryAsync(OnSuccess, function OnFailure(sender, args) {
//        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());

//    });

//    function OnSuccess(sender, args) {
//        var itemsEnumerator = itemColl.getEnumerator();
//        while (itemsEnumerator.moveNext()) {
//            var currentItem = itemsEnumerator.get_current();
//            var location = currentItem.get_item("Location");
//            var contactDetails = currentItem.get_item("ContactDetails");
//            var requestType = currentItem.get_item("RequestType");
//            var product = currentItem.get_item("Product");
//            arrayCollection.push({
//                'Location': location,
//                'ContactDetails': contactDetails,
//                'RequestType': requestType,
//                'Product': product,
//                'AccountManager': _spPageContextInfo.userDisplayName
//            });

           
//        }

//        ///<summary>Creats a Kendo Grid for Message List</summary>

//        $("#gridKendo").kendoGrid({
//            dataSource: {
//                type: "odata",
//                data: arrayCollection,
//                pageSize: 20
//            },
//            height: 550,
//            groupable: true,
//            pageable: {
//                refresh: true,
//                pageSizes: true,
//                buttonCount: 5
//            },
//            columns: [{
//                field: 'Location',
//                title: "Location",
//                width: 100
//            },
//            {
//                field: 'ContactDetails',
//                title: "Contact Details",
//                width: 100
//            }, {
//                field: 'RequestType',
//                title: "Request Type",
//                width: 100
//            }, {
//                field: 'Product',
//                title: "Product",
//                width: 100
//            }, {
//                field: 'AccountManager',
//                title: "Account Manager",
//                width: 100
//            }
//            ]
//        });

       
//    }
//}

