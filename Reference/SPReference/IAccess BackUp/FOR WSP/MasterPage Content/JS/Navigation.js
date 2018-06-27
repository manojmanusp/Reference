var leftnavlistname = "Left Navigation";
var leftnavhtml ="";
jQuery(document).ready(function () {
    BindLeftNavigation();
    $("#ctl00_Sitemappath1 a:eq(0)").hide();
    var check = ""; var data = $("#ctl00_Sitemappath1 span").length; for (var i = 0 ; i < data ; i++) {
        check = $('#ctl00_Sitemappath1 span:eq(' + i + ')').text(); 
        if (check == ' > ') {
            
            $('#ctl00_Sitemappath1 span:eq(' + i + ')').html('<i class="material-icons">play_arrow</i>');
        }
    }
   
});
function BindLeftNavigation() {
    var temp="";
	var linkUrl="";
	var linkName="";
	var activeclass="";
    temp += '<md-list class="vmenu">';
	$("#sideNavBox ul.root > li").each(function() {
	
		if(!$(this).hasClass('dynamic-children') && !$(this).hasClass('ms-navedit-editArea'))
		{
			var linkUrl=$(this).find('a').attr('href');			
			var linkName=$(this).find('.menu-item-text:first').text();	
			if($(this).hasClass('selected')||$(this).find('li').hasClass('selected'))
				activeclass=" active";
			else
				activeclass=""	
				if(linkName!="Recent")
			temp+='<md-list-item><a class="menu-'+ linkName.toLowerCase() + activeclass + '" href="' + linkUrl + '">' + linkName + '</a></md-list-item>';
		
		}
    });
 temp += ' </md-list>';
 $("#left_Navigation").append(temp);
       
}