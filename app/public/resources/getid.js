'use strict';

buckutt.factory('GetId', function ($resource) {
	return $resource('/api/meanofloginsusers');
});

buckutt.factory('GetUser', function ($resource) {
	return $resource('/api/users');
});

buckutt.factory('GetRights', function ($resource) {
	return $resource('/api/usersrights');
});