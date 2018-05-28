$(document).ready(function ($) {
    // browser window scroll (in pixels) after which the "menu" link is shown
    
   

    var navigationContainer = $('#cd-nav'),
        mainNavigation = navigationContainer.find('#cd-main-nav ul');

    navigationContainer.addClass('is-fixed').find('.cd-nav-trigger').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
        mainNavigation.addClass('has-transitions');
    });

    //open or close the menu clicking on the bottom "menu" link
    $('#cd-main-nav ul').removeClass("hidden");
    $('.cd-nav-trigger').on('click', function () {
        if ($('.cd-nav-trigger').hasClass("menu-is-open")) {
            $('.cd-nav-trigger').toggleClass('menu-is-open');
            mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
        }
        else {
            $('.cd-nav-trigger').toggleClass('menu-is-open');
            mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
        
        }
        //$(this).toggleClass('menu-is-open');
        
        //we need to remove the transitionEnd event handler (we add it when scolling up with the menu open)       
       // mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
    });

    

    //$('body').click(function () {
    //    if ($('.cd-nav-trigger').hasClass("menu-is-open")) {
    //        $('.cd-nav-trigger').toggleClass('menu-is-open');
    //        mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');
    //    }
    //    else {
    //        $('.cd-nav-trigger').toggleClass('menu-is-open');
    //        mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');

    //    }
    //});


    //$('a[href^="#"]').click(function (e) {

    //    $('html,body').animate({ scrollTop: jQuery(this.hash).offset().top }, 1000);

    //    return false;

    //    e.preventDefault();

    //});

});


