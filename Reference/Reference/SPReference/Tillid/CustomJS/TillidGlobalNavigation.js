
$(document).ready(function () {
    //This makes sure all necessary Js files are loaded before you call taxonomy store
    SP.SOD.executeFunc('sp.runtime.js', false, function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));//loads sp.taxonomy.js file
            SP.SOD.executeFunc('sp.taxonomy.js', false, ShowGlobalNavTerms);

        });
    });
    $("#navbar").css('background-color', 'black');


});


var termsList = "";
function ShowGlobalNavTerms() {

    window.parentArray = new Array();
    window.childTerms = new Array();
    window.context = SP.ClientContext.get_current();
    //Current Taxonomy Session
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    //Term Store under which to create the term.
    var termStore = taxSession.getDefaultSiteCollectionTermStore();
    //Pass ID of the Meetings Term Set
    var termSet = termStore.getTermSet('181704b5-7284-4603-9e95-1dafa0d4e68d');
    var terms = termSet.getAllTerms();
    context.load(terms);
    context.executeQueryAsync(function success(sender, args) {
        var termsEnum = terms.getEnumerator();
        var orderArray = new Array();
        var x = 0;
        while(termsEnum.moveNext()) {
            
            var arrayTerm = {
                termName: '',
                child: []
            };

            var currentTerm = termsEnum.get_current();
            var termName = currentTerm.get_name();
            var termPath = currentTerm.get_pathOfTerm().split(';');

            arrayTerm["termName"] = termPath[0];
            if (termPath[1] != undefined) {

                orderArray[currentTerm.get_customProperties().order] = termPath[1];


            }

            if (x == terms.get_count()-1) {

                for (var i = 1; i < orderArray.length; i++) {
                    childTerms.push(orderArray[i]);
                }
            }
            if (termPath[1] != undefined) {
                var name = arrayTerm.termName;
                if (name == termPath[0]) {
                    arrayTerm.child.push(childTerms);
                    for (var i = 0; i < parentArray.length; i++) {
                        if (parentArray[i].termName == termPath[0]) {
                            parentArray[i] = arrayTerm;
                        }
                    }
                }
            }
            else {
                parentArray.push(arrayTerm);
            }
            x++;
        }

        $('#navbar').find('li').not('li[role="presentation"]').each(function (index, value) {

            $(this).find('a:first').text(parentArray[index].termName);
        });

        $('#navbar').find('li.dropdown').each(function (index, value) {
            for (var i = 0; i < parentArray.length; i++) {
                if ($(this).find('a:first').text().toLowerCase() == parentArray[i].termName.toLowerCase()) {
                    if ($(this).find('ul a').length > 0) {
                        $(this).find('ul a').each(function (j) {
                            $(this).text(parentArray[i].child[0][j]);
                        });
                    }
                }
            }
        });
       
        
    },
        function failure(sender, args) {
            console.log("Message : " + args.get_message());
        }
    );
}


