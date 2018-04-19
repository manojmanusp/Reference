$(document).ready(function () {
    jQuery.scrollSpeed(100, 1500);
	/*Scroll Animation Starts Here*/
	// Add smooth scrolling to all links
	$("a").on('click', function(event) {

	// Make sure this.hash has a value before overriding default behavior
	if (this.hash !== "") {
	  // Prevent default anchor click behavior
	  event.preventDefault();

	  // Store hash
	  var hash = this.hash;

	  // Using jQuery's animate() method to add smooth page scroll
	  // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
	  $('html, body').animate({
	    scrollTop: $(hash).offset().top
	  }, 800, function(){

	    // Add hash (#) to URL when done scrolling (default click behavior)
	    window.location.hash = hash;
	  });
	} // End if
	});
	/*Scroll Animation Ends Here*/

	/*Menu Active Starts Here*/
	$('.navbar-nav li').click(function() {
		$('.navbar-nav li').removeClass('active');
		$(this).addClass('active');
	});

	$('.logo').click(function() {
		$('.navbar-nav li').removeClass('active');
		$('.navbar-nav li:nth-child(1)').addClass('active');
	})
	/*Menu Active Ends Here*/

	/*Equal Height Script Starts Here*/
	// var maxHeight = -1;
 //   $('.boxshadow').each(function() {
   
 //     maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
 //   });

 //   $('.boxshadow').each(function() {
 //     $(this).height(maxHeight);
 //   });

 //   var maxHeight1 = -1;
 //   $('.boximg-header h3').each(function() {
   	
 //     maxHeight1 = maxHeight1 > $(this).height() ? maxHeight1 : $(this).height();
 //   });

 //   $('.boximg-header h3').each(function() {
 //     $(this).height(maxHeight1);
 //   });
  
	var owl = $('.owl-carousel');
	owl.owlCarousel({
	loop: true,
	autoplay: true,
	smartSpeed: 1000,
	nav : false,
	margin: 30,
	dots: false,
	//navText : [ "<img src='images/left.png' class='img-responsive' />", "<img src='images/right.png' class='img-responsive' />"],
	responsive: {
		0: {
			items: 1
		},
		600: {
			items: 1
		},
		1000: {
			items: 1
		}
		}
	});

 	// var carheight = $('.owl-stage-outer').height();
  //   $('.owl-item').css('height',carheight);
	/*Equal Height Script Ends Here*/

   $('.carousel').carousel({
   		interval: 2500,
		cycle: true
	});



   $('.carousel').hover(function () { 
	  $(this).carousel('pause') 
	}, function () { 
	  $(this).carousel('cycle') 
	})

	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
	    $('.navbar-nav a').bind('click', function(event) {
	        var $anchor = $(this);
	        $('html, body').stop().animate({
	            scrollTop: $($anchor.attr('href')).offset().top
	        }, 1500, 'easeInOutExpo');
	        event.preventDefault();
	    });
	});
});

$(document).click(function(e) {
    if (!$(e.target).is('a') || $(e.target).is('.navbar-nav a')) {
        $('.collapse').collapse('hide');       
    }
});

$(window).scroll(function() {
	if ($("header").offset().top > 100) {
		$("header").addClass("top-nav-collapse");
		$(".movetop").show('slow');
		
        $("header").css("background-color","#04699D");
        //$(".nav-logo ul li:first-child").addClass("logo-agust");
    } else {
        $("header").removeClass("top-nav-collapse");
        $("header").css("background-color","transparent");
        $(".movetop").hide('slow');
        //$(".nav-logo ul li:first-child").removeClass("logo-agust");
    }
});