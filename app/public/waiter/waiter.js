'use strict';

buckutt.controller('Waiter', [
	'$scope',
	'$location',
	'GetUser',
	'GetId',
	'Device',
	'User',
	'Notifier',
	function($scope, $location, GetUser, GetId, Device, User, Notifier) {
		if(!User.hasRight('waiter', Device.getDevicePoint())) {
			Notifier('Erreur', 'error', 3);
			User.logout();
			$location.path("/")
		}
		
		$scope.autofocus = function() {
			$scope.cardIdFocus = true;
		};

		$scope.pressEnter = function() {
			var cardId = $scope.cardId.replace(/(\s+)?.$/, '');
			if(cardId != "") {
				GetId.get({
					data: cardId,
					isRemoved: false
				},
				function(res_api) {
					if(res_api.data) {
						GetUser.get({
							id: res_api.data.UserId,
							isRemoved: false
						},
						function(res_api) {
							if(res_api.data) {
								User.setBuyer(res_api.data);
								$location.path("/buy");
							}
							else Notifier('Erreur', 'error', 2, '(user)');
						});
					}
					else Notifier('Erreur', 'error', 2, '(user)');
				});
			} else Notifier('Erreur', 'error', 2, '(empty)');
			$scope.cardId = '';
		};

		$scope.askLogout = function() {
			$('#modalLogout').modal();
		};

		$scope.logout = function() {
			User.logout();
			$location.path("/");
		};

		$scope.autofocus();
	}
]);