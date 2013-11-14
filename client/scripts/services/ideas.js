/* global angular, _ */

angular.module('govote')
  .factory('ideas', function($rootScope, $q, goConnect, Idea) {
    'use strict';

    function Ideas(namespace) {
      _.extend(this, {
        ideas: {},
        namespace: namespace,
        ready: $q.defer()
      });

      _.bindAll(this);
    }

    Ideas.prototype.create = function(attributes) {
      var self = this;
      var deferred = $q.defer();

      new Idea(this.ideasKey, attributes).save().then(function(idea) {
        self.ideas[idea.id] = idea;

        $rootScope.$broadcast('ideas:add', _.clone(self.ideas));
        deferred.resolve(idea);
      });

      return deferred.promise;
    };

    Ideas.prototype._onAdd = function(ideaData, context) {
      var id = _.last(context.addedKey.split('/'));
      var attributes = _.extend(ideaData, { id: id });

      this.ideas[id] = new Idea(this.ideasKey, attributes);

      $rootScope.$broadcast('ideas:add', _.clone(this.ideas));
    };

    Ideas.prototype.initialize = function() {
      var self = this;

      goConnect.then(function(connection) {
        self.key = connection.rooms.lobby.key(self.namespace);
        self.ideasKey = self.key.key('ideas');
        self.ideasKey.on('add', self._onAdd);
        self.ideasKey.get(function(err, issuesData) {
          if (err) {
            $rootScope.$apply(function() {
              self.ready.reject(err);
            });
          }

          _.each(issuesData, function(issueData, id) {
            var attributes = _.extend(issueData, { id: id });

            self.ideas[id] = new Idea(self.ideasKey, attributes);
          });

          $rootScope.$apply(function() {
            self.ready.resolve(self);
          });
        });
      }, self.ready.reject);

      return self.ready.promise;
    };

    Ideas.prototype.getAll = function() {
      return _.clone(this.ideas);
    }

    var instances = {};

    return {
      namespace: function(namespace) {
        if (instances[namespace]) {
          return instances[namespace];
        }

        instances[namespace] = new Ideas(namespace).initialize();

        return instances[namespace];
      }
    };
  });
