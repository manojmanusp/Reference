$(document).ready(function () {

    var deleteJSOMItemControl = '<input type="button" name="deleteItemJSOM" value="Delete Item JSOM" accesskey="O" class="ms-ButtonHeightWidth" target="_self">';
    var listName = "DataList";
    JSRequest.EnsureSetup();
    var idValue = JSRequest.QueryString["ID"];

    $("input[name='deleteItem']").parent().append(deleteJSOMItemControl);

    $("input[name='deleteItemJSOM']").click(function () {
        DeleteItemJSOM(listName, idValue);


    });
});


function DeleteItemJSOM(listName, idValue) {
    var context = new SP.ClientContext();  
    var list = context.get_web().get_lists().getByTitle(listName);
    var listItem = list.getItemById(idValue);
    listItem.deleteObject();
    context.executeQueryAsync(Function.createDelegate(this, this.DeleteItemSuccess), Function.createDelegate(this, this.DeleteItemFailed));
}

function DeleteItemSuccess(sender, args) {
    alert("Item deleted successfully");
    window.location.href = "https://chennaitillidsoft.sharepoint.com/sites/oct9_QA1/Lists/DataList/AllItems.aspx";
}

function DeleteItemFailed(sender, args) {
    console.log("Message :" + args.get_message() + "\n Trace :" + args.get_stackTrace());
}








