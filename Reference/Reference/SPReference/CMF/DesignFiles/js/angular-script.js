

var app=angular.module('CoastalMarineFund',  ['ngMaterial', 'duScroll'])

app.controller('MyCtrl', function($scope, $document){
    $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 750).then(function() {
        console && console.log('You just scrolled to the top!');
      });
    }
  }
).value('duScrollOffset', 30);

app.controller("loginController",function($scope,$window)   {
    $scope.LoginUser=function()    {
        if($scope.project.UserName=='admin' && $scope.project.Password=='pass123')    {
            // alert('hi');
            $window.location.href = 'payment-due.html';
        }
        else    {
            alert('wrong Credentials');
        }
    }
 });