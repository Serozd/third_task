import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Accept from './accept/accept';
import Funds from './funds/funds';
import Main from './main/main';

let componentModule = angular.module('app.components', [
	Main,
  Home,
  About,
  Accept,
  Funds,
])

.name;

export default componentModule;
