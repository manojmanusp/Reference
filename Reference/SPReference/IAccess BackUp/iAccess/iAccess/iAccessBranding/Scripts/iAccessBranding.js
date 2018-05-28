$(function () {
    var siteUrl = _spPageContextInfo.siteServerRelativeUrl;
    if (siteUrl.substr(siteUrl.length - 1) == "/")
        siteUrl = siteUrl.substr(0, siteUrl.length - 1);
    $(".ms-core-listMenu-root li ul").addClass("nav navbar-nav cl-effect-1");
    $("#suiteBarDelta").css("border-bottom", "1px solid rgba(255,255,255,1)");
    $('#ms-help img').attr('src', siteUrl + '/Style%20Library/iAccess/Images/spintl.png');
    $('#zz12_SiteActionsMenu img').attr('src', siteUrl + '/Style%20Library/iAccess/Images/spcommon.png?rev=23');
    setNavigation();
    function setNavigation() {
        var path = window.location.pathname;
        path = path.replace(/\/$/, "");
        path = decodeURIComponent(path);
        $(".cl-effect-1 a").each(function () {
            var href = $(this).attr('href');
            if (path.substring(0, href.length) === href) {
                $(this).addClass('active');
            }
        });
    }
    /*Top bar customization*/
    var interval = setInterval(function () {
        if ($('#suiteBarLeft').length) {
            $('#suiteBarLeft').html("<a title='Home' href='#'><img src='" + siteUrl + '/Style Library/iAccess/Images/TillidLogo.png' + "'></a>");
            $('#suiteBarLeft').css({ "background-image": "url('" + siteUrl + "/Style Library/iAccess/Images/text.png')", "background-repeat": "no-repeat", "background-position": "170px center", "background-size": "contain" });
            clearInterval(interval);
        }
    });
});

