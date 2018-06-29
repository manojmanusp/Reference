(function() {
	'use strict';
	angular.module('peoplePickerCombo', []);
	angular.module('peoplePickerCombo')
		.directive('peoplePicker',	function() {
			return {
				restrict: 'E'
				,require: 'ngModel'
				,scope : {
					 ngDisabled 			: '=?'
					,placeholder			: '@'
					,secondaryPlaceholder	: '@'
					,users					: '=ngModel'
					,maxChips				: '@'
					,minChips				: '@'
					,service				: '&'
				}
				//,templateUrl : './resources/module/combo/people-picker/people-picker.template.html'
				,template : '<div class="md-chip-container md-block" ng-class="{there : !users.length}" flex>\
								<label ng-if="users.length">{{placeholder}}</label>\
								<md-chips\
									readonly="ngDisabled || readonly"\
									aria-label="{{placeholder}}"\
									class="custom-chips"\
									secondary-placeholder="{{secondaryPlaceholder}}"\
									md-max-chips="{{maxChips}}"\
									ng-model="users"\
									md-autocomplete-snap\
									md-require-match="true"\
									md-separator-keys="[13,186]">\
										<md-autocomplete\
											md-menu-class="md-contact-chips-suggestions"\
											md-selected-item="selectedUser"\
											md-search-text="searchText"\
											md-items="item in comboCtrl.userLookupService(searchText)"\
											md-item-text="comboCtrl.itemText(item)"\
											md-no-cache="true"\
											ng-disabled="ngDisabled || (users.length==maxChips)"\
											md-floating-label="{{users.length ? (users.length==maxChips?\'\':secondaryPlaceholder) : placeholder}}"\
											md-autoselect>\
												<div class="md-contact-suggestion">\
													<!-- <img ng-init="getPic(item)"\
												ng-src="{{item.Picture}}"\
												alt="{{item.DisplayName}}"\
													/> -->\
													<span\
														class="md-contact-name"\
														md-highlight-text="userSearchText"\
														md-highlight-flags="ig">\
															{{item.DisplayName}}\
													</span>\
													<span class="md-contact-email">{{item.Email}}</span>\
												</div>\
										</md-autocomplete>\
										<md-chip-template>\
											<div class="md-contact-avatar">\
												<img data-ng-src="{{$chip.PictureURL}}" />\
											</div>\
											<div class="md-contact-name">{{$chip.DisplayName}}</div>\
										</md-chip-template>\
										<button md-chip-remove class="md-primary rchip" type="button">\
											<!--<md-icon md-font-set="material-icons"> close </md-icon>-->x\
										</button>\
								</md-chips>\
							</div>'
				//,replace : true
				,link: function(scope, element, attrs, ctrl) {
					//debugger;
					scope.users = scope.users || [];
					//scope.userLookupService
					
					//scope[attrs.ngModel] = scope.users;
					
					if (angular.isDefined(attrs.ngDisabled) ) {
	                    scope.$watch('ngDisabled', function(isDisabled) {
	                        scope.ngDisabled = isDisabled;
	                    });
	                }
				
					//If provided with an array of user ids, Guess by string
					if(scope.users && scope.users.length){
						var s = scope.service();
						angular.forEach(scope.users,function(obj,idx){
							if(angular.isNumber(obj)){
								s(obj).then(function(r){
									scope.users[idx] = r[0];
								});
							}
						});
					}
					
				}
				,controller : ['$scope', '$timeout', '$q', function($scope, $timeout, $q){
					var vm = this;

					vm.itemText = function(item){
						return item.DisplayName;
					};


					vm.userLookupService = $scope.service();
					
					//If provided with an array of nbk ids, Guess by string
					if($scope.users && $scope.users.length){
						angular.forEach($scope.users,function(obj,idx){
							if(angular.isString(obj)){
								vm.userLookupService(obj).then(function(r){
									$timeout(function(){
										$scope.users[idx] = r[0];
									});
								});
							}
						});
					}
				}]
				,controllerAs : 'comboCtrl'
			};
		});
	
	angular.module('peoplePickerCombo').directive('ppcRequired', function($timeout) {
    return {
      restrict: "A",
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {console.log(scope);
      	if (!ngModelCtrl) {
      		return false;
			  }
      
        // override $isEmpty function
  			ngModelCtrl.$isEmpty = function (val) {
  			  return !val || !val.length;
  			};
  			
  			// add required validator
  			ngModelCtrl.$validators.required = function(modelValue) {
  				return !ngModelCtrl.$isEmpty(modelValue);
  			};
  			
  			// watch changes
  			scope.$watch(attrs.ngModel, function (nVal, oVal) {

  			  if (nVal && nVal !== oVal) {
  			    // run validations
  			    ngModelCtrl.$$runValidators(nVal, oVal, function () {});
  			    // update css classes
  			    ngModelCtrl.$setTouched();
  			    ngModelCtrl.$$updateEmptyClasses(nVal);
  			  }
  			}, true);
      }
    }
  });
	
})(); 