'use strict';

buckutt.factory('Notifier', [function () {
	var $modal = $('#modalNotifier');
	var $title = $('#modalNotifierTitle');
	var $content = $('#modalNotifierText');
	var msgCodes = {
		'error': {
			0: 'Erreur inconnue.',
			1: 'Page introuvable.',
			2: 'La carte ne correspond à aucun utilisateur.',
			3: 'Vous n\'avez pas le droit de voir cette page, l\'utilisateur a été déconnecté.',
			4: 'Cette borne n\'est pas enregistrée, l\'utilisateur a été déconnecté.',
			5: 'Pas de client selectionné.',
			6: 'Aucun article a été trouvé pour ce point.',
			7: 'Le serveur a refusé l\'enregistrement. Merci de contacter un administrateur.',
			8: 'Les points de vente sont introuvables.',
			9: 'Un des rechargements a échoué. Merci de contacter immédiatement un administrateur.',
			10 : 'Erreur de chargement des groupes.'
		},
		'notification': {
			0: 'Message non défini.'
		}
	};

	return function (title, type, message, comment="", timeout) {
		$title.text(title);
		if(type != 'whiteboard') $content.text(msgCodes[type][message] + " " + comment);
		else $content.html(comment);
		$modal.modal();
		if(timeout > 0) setTimeout(function() { $modal.modal('hide'); }, timeout);
	};
}]);