
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
        "<span><input type='button' id='btnSubmit' value='Submit'/></span><span><input type='button' id='btnReset' value='Reset' style='margin-left:23px'/></span>" +        
        "</div ></div > ";
    $(".ms-rtestate-field:first").append(divElement);
    $("#btnSubmit").click(function () {
        
        addWebPart();
    });
    $("#btnReset").click(function () {

        $("#txtPageUrl").val("");
        $("#txtWebpartXml").val("");
    });

});

function addWebPart() {
    serverRelativeUrl = $("#txtPageUrl").val();
    scriptEditorXML = $("#txtWebpartXml").val();
    if (serverRelativeUrl != undefined && serverRelativeUrl != null && serverRelativeUrl != "") {
        clientContext = new SP.ClientContext();
        oFile = clientContext.get_web().getFileByServerRelativeUrl(serverRelativeUrl);
        limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
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
    else {
        if ((serverRelativeUrl == undefined || serverRelativeUrl == null || serverRelativeUrl == "") && (scriptEditorXML == undefined || scriptEditorXML == null || scriptEditorXML == "")) {
            alert("Please enter a page url and xml");
        }
        else {
            alert("Please enter a page url");
        }
    }
}

function onQuerySucceeded() {

    alert(oWebPart.get_title() + " is added to the page");
}

function onQueryFailed(sender, args) {
   
    alert(args.get_message());
}


