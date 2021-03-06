(function() {
  'use strict';
  window.cypress = {};

  cypress.Route = (function() {
    function Route() {}

    Route.prototype.setName = function(name) {
      return this.name = name;
    };

    Route.prototype.setData = function(data) {
      return this.data = data;
    };

    Route.prototype.setDefaultHost = function(defaultHost) {
      return this.defaultHost = defaultHost;
    };

    Route.prototype.getResource = function() {
      var out;
      out = '';
      if (this.data.tokens != null) {
        out = this.extractTokens(this.data.tokens);
      }
      if (out === '') {
        out = '/';
      }
      return out;
    };

    Route.prototype.getHost = function() {
      if (this.data.hosttokens.length > 0) {
        return this.extractTokens(this.data.hosttokens);
      } else {
        return this.defaultHost;
      }
    };

    Route.prototype.extractTokens = function(tokens) {
      var out;
      if (tokens == null) {
        tokens = [];
      }
      out = '';
      tokens.forEach((function(_this) {
        return function(token) {
          switch (token[0]) {
            case 'variable':
              if (_this.hasDefault(token[3]) && _this.getDefault(token[3]) === null) {
                return;
              }
              return out = ("" + token[1] + ":" + token[3]) + out;
            case 'text':
              return out = token[1] + out;
          }
        };
      })(this));
      return out;
    };

    Route.prototype.hasDefault = function(property) {
      return this.data.defaults.hasOwnProperty(property);
    };

    Route.prototype.getDefault = function(property) {
      return this.data.defaults[property];
    };

    return Route;

  })();

  cypress.NgRouter = (function() {
    function NgRouter() {}

    NgRouter.routes = [];

    NgRouter.setData = function(configs) {
      var key, route, _results;
      this.baseUrl = configs.base_url;
      this.prefix = configs.prefix;
      this.host = configs.host;
      this.scheme = configs.scheme;
      _results = [];
      for (key in configs.routes) {
        route = new cypress.Route();
        route.setName(key);
        route.setData(configs.routes[key]);
        route.setDefaultHost(this.host);
        _results.push(this.routes.push(route));
      }
      return _results;
    };

    NgRouter.prototype.generateResourceUrl = function(routeName, absolute) {
      var host, path, _ref, _ref1;
      if (absolute == null) {
        absolute = true;
      }
      path = (_ref = this.findRoute(routeName)) != null ? _ref.getResource() : void 0;
      if (absolute) {
        host = (_ref1 = this.findRoute(routeName)) != null ? _ref1.getHost() : void 0;
        return "" + cypress.NgRouter.scheme + "://" + host + cypress.NgRouter.baseUrl + path;
      } else {
        return "" + cypress.NgRouter.baseUrl + path;
      }
    };

    NgRouter.prototype.findRoute = function(routeName) {
      var matchedRoute;
      matchedRoute = null;
      cypress.NgRouter.routes.forEach(function(route) {
        if (route.name === routeName) {
          return matchedRoute = route;
        }
      });
      return matchedRoute;
    };

    return NgRouter;

  })();

  window.NgRouting = new cypress.NgRouter();

}).call(this);
