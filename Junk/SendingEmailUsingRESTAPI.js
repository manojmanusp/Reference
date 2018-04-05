



function sendEmail() {
    var urlTemplate = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.Utilities.Utility.SendEmail";
    
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: 'POST',
        data: JSON.stringify({
            'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': "murali@chennaitillidsoft.onmicrosoft.com",
                'To': { 'results': ["murali@chennaitillidsoft.onmicrosoft.com"] },
                'Subject': "Test mail",
                'Body': "Test mail"
            }
        }
        ),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            alert("Mail sent");
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}