/* global angular */

angular
  .module('govote', ['ngRoute', 'angularMoment', 'goinstant', 'angular-md5'])
  .constant('namespace', 'd')
  .config(function ($routeProvider, goConnectProvider) {
    'use strict';

    goConnectProvider.set(
      'https://goinstant.net/petercyr/servicecloud_goinstant_demo'
    );

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({ redirectTo: '/' });
  });
