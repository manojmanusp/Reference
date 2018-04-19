window.globalVar = "";
var listName = "";
window.itemTitle = $('#txtTitle').val();


$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', testing);
});
function testing() {
    console.log('sp.js loaded');
    $(".ms-wikicontent.ms-rtestate-field").after('<div id="crudDiv">Title : <input type="text" id="txtTitle" name="listItemTitle"><br><table><tr><td><button type="button" onclick="addItem()">Add</button> </td><td><button type="button" onclick="updateItem()">Update</button> </td><td><button type="button" onclick="deleteItem()">Delete</button> </td></tr></table ></div>');
}

function addItem() {
    addItemMethod("TestList1", itemTitle);
}
function addItemMethod(listName, itemTitle) {
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle(listName);
    var listItemCreationInformation = new SP.ListItemCreationInformation();
    this.listItem = list.addItem(listItemCreationInformation);
    listItem.set_item('Title', itemTitle);
    listItem.update();
    context.load(listItem);
    context.executeQueryAsync(Function.createDelegate(this, this.AddItemSuccess), Function.createDelegate(this, this.AddItemFailed));
}

function AddItemSuccess(sender, args) {
    alert("Item Added Successfully");
    window.location.href = _spPageContextInfo.webAbsoluteUrl + "/Lists/TestList1/AllItems.aspx";
    window.globalVar = listItem.get_id();
    console.log(window.globalVar);
}

function AddItemFailed(sender, args) {
    console.log("Failure");
}


function updateItem() {
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("TestList1");
    var lstObjectItem = list.getItemById(window.globalVar);
    lstObjectItem.set_item('Title', itemTitle);
    lstObjectItem.update();
    context.executeQueryAsync(Function.createDelegate(this, this.UpdateItemSuccess), Function.createDelegate(this, this.UpdateItemFailed));
}


function UpdateItemSuccess(sender, args) {
    console.log("Update Success");
}

function UpdateItemFailed(sender, args) {
    console.log("Update Failed");
}


function deleteItem() {
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("TestList1");
    var lstObjectItem = list.getItemById(window.globalVar);
    addItemMethod("TestList1Recycle");
    lstObjectItem.deleteObject();
    context.executeQueryAsync(Function.createDelegate(this, this.DeleteItemSuccess), Function.createDelegate(this, this.DeleteItemFailed));
}

function DeleteItemSuccess(sender, args) {
    console.log("Delete Success");
}

function DeleteItemFailed(sender, args) {
    console.log("Delete Failed");
}