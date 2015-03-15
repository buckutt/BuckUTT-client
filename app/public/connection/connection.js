'use strict';

buckutt.controller('Connection', [
	'$scope',
	'$location',
	'$http',
	'GetId',
	'GetUser',
	'GetRights',
	'Error',
	'User',
	'GetLogin',
	'jwtHelper',
	function($scope, $location, $http, GetId, GetUser, GetRights, Error, User, GetLogin, jwtHelper) {
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
		$scope.log = function() {
			GetLogin.save({
				UserId: 9976 // Waiting for the new API-login
			},
			function(res_api) {
				if(res_api.token) {
					User.setToken(res_api.token);
					$http.defaults.headers.common.Authorization = 'Bearer '+User.getToken();
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