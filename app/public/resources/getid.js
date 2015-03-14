'use strict';

buckutt.factory('GetId', function ($resource) {
	return $resource('/api/meanofloginsusers');
});

buckutt.factory('GetUser', function ($resource) {
	return $resource('/api/users');
});