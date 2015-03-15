'use strict';

buckutt.controller('Waiter', [
	'$scope',
	'$rootScope',
	'$location',
	'GetUser',
	'GetId',
	'User',
	'Error',
	function($scope, $rootScope, $location, GetUser, GetId, User, Error) {
		if(!User.hasRight('waiter')) {
			Error('Erreur', 3);
			$location.path("/");
		}
		$scope.autofocus = function() {
			$scope.cardIdFocus = true;
		}
	}
]);