'use strict';

buckutt.controller('Connection', [
	'$scope',
	'GetId',
	'GetUser',
	'Error',
	function($scope, GetId, GetUser, Error) {
		$scope.userPin = '';
		
		$scope.autofocus = function() {
			$scope.cardIdFocus = true;
		}

		$scope.pressEnter = function() {
			var cardId = $scope.cardId.replace(/(\s+)?.$/, '');
			if(cardId != "") {
				GetId.get({
					cardId: cardId
				},
				function(res_api) {
					if(res_api.data) {
						askForPin(res_api.data);
					} else {
						Error('Erreur', 2, '(mol)');
					}
				});
				$scope.cardId = '';
			} else Error('Erreur', 2, '(empty)');
		}

		var askForPin = function(mol) {
			GetUser.get({
				user: mol.UserId
			},
			function(res_api) {
				if(res_api.data) {
					$scope.user = res_api.data;
					$('#modalPin').modal();
				} else {
					Error('Erreur', 2, '(user)');
				}
			});
		}

		$scope.changeUserPin = function(value) {
			if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
			else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
		}

		$scope.sendUserPin = function() {
			console.log($scope.userPin);
		}

		$scope.autofocus();
	}
]);