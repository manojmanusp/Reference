


$(document).ready(function(){
$('#Slider').attr('style','width:1263.33px !important');
$('.owl-item').attr('style','width:1263.33px !important; height: 400px !important');
$('.owl-stage').css("transform","translate3d(0px, 0px, 0px)");
window.stageWidthNow = $('.owl-item').width();

$('.owl-next').click(function(){ debugger;
$('.owl-stage').css("transform","translate3d(-" + stageWidthNow + "px, 0px, 0px)");
if(!($('.owl-next').hasClass('disabled')))
{
stageWidthNow += $('.owl-item').width();
}
});

$('.owl-prev').click(function(){ debugger;
stageWidthPrev = stageWidthNow - $('.owl-item').width();
$('.owl-stage').css("transform","translate3d(-" + stageWidthPrev + "px, 0px, 0px)");
stageWidthNow = stageWidthPrev;
});
});