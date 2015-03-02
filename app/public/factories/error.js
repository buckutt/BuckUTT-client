'use strict';

buckutt.factory('Error', [function () {
	var $modal = $('#modalError');
	var $title = $('#modalErrorTitle');
	var $content = $('#modalErrorText');
	var msgCodes = {
		0: 'Erreur inconnue.',
		1: 'Page introuvable.',
		2: 'La carte ne correspond à aucun utilisateur.'
	};
	return function (title, message) {
			console.log('Here');
		$title.text(title);
		$content.text(msgCodes[message]);
		$modal.modal();
	};
}]);