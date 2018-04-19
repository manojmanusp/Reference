$(document).ready(function() {
    $('#owl-demo1').owlCarousel({
    items: 1,
    autoPlay: true,
    slideSpeed: 1000,
    info: true,
    navText: ["<img src='/sites/oct9_QA1/Style Library/sites/CMF/images/icon-left-dark.png' class='img-responsive' />", "<img src='/sites/oct9_QA1/Style Library/sites/CMF/images/icon-right-dark.png' class='img-responsive' />"],
    nav: true,
    dots: true
    });  
});

function Charcountfunction()  {
	var payLength = $('.paymentbox:first h1').text().length;
	if(payLength>12) {
		$('.paymentbox:first h1').css('font-size','40px');	
	}
	else if(payLength>11) {
		$('.paymentbox:first h1').css('font-size','45px');	
	}
	else if(payLength>10) {
		$('.paymentbox:first h1').css('font-size','50px');	
	}
	else if (payLength>9) {
		$('.paymentbox:first h1').css('font-size','55px');
	}
}

$(document).ready(function() {

Charcountfunction();

	// jQuery.scrollSpeed(100, 750);	

	// $("a").on('click', function(event) {


	// if (this.hash !== "") {

	//   event.preventDefault();


	//   var hash = this.hash;


	//   $('html, body').animate({
	//     scrollTop: $(hash).offset().top
	//   }, 800, function(){


	//     window.location.hash = hash;
	//   });
	// }
	// });

	//$('.phone').mask('(000) 000-0000');


	$('.mobile-menu-icon').click(function() {
		if($('.loginform').hasClass('showlogin')){
			$('.loginform').toggleClass('showlogin')
		}	

		$('.menu').toggleClass('showmobmenu');
	});

	$('.username').click(function(){
		if($('.menu').hasClass('showmobmenu')){
			$('.menu').toggleClass('showmobmenu')
		}
		$('.loginform').toggleClass('showlogin');
	});
});

$(window).scroll(function() {
	Charcountfunction();
	var fixedHeight = $('#Home').outerHeight();
	var logHeight = $('#Home + div h1').outerHeight();
	var menuHeight = $('ul.menu').outerHeight();
	var offsetHeight = fixedHeight/2 + logHeight + menuHeight/2;
	if ($('#Home').offset().top > offsetHeight) {
		$('.scrolltotop').addClass('show');
		$('.loginbar').addClass('reducepadding');
		$('.menu').addClass('fixed');
		$('header h1').addClass('fixed'); 
	}
	else {
		$('.scrolltotop').removeClass('show');
		$('.loginbar').removeClass('reducepadding');
		$('.menu').removeClass('fixed');	
		$('header h1').removeClass('fixed');
	}
});


$(document).on('mouseup', function (e) {
    if (!$(e.target).closest('.loginbar').length) {
        $('.loginform').each(function () {
            $(this).removeClass('showlogin');
        });
    }

    if (!$(e.target).closest('header').length) {
        $('.menu').each(function () {
            $(this).removeClass('showmobmenu');
        });
    }
});


