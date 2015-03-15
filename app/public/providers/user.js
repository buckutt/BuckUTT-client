'use strict';

buckutt.provider('User', [
	function () {
		var _token = undefined;
		var _user = undefined;
		var _buyer = undefined;

		this.$get = function() {
			return {
				getUser: function () { 
					return _user;
				},
				hasRight: function(view) {
					return _hasRight(view);
				},
				isLogged: function() {
					return _isLogged();
				},
				setUser: function(user) {
					_setUser(user);
				},
				getBuyer: function () { 
					return _buyer;
				},
				setBuyer: function (buyer) { 
					_setBuyer(buyer);
				},
				getToken: function () { 
					return _token;
				},
				setToken: function (token) { 
					_setToken(token);
				}
			}
		};

		var _setUser = function(data) {
			_user = data;
		};

		var _setBuyer = function(data) {
			_buyer = data;
		};

		var _setToken = function(data) {
			_token = data;
		};

		var _logout = function() {
			_setUser(undefined);
		};

		var _hasRight = function(view) {
			if(!_user) return false;
			switch(view) {
				case 'waiter':
					if(_checkRight(11) || _checkRight(5)) return true;
					return false;
					break;
				default:
					return false;

			}
			return false;
		};

		var _checkRight = function(right) {
			if(!_user) return false;
			for(var key in _user.UsersRights) {
				var value = _user.UsersRights[key];
				if(value.RightId == right) return true;
			}
			return false;
		};

		var _isLogged = function() {
			if(_user) return true;
			return false;
		};
	}
]);