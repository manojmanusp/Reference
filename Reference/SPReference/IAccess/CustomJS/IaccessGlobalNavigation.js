
$(document).ready(function () {
    //This makes sure all necessary Js files are loaded before you call taxonomy store
    SP.SOD.executeFunc('sp.runtime.js', false, function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));//loads sp.taxonomy.js file
            SP.SOD.executeFunc('sp.taxonomy.js', false, GetTermsFromTaxonomyStore);
            
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
  $("[aria-owns='menu_container_0']").find('div.layout-column').eq(0).text(_spPageContextInfo.userDisplayName);
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