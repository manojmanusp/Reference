  $(document).ready(function ()
    {

    var deleteItemControl = '<input type="button" name="deleteItem" value="Delete Item" accesskey="O" class="ms-ButtonHeightWidth" target="_self">';
    JSRequest.EnsureSetup();
    var idValue = JSRequest.QueryString["ID"];
    var itemUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('DataList')/items(" + idValue + ")";
    $("input[name$='diidIOGoBack']").parent().append(deleteItemControl);

    $("input[name='deleteItem']").click(function ()
        {
        DeleteItem(itemUrl);
               

        });
    });


    function DeleteItem(itemUrl)
    {  
        $.ajax({
            url: itemUrl,
            type: "POST",
            headers:
            {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "DELETE",
                "IF-MATCH": "*"
            },

            success: function (data) {

                alert("Item Deleted successfully");
                window.location.href = "https://chennaitillidsoft.sharepoint.com/sites/oct9_QA1/Lists/DataList/AllItems.aspx";
            },
            error: function (error) {
                console.log(JSON.stringify(error));

            }

        });
    }










