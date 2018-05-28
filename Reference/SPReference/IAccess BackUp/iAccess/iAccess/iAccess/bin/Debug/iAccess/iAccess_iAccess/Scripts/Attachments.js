    $(document).ready(function () {
       
        var documentLibaryName = "Attachments";
        var transactionIdColumnName = "SKUApplicationItemId";
        var qs = getQueryStrings();
        var transactionIdValue = qs["ActivityId"];
        var submitElement = $('#btnApproval');
        var fileInput = $('#filesUpload');
        
        var extensions = "";
        GetExtensions();
		$("#SupportedExtn").html("Supported formats are " + extensions);
		function GetExtensions(){
			var ListUrl = "/_api/Web/Lists/GetByTitle('ExtensionConfig')/Items?&$select=Title,Id,Extension";
			var ExtItems = getListItem(ListUrl, false);
			ExtItems.forEach(function(Items){
				if(Items.Title == "Attachment_EXT"){
					extensions = Items.Extension;
				}
				else{
				  extensions = "";
				}
			});
		}
		
		fileInput.attr("accept", "" + extensions + "");

        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            var context = SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle(documentLibaryName);
            var rootFolder = list.get_rootFolder();           
            context.load(list);
            context.load(rootFolder);           
            context.executeQueryAsync(Function.createDelegate(this, onDocumentListDetailssuccess), Function.createDelegate(this, error));
            function onDocumentListDetailssuccess() {
                var listId = list.get_id();               
                var rootFolderUrl = rootFolder.get_serverRelativeUrl();
                fileInput.uploadifive({
                    'cancelImg': '/_layouts/15/Uploadify/cancel.png',
                    'buttonText': 'Browse Files',
                    'uploadScript': context.get_url() + '/_layouts/15/upload.aspx?IsAJAX=1&List={' + listId + '}&RootFolder=' + rootFolderUrl,
                    'fileDesc': 'Document Files',
                    'fileExt': '*.doc;*.docx;*.pdf, *.zip',
                    'multi': true,
                    'queueSizeLimit': 6,
                    'fileSizeLimit': 30720,
                    'auto': true,
                    'onFileValid': function (fileObject, calbackMethod) {
                    	showLoader();
	                   	if (verifyFileExt(fileObject.name)) { 
	                        if(CheckDuplicate(documentLibaryName,fileObject.name))
	                            calbackMethod.call($('#fileInput'),fileObject);
	                    }
	                    else 
							hideLoader();
                    },
                    'onSelect': function (input, queue) {
                        disbleButton();
                    },
                    'onUploadComplete': function (file, data) {
                        updateTransactionId(documentLibaryName, file.name, transactionIdColumnName, transactionIdValue);
                        AddAttachment(file);
                        hideLoader();
                    },
                    'onQueueComplete': function () {
                       enableButton();
                       hideLoader();
                    },
                    'onAddQueueItem' : function() {
	                    disbleButton();
                    },
                    'onCancel': function() {
                    	if($(this).data('uploadifive').queue.count == 0) {
                    		 enableButton();
                    		 hideLoader();
                    	}
                    },
                    'onClearQueue' : function() {
                    	enableButton();
                    	hideLoader();
                    },
                    'onError': function() {
                    	enableButton();
                    	hideLoader();
                    }

                });
                $('#Submit').click(function () {
                    fileInput.uploadifive('upload');
                    return false;
                });
            }
            function error(sender, args) {
                
            }
        });

		function disbleButton(){
			submitElement.attr('disabled', 'disabled');
		}
		
		function enableButton() {
			submitElement.removeAttr('disabled');
		}


        //Check name duplicate
        function CheckDuplicate(ListName,DocName){
            var isFileAvailable = true;
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('" + ListName + "')/Items?$top=1000&$select=FileLeafRef&$filter=(FileLeafRef eq '" + DocName + "')";           
            var filenames = getDocListItems(url, false);
            $(filenames).each(function (item) {
                if(DocName == item.FileLeafRef){
                    isFileAvailable = false;
                }	
            });
            return isFileAvailable;
        }

        //updating transaction id
        function updateTransactionId(ListName, DocName, ColToUpdate, TransactionID) {
            //Check name duplicate
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('" + ListName + "')/Items?$top=1000&$select=ID&$filter=(FileLeafRef eq '" + DocName + "')";
            var filenames = getDocListItems(url, false);
            if (filenames.length > 0) {
                UpdateLookUpID(documentLibaryName, DocName, filenames[0].ID, transactionIdColumnName, transactionIdValue);
            }
        }
	
        //Get list items
        function getDocListItems(url, idFlag) {
            var ListItem = "";
            $.ajax({
                url: url,
                type: "GET",
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose",
                }, success: function (data) {
                    if (idFlag) {
                        ListItem = data.d;
                    }
                    else {
                        ListItem = data.d.results;
                    }
                },
                error: function (data) {
                    if (data != null && data.responseText != null && data.responseText.length > 0) {
                    }
                }
            });
            return ListItem;
        }
	
        //Update the Particular column
        function UpdateLookUpID(ListName, DocName,itemId, ColToUpdate, TransactionID) {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('" + ListName + "')/Items(" + itemId + ")";
            var ListData = "SP.Data." + ListName + "Item";
            var saveObj = {
                "__metadata": { "type": ListData }
            };
            saveObj[ColToUpdate] = TransactionID;
            UpdateID(url,saveObj);
        }
	
        //Update Id
        function UpdateID(endpointUrl, payload) {
            $.ajax({
                url: endpointUrl,
                type: "POST",
                async: true,
                data: JSON.stringify(payload),
                contentType: "application/json;odata=verbose",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "IF-MATCH": "*",
                },
                success: function (data) {
                },
                error: function (data) {
                    if (data != null && data.responseText != null && data.responseText.length > 0) {
                        
                    }
                }
            });
        }
	
        //Delete particular Document
        function DeleteDocument(ListName,DocName){
            var url = "/_api/Web/Lists/getByTitle('" + ListName + "')/Items?$top=1000&$select=*&$filter=(FileLeafRef eq '" + DocName + "')";
            deleteItem(url);
        }
	
        function deleteItem(url) {
            var listItem = getListItem(url, false);
            if(listItem != null && listItem.length > 0) {
	            $.ajax({
	                url: listItem[0].__metadata.uri,
	                type: "POST",
	                async: false,
	                headers: {
	                    "Accept": "application/json;odata=verbose",
	                    "X-Http-Method": "DELETE",
	                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
	                    "If-Match": listItem[0].__metadata.etag
	                },
	                success: function (data) {
	                
	                },
	                error: function (data) {
	                    if (data != null && data.responseText != null && data.responseText.length > 0) {
	                        AddErrorLog("Delete Request for URL-" + url, data.responseText);
	                    }
	                }
	            });
	         }
        };
        
        function getQueryStrings() {
    		var assoc = {};
    		var decode = function (s) {
    		    return decodeURIComponent(s.replace(/\+/g, " "));
    		};
    		var queryString = location.search.substring(1);
    		var keyValues = queryString.split('&');
    		for (var i in keyValues) {
    		    var key = keyValues[i].split('=');
    		    if (key.length > 1) {
    		        assoc[decode(key[0])] = decode(key[1]);
    		    }
    		}
    		return assoc;
		}

		function verifyFileExt(file) {
	    	var flagFileExt = false;
			var uploadExtension = file.substr((file.lastIndexOf('.') + 1));
	        uploadExtension = "." + uploadExtension;
			var extensionArray = extensions.split(",");
			$(extensionArray).each(function (index, item) {
				if (item.toUpperCase() == uploadExtension.toUpperCase()) {
					flagFileExt = true;
					return false;
				}
	    	    else {
	    	    	flagFileExt = false;
	    	    }
			});
	        if (flagFileExt == false) {
				toastr.info(uploadExtension + " is not a Specified Format File");
	            return false;
	        }
	        return flagFileExt;
		}
		
		function AddAttachment(file) {
			$("#updateTasktblAttachment tbody").append("<tr><td><span style='margin-right: 15px;margin-left: 5px;'>" + file.name + "</span></td><td><a href='#' filename=\"" + file.name.replace("'","''") + "\");'>Remove</a></td></tr>");    
		    // remove scripts
		    $("#updateTasktblAttachment table tbody a").click(function() {
		    	RemoveAttachment($(this).attr('filename'), $(this));
		    });
	    	$('.emptyRow').hide();
		}

		function RemoveAttachment(filename, element) {
           showLoader();
		   DeleteDocument(documentLibaryName,filename);
		   $(element).parents('tr:first').remove();
		   if($("#updateTasktblAttachment tbody tr").length == 1)
		    	$('.emptyRow').show();
		   hideLoader();
	    }
	    
	    function showLoader() {
	    	$('#ApprovalSectionContainer .cssload-container').show();
	    }
	    
	    function hideLoader() {
	    	$('#ApprovalSectionContainer .cssload-container').hide();
	    }
    });