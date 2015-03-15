'use strict';

buckutt.controller('Waiter', [
	'$scope',
	'$location',
	'GetUser',
	'GetId',
	'GetDevice',
	'GetDevicePoint',
	'User',
	'Error',
	function($scope, $location, GetUser, GetId, GetDevice, GetDevicePoint, User, Error) {
		if(!User.hasRight('waiter')) {
			Error('Erreur', 3);
			$location.path("/")
		}
		var deviceId = 1; // TO DO: get device id from pertelian app
		GetDevice.get({
			device: deviceId,
			isRemoved: false
		},
		function(res_api) {
			if(res_api.data) {
				var linkId = res_api.data.id;
				GetDevicePoint.get({
					DeviceId: linkId,
					order: 'priority',
					asc: 'DESC',
					isRemoved: false
				},
				function(res_api) {
					if(res_api.data) {
						var pointId = getCurrentPoint(res_api.data);
						
					} else {
						Error('Erreur', 4, 'DevicePoint');
						$location.path("/");
					}
				});
			} else {
				Error('Erreur', 4, 'Device');
				$location.path("/");
			}
		});

		var getCurrentPoint = function(data) {
			if(data.length >= 2) return data[0].PointId;
			return data.PointId;
		};

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
							else Error('Erreur', 2, '(user)');
						});
					}
					else Error('Erreur', 2, '(user)');
				});
			} else Error('Erreur', 2, '(empty)');
			$scope.cardId = '';
		};
	}
]);