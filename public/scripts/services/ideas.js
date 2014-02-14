/* global angular, _ */

angular.module('govote')
  .factory('ideas', function($rootScope, $q, $goConnection, $goKey, Idea) {
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
      attributes.timestamp = new Date().getTime();
      return this.ideasKey.$add(attributes);
    };

    Ideas.prototype.initialize = function() {
      var self = this;

      $goConnection.$ready().then(function() {
        self.key = $goKey(self.namespace);

        self.ideasKey = self.key.$key('ideas');
        self.ideasKey.$sync();
        self.ideasKey.$on('ready', function() {
          _.each(self.ideasKey.$omit(), function(idea, id) {
            self.ideas[id] = new Idea(self.ideasKey.$key(id), id);
          });

          self.ready.resolve(self);
        });

         var opts = {
          local: true,
          listener: function(ideaData, context) {
            var id = _.last(context.addedKey.split('/'));
            self.ideas[id] = new Idea(self.ideasKey.$key(id), id);
          }
        };

        self.ideasKey.$on('add', opts);

      });

      return self.ready.promise;
    };

    Ideas.prototype.getIdeas = function() {
      return this.ideas;
    };

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
