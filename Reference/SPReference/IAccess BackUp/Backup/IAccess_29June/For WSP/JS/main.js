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
	
	
	/*Custom style*/
	  $("header").find(".topmenu").hide();	  
	  $("#contentRow").css("padding-top","0px");
	  $("#suiteBarLeft").css("background-color","#014782");
	  $("#suiteBarRight").css("background-color","#014782");
	  $(".ms-srch-sb").css("background","white");
	  $(".ms-breadcrumb-dropdownBox").css("margin-left","0px");
});                                              


angular.module('BlankApp', ['ngMaterial', 'ngMdIcons'])
    .controller('PositionDemoCtrl', function DemoCtrl($mdDialog) {
        var vm = this;
        vm.announceClick = function (index) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('You clicked!')
                    .textContent('You clicked the menu item at index ' + index)
                    .ok('Nice')
                    .targetEvent(originatorEv)
            );
            originatorEv = null;
        };
        vm.toggleLeft = function () {
            $mdSidenav('left-nav').toggle();
        };
        vm.close = function () {
            $mdSidenav('left-nav').close();
        };
        vm.getdetails = function () {
            console.log('get details');
        }

    });

var header = document.querySelector(".header");
var input = document.querySelector(".search-box-input");
var close = document.querySelector(".delete");

function hideHeader() {
    header.classList.remove('show');
    header.classList.add('hide');
};

function showHeader() {
    if (input.value === '') {
        header.classList.remove('hide');
        header.classList.add('show');
    }
};

function showHeaderOnClose() {
    header.classList.remove('hide');
    header.classList.add('show');
};

                                           