'use strict';

buckutt.controller('Connection', [
	'$scope',
	'GetId',
	'GetUser',
	'Error',
	'GetLogin',
	function($scope, GetId, GetUser, Error, GetLogin) {
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

		//var askForPin = function(mol) {
		var askForPin = function() {
			$('#modalPin').modal();
		}

		$scope.changeUserPin = function(value) {
			if(angular.isNumber(value) && $scope.userPin.length < 4) $scope.userPin += value;
			else if(value == "x") $scope.userPin = $scope.userPin.substring(0,$scope.userPin.length-1);
		}

		$scope.log = function() {
			GetLogin.save({
				UserId: $scope.savedId
			},
			function(res_api) {
				if(res_api.token) {
					console.log(res_api.token);
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