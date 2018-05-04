
var serverRelativeUrl;
var webpartName;
var clientContext;
var oFile;
var limitedWebPartManager;
var oWebPart;
var scriptEditorXML;
$(document).ready(function () {
    var divElement = "<div class='addWebPartDiv'><div class='pageUrlDiv'><span class='pageUrlSpan'>Page Url : </span><input type='text' id='txtPageUrl' style='margin-left: 40px'/>" +
        "<div id='multiLineDiv'><span>Webpart Xml</span><textarea name='textarea' id='txtWebpartXml' rows='5' style='margin-left:23px'></textarea></div>" +
        "<div class='submitDiv'><input type='button' id='btnSubmit' value='Submit'/></div>" +
        "</div ></div > ";
    $(".ms-rtestate-field:first").append(divElement);
    $("#btnSubmit").click(function () {
        arrayWebparts = [];
        addWebPart();
    });

});

function addWebPart() {
    serverRelativeUrl = $("#txtPageUrl").val();
    scriptEditorXML = $("#txtWebpartXml").val();
    if (serverRelativeUrl != undefined && serverRelativeUrl != null && serverRelativeUrl != "") {
        clientContext = new SP.ClientContext();
        oFile = clientContext.get_web().getFileByServerRelativeUrl(serverRelativeUrl);
        limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
        this.collWebPart = limitedWebPartManager.get_webParts();
        clientContext.load(collWebPart, 'Include(WebPart)');
        clientContext.executeQueryAsync(onSuccess, onFailure);
    }
    else {
        if ((serverRelativeUrl == undefined || serverRelativeUrl == null || serverRelativeUrl == "") && (scriptEditorXML == undefined || scriptEditorXML == null || scriptEditorXML == "")) {
            alert("Please enter a page url and xml");
        }
        else {
            alert("Please enter a page url");
        }
    }
}

function onSuccess() {

    if (!collWebPart.get_count()) {
        alert('No Web Parts on this page.');
    }
    
    if (scriptEditorXML != undefined && scriptEditorXML != null && scriptEditorXML != "") {
        var oWebPartDefinition = limitedWebPartManager.importWebPart(scriptEditorXML);
        oWebPart = oWebPartDefinition.get_webPart();

        limitedWebPartManager.addWebPart(oWebPart, 'Left', 1);

        clientContext.load(oWebPart);

        clientContext.executeQueryAsync(onQuerySucceeded, onQueryFailed);
    }
    else {
        alert("Please enter a xml.");
    }
   
}

function onFailure(sender, args) {
    alert('Enter a valid URL');
}

function onQuerySucceeded() {

    alert(oWebPart.get_title() + " is added to the page");
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}



//extra

//"<div class='webpartNameDiv'><span class='pageUrlSpan'>Webpart Name : </span><input type='text' id='txtWebpartName'/></div>" +




//    webpartName = $("#txtWebpartName").val();
//if (webpartName != undefined && webpartName != null && webpartName != "") {
//    var isExist = checkValue(webpartName, arrayWebparts);
//    if (isExist == 'Exist') {
//        alert("Webpart with same name already available in the page.Please choose an other name.");
//    }
//else {
//}


//}
//else {
//    alert("Please enter a webpart name.");
//}

//for (var i = 0; i < collWebPart.get_count(); i++) {
//    var currentWebPartDef = collWebPart.getItemAtIndex(i);
//    var webPart = currentWebPartDef.get_webPart();
//    console.log(webPart.get_title());
//    arrayWebparts.push(webPart.get_title());
//}



//function checkValue(value, arrayWebparts) {
//    var status = 'Not exist';

//    for (var i = 0; i < arrayWebparts.length; i++) {
//        var name = arrayWebparts[i];
//        if (name == value) {
//            status = 'Exist';
//            break;
//        }
//    }

//    return status;
//}
