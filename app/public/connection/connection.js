'use strict';

buckutt.controller('Connection', [
	'$scope',
	'$location',
	'$http',
	'GetId',
	'GetUser',
	'GetDevice',
	'GetDevicePoint',
	'Error',
	'User',
	'Device',
	'GetLogin',
	'jwtHelper',
	function($scope, $location, $http, GetId, GetUser, GetDevice, GetDevicePoint, Error, User, Device, GetLogin, jwtHelper) {
		$scope.userPin = '';
		$scope.savedId = '';

		$scope.autofocus = function() {
			$scope.cardIdFocus = true;
		}

		$scope.pressEnter = function() {
			var cardId = $scope.cardId.replace(/(\s+)?.$/, '');
			if(cardId != "") {
				$scope.savedId = cardId;
				askForPin();
			} else Error('Erreur', 2, '(empty)');
			$scope.cardId = '';
		}

		var askForPin = function() {
			$('#modalPin').modal();
		}

		$scope.changeUserPin = function(value) {
			if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
			else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
		}

		var getUserData = function() {
			GetId.get({
				data: $scope.savedId,
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
							var savedUser = res_api.data;
							savedUser.UsersRights = jwtHelper.decodeToken(User.getToken()).rights;
							User.setUser(savedUser);

							$location.path("/waiter");
						}
						else Error('Erreur', 2, '(user)');
					});
				} else {
					Error('Erreur', 2, '(user)');
				}
			});
		}

		var updateDevice = function() {
			GetDevice.get({
				device: Device.getDeviceId(),
				isRemoved: false
			},
			function(res_api) {
				if(res_api.data) {
					var linkId = res_api.data.id;
					GetDevicePoint.get({
						DeviceId: linkId,
						order: 'priority',
						asc: 'DESC',
						embed: 'Period',
						now: (new Date()).toISOString(),
						isRemoved: false
					},
					function(res_api) {
						if(res_api.data) {
							var pointId = getCurrentPoint(res_api.data);
							Device.setDevicePoint(pointId);
							getUserData();
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
		}

		var getCurrentPoint = function(data) {
			if(data.length >= 2) return data[0].PointId;
			return data.PointId;
		};

		$scope.log = function() {
			GetLogin.save({
				MeanOfLoginId: 4,
				data: $scope.savedId,
				pin: $scope.userPin
			},
			function(res_api) {
				if(res_api.token) {
					User.setToken(res_api.token);
					$http.defaults.headers.common.Authorization = 'Bearer '+User.getToken();
					updateDevice();
				} else if(res_api.error) {
					Error('Erreur', 2, '(login)');
				}
			},
			function(err) {
				Error('Erreur', 2, '(login)');
			});
			$scope.userPin = '';
		}

		$scope.clearpin = function() {
			alert('Clear');
			$scope.userPin = '';
		}

		$scope.autofocus();
	}
]);