$(function () {
    // to verify file reader capability for the requested browser
    if (!window.FileReader) {
        return;
    }
    // getting current web url
    var appWebUrl = _spPageContextInfo.webAbsoluteUrl;

    // extention method declaration
    $.uploadDocument = function (serverRelativeUrlToFolder, fileInput, fileName, metaData, onError, onSuccess) {
        /* Get file stream */
        var deferred = jQuery.Deferred();
        var reader = new FileReader();

        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        }

        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }

        reader.readAsArrayBuffer(fileInput[0].files[0]);

        var getFile = deferred.promise();
        // wait until file reading... 
        getFile.done(function (arrayBuffer) {
            // uploading file to document library 
            var addFile = addFileToFolder(arrayBuffer);
            // wait until its done
            addFile.done(function (file, status, xhr) {
                // gettting file item info from rest call
                var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
                // wait until its done
                getItem.done(function (listItem, status, xhr) {
                    // invoke update item
                    var changeItem = updateListItem(listItem.d.__metadata, metaData);
                    // wait until its done
                    changeItem.done(function (data, status, xhr) {
                        if (typeof onSuccess == 'function') {
                            // invoke call back method
                            onSuccess();
                        }
                    });
                    changeItem.fail(onError);
                });
                getItem.fail(onError);
            });
            addFile.fail(onError);
        });

        getFile.fail(onError);
        // method to add file to document library folder
        function addFileToFolder(arrayBuffer) {
            var parts = fileInput[0].value.split('\\');
            var fileName = parts[parts.length - 1];
            // rest url construction
            var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                appWebUrl, serverRelativeUrlToFolder, fileName);
            // ajax request
            return $.ajax({
                url: fileCollectionEndpoint,
                type: "POST",
                data: arrayBuffer,
                processData: false,
                binaryStringRequestBody: true,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "content-length": arrayBuffer.byteLength
                }
            });
        }
        // method to get list item 
        function getListItem(fileListItemUri) {
            var listItemAllFieldsEndpoint = fileListItemUri;
            return $.ajax({
                url: listItemAllFieldsEndpoint,
                type: "GET",
                headers: { "accept": "application/json;odata=verbose" }
            });
        }
        //method to update item with metadata
        function updateListItem(itemMetadata, metaData) {
            var listItemEndpoint = itemMetadata.uri;
            var body = {
                '__metadata': { 'type': itemMetadata.type }
            };
            $.each(metaData, function (key, value) {
                body[key] = value;
            });
            return $.ajax({
                url: listItemEndpoint,
                type: "POST",
                data: JSON.stringify(body),
                headers: {
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "content-type": "application/json;odata=verbose",
                    "content-length": JSON.stringify(body).length,
                    "IF-MATCH": "*", //itemMetadata.etag,
                    "X-HTTP-Method": "MERGE"
                }
            });
        }
    }
});