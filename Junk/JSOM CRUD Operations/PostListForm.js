window.title = "";
window.description = "";
window.createdDate = null;
window.createdBy = "";
window.modifiedBy = "";
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', pageLoad);

    function pageLoad() {
        $('#layoutsTable').parent().append('<input type="hidden" id="_ispostback" value="<%=Page.IsPostBack.ToString()%>" />');
        $("#layoutsTable").after("<div id='divPostListForm'></div > ");
        $("#divPostListForm").before(newDiv);
        $("div.container.dimensions").css('height', '50px');
        $("[name='newItemPost']").click(function () {
            AddNewPostItem();
            $("#myModal .close").click();
        });

        GetPostListItems(title, description);
    }

});

function AddNewPostItem() {
    if ($("#txtTitle").val() != undefined) {
        window.title = $("#txtTitle").val();
    }
    else { title = ""; }
    if ($("#txtDescription").val() != undefined) {
        window.description = $("#txtDescription").val();
    }
    else { description = ""; }
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("PostList");
    var listItemCreationInformation = new SP.ListItemCreationInformation();
    this.listItem = list.addItem(listItemCreationInformation);
    listItem.set_item('Title', title);
    listItem.set_item('Description', description);
    listItem.update();
    context.load(listItem);
    context.executeQueryAsync(function AddItemSuccess(sender, args) {
        alert("Item Added Successfully");
        $("#txtTitle").val("");
        $("#txtDescription").val("");
        window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/PostListForm.aspx";
    }, function AddItemFailed(sender, args) { console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace()); });
}

function GetPostListItems() {
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle("PostList");
    var query = new SP.CamlQuery();
    var camlQuery = '<View>' +
        '<Query> <OrderBy><FieldRef Name="Created" Ascending="FALSE" /></OrderBy></Query>' +
        '<ViewFields><FieldRef Name="Title" /><FieldRef Name="Description" /><FieldRef Name="Author" /><FieldRef Name="Editor" /><FieldRef Name="Created" /></ViewFields>' +
        '</View > ';
    query.set_viewXml(camlQuery);
    itemColl = list.getItems(query);
    context.load(itemColl);
    context.executeQueryAsync(OnSuccess, OnFailure);
    function OnSuccess(sender, args) {
        var itemsEnumerator = itemColl.getEnumerator();
        var i = 0;
        while (itemsEnumerator.moveNext()) {


            var currentItem = itemsEnumerator.get_current();
            if (currentItem.get_item("Title") != undefined) {
                title = currentItem.get_item("Title");
            }
            else { title = ""; }
            if (currentItem.get_item("Description") != undefined) {
                description = currentItem.get_item("Description");
            }
            else { description = ""; }

            var momentDate = moment(new Date(currentItem.get_item("Created")));
            var dateMessage = momentDate.format("M/D/YYYY");
            createdDate = dateMessage;
            if (currentItem.get_item("Author").get_lookupValue() != undefined) {
                createdBy = currentItem.get_item("Author").get_lookupValue();
            }
            else { createdBy = ""; }
            if (currentItem.get_item("Editor").get_lookupValue() != undefined) {
                modifiedBy = currentItem.get_item("Editor").get_lookupValue();
            }
            else { modifiedBy = ""; }
            if (currentItem.get_id() != undefined) {
                var itemID = currentItem.get_id();
            }
            else { itemID = ""; }
            var divId = "itemDiv" + i;
            var div = "<div id='" + divId + "' style='padding-bottom: 50px' ></div>";
            $("#divPostListForm").append(div);
            var tableId = "tablePostList" + i;
            var table = "<table id='" + tableId + "' ></table>";
            var editAndDeleteButton = EditDiv(i);
            jqueryTableID = "#tablePostList" + i;
            jqueryDivID = "#itemDiv" + i;
            var editAndDeleteButton = EditDiv(i);
            $(jqueryDivID).append(table);
            var rowsWithItems = ItemsRow(i, itemID, title, description, createdDate, createdBy, modifiedBy);
            $(jqueryTableID).append(rowsWithItems);
            $(jqueryDivID).append(editAndDeleteButton);
            i++;
        }

        $("[name*='editModal']").click(function () {
            window.postValue = $(this)[0].name.substr(-1);
            row1ID = "#tablePostList" + postValue + " #row1 td:last-child";
            row2ID = "#tablePostList" + postValue + " #row2 td:last-child";
            window.controlTitleID = "#txtTitleEdit" + postValue;
            window.controlDescriptionID = "#txtDescriptionEdit" + postValue;

            if (row1ID != undefined && row2ID != undefined && controlTitleID != undefined && controlDescriptionID != undefined) {
                var txtTitle = $(row1ID).text();
                var txtDescription = $(row2ID).text();
                $(controlTitleID).val(txtTitle);
                $(controlDescriptionID).val(txtDescription);
            }

        });

        $("[name*='editPost']").click(function () {
            var currentItemID = "#currentItemID" + postValue;
            window.currentID = parseInt($(currentItemID).val());
            modalID = "#myModal" + postValue;
            jqueryTableID = "#tablePostList" + postValue;
            containerID = "#containerId" + postValue;
            var title = $(controlTitleID).val();
            var description = $(controlDescriptionID).val();
            var context = new SP.ClientContext();
            var list = context.get_web().get_lists().getByTitle('PostList');
            var listItem = list.getItemById(currentID);
            listItem.set_item('Title', title);
            listItem.set_item('Description', description);
            listItem.update();
            context.executeQueryAsync(function OnSuccessUpdate(sender, args) {
                alert("Item Updated Successfully");
                $(modalID).modal("hide");
                $(".modal-backdrop.fade.in").css('display', 'none');
                if ($(jqueryTableID).length != 0 && $(containerID).length != 0) {
                    $(jqueryTableID).remove();
                }
                GetSpecificTableByID(currentID);
            },
                function OnFailureUpdate(sender, args) {
                    console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
                }
            );

        });

        $("[name*='deletePost']").click(function () {
            postValue = $(this)[0].name.substr(-1);
            itemID = "#currentItemID" + postValue;
            var context = new SP.ClientContext();
            var list = context.get_web().get_lists().getByTitle('PostList');
            var listItem = list.getItemById(parseInt($(itemID).val()));
            listItem.deleteObject();
            context.executeQueryAsync(function OnSuccessDelete(sender, args) {
                alert("Item deleted successfully");
                window.location.href = _spPageContextInfo.webAbsoluteUrl + "/SitePages/PostListForm.aspx";
            }
                , function OnFailureDelete(sender, args) {
                    console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
                });
        });
        $("div.container").css('width', '100%');
        $("div.container").css('height', '25px');

    }
    function OnFailure(sender, args) {
        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
    }
}

function GetSpecificTableByID(currentID) {
    var context = new SP.ClientContext();
    var list = context.get_web().get_lists().getByTitle('PostList');
    listItem = list.getItemById(currentID);
    context.load(listItem);
    context.executeQueryAsync(function OnSuccess(sender, args) {

        if (listItem.get_item("Title") != undefined) {
            title = listItem.get_item("Title");
        }
        else { title = ""; }
        if (listItem.get_item("Description") != undefined) {
            description = listItem.get_item("Description");
        }
        else { description = ""; }

        var momentDate = moment(new Date(listItem.get_item("Created")));
        var dateMessage = momentDate.format("M/D/YYYY");
        createdDate = dateMessage;
        if (listItem.get_item("Author").get_lookupValue() != undefined) {
            createdBy = listItem.get_item("Author").get_lookupValue();
        }
        else { createdBy = ""; }
        if (listItem.get_item("Editor").get_lookupValue() != undefined) {
            modifiedBy = listItem.get_item("Editor").get_lookupValue();
        }
        else { modifiedBy = ""; }
        if (listItem.get_id() != undefined) {
            var itemID = listItem.get_id();
        }
        else { itemID = ""; }
        var tableId = "tablePostList" + postValue;
        var table = "<table id='" + tableId + "' ></table>";
        jqueryTableID = "#tablePostList" + postValue;
        jqueryDivID = "#itemDiv" + postValue;
        var editAndDeleteButton = EditDiv(postValue);
        var divAndContainer = "#itemDiv" + postValue + " #containerId" + postValue;
        $(jqueryDivID).append(table);
        var rowsWithItems = ItemsRow(postValue, itemID, title, description, createdDate, createdBy, modifiedBy);
        //$("#itemDiv3 #containerId3").before("<p>HAIA</p>")
        $(divAndContainer).before(rowsWithItems);
        //$(jqueryDivID).append(editAndDeleteButton);
        $("div.container").css('width', '100%');
        $("div.container").css('height', '25px');
    }, function OnFailure(sender, args) {
        console.log("Message :" + args.get_message() + "/n Trace :" + args.get_stackTrace());
    });

}


var newDiv = "<div class='container dimensions'>" +
    "<button type='button' class='btn btn- info btn- lg' data-toggle='modal' data-target='#myModal'>New Post</button>" +
    " <div class='modal fade' id='myModal' role='dialog>" +
    "< div class='modal- dialog' >" +
    "<div class='modal-content'>" +
    "<div class='modal-header'>" +
    "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
    "<h4 class='modal-title'>New Post</h4>" +
    "</div>" +
    "<div class='modal-body'>" +
    "<table><tr><td>Title</td><td><input type='text' id='txtTitle'</td></tr>" +
    " <tr><td>Description</td><td><input type='text' id='txtDescription'</td></tr>" +
    "</table>" +
    "</div>" +
    "<div class='modal-footer'>" +
    "<button type='button' name='newItemPost'  class='btn btn-default' >Save</button>" +
    "<button type='button' class='btn btn-default' data-dismiss='modal' > Close</button > " +
    "</div>" +
    "</div></div ></div ></div>";


function EditDiv(i) {

    var editDiv = "<div class='container' id='containerId" + i + "'>" +
        "<table><tr><td><button type='button' name='editModal" + i + "' class='btn btn- info btn- lg' data-toggle='modal' data-target='#myModal" + i + "' >Edit Post</button></td>" +
        "<td><button type='button' class='btn btn- info btn- lg' name='deletePost" + i + "'>Delete Post</button></td>" +
        "</tr></table>" +
        " <div class='modal fade' id='myModal" + i + "' role='dialog>" +
        "<div class='modal- dialog' >" +
        "<div class='modal-content'>" +
        "<div class='modal-header'>" +
        "<button type='button' class='close' data-dismiss='modal'>&times;</button>" +
        "<h4 class='modal-title'>Edit Post</h4>" +
        "</div>" +
        "<div class='modal-body'>" +
        "<table><tr><td>Title</td><td><input type='text' id='txtTitleEdit" + i + "'</td></tr>" +
        " <tr><td>Description</td><td><input type='text' id='txtDescriptionEdit" + i + "'</td></tr>" +
        "</table>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "<button type='button' name='editPost" + i + "' class='btn btn-default' >Edit</button>" +
        "<button type='button' class='btn btn-default' data-dismiss='modal' > Close</button > " +
        "</div>" +
        "</div></div ></div ></div>";
    return editDiv;
}


function ItemsRow(i, itemID, title, description, createdDate, createdBy, modifiedBy) {

    var itemsRow = "<tr id='row1'><td>Post Title</td><td><label >" + title + "</label></td></tr >" +
        "<tr id='row2'><td>Post Description</td><td>" + description + "</td></tr>" +
        "<tr id='row3'><td>Created Date</td><td>" + createdDate + "</td></tr>" +
        "<tr id='row4'><td>Created By</td><td>" + createdBy + "</td></tr>" +
        "<tr id='row5'><td>Modified By</td><td>" + modifiedBy + "</td><td><input type='hidden' id='currentItemID" + i + "' name='currentItemID" + i + "' value='" + itemID + "'>  </input></td></tr>" +
        "<br></br><br></br>";
    return itemsRow;
}