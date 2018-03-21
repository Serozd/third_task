import angular from 'angular';
import uiRouter from 'angular-ui-router';
import acceptComponent from './accept.component';

let acceptModule = angular.module('accept', [
  uiRouter
])
.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('accept', {
      url: '/accept',
      component: 'accept'
    });
})

.component('accept', acceptComponent)

.name;

export default acceptModule;
