
$(document).ready(function () {
    //This makes sure all necessary Js files are loaded before you call taxonomy store
    SP.SOD.executeFunc('sp.runtime.js', false, function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));//loads sp.taxonomy.js file
            SP.SOD.executeFunc('sp.taxonomy.js', false, GetTermsFromTaxonomyStore);
            
        });
    });
    
});



function GetTermsFromTaxonomyStore() {
    window.array = new Array();
    var context = SP.ClientContext.get_current();
    //Current Taxonomy Session
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    //Term Store under which to create the term.
    var termStore = taxSession.getDefaultSiteCollectionTermStore();
    //Pass ID of the Meetings Term Set
    var termSet = termStore.getTermSet('cef45cf9-b7e4-4c3e-9e16-4206adc47995');
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
            $("div#Home").find("a")[i].text = array[i];
        }
    }, function (sender, args) {
        console.log(args.get_message());
    });
}

