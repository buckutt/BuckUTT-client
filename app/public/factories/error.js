'use strict';

buckutt.factory('Error', [function () {
	var $modal = $('#modalError');
	var $title = $('#modalErrorTitle');
	var $content = $('#modalErrorText');
	var msgCodes = {
		0: 'Erreur inconnue.',
		1: 'Page introuvable.',
		2: 'La carte ne correspond à aucun utilisateur.',
		3: 'Vous n\'avez pas le droit de voir cette page, l\'utilisateur a été déconnectée'
	};
	return function (title, message, comment="") {
		$title.text(title);
		$content.text(msgCodes[message] + " " + comment);
		$modal.modal();
	};
}]);