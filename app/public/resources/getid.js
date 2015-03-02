'use strict';

buckutt.factory('GetId', function ($resource) {
	return $resource('/api/meanofloginsusers?data=:cardId');
});

buckutt.factory('GetUser', function ($resource) {
	return $resource('/api/users/:user');
});