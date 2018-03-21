import angular from 'angular';
import uiRouter from 'angular-ui-router';
import fundsComponent from './funds.component';

let fundsModule = angular.module('funds', [
  uiRouter
])
.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";


  $stateProvider
    .state('funds', {
      url: '/funds',
      component: 'funds'
    });
})


.component('funds', fundsComponent)

.name;

export default fundsModule;
