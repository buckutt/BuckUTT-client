'use strict';

buckutt.controller('Waiter', [
	'$scope',
	'$rootScope',
	'$location',
	'GetUser',
	'GetId',
	'Error',
	function($scope, $rootScope, $location, GetUser, GetId, Error) {
		$scope.autofocus = function() {
			$scope.cardIdFocus = true;
		}
	}
]);