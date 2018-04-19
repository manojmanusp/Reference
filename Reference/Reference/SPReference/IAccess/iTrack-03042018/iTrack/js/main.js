$(document).ready(function(){
	/*Menu Active Starts Here*/
	$('.vmenu a').click(function() {
		$('.vmenu a').removeClass('active');
		$(this).addClass('active');
	});

	$('.logo').click(function() {
		$('.vmenu a').removeClass('active');
		$('.vmenu a:first-child').addClass('active');
	})
	/*Menu Active Ends Here*/	
});