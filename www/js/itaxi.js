/* Create the sweetAlert Service singleton */


angular.module('app', ['itaxi.push', 'itaxi.config', 'itaxi.services', 'itaxi.factory', 'itaxi.controllers', 'ui.router','LocalStorageModule', 'uiGmapgoogle-maps'])
	
	.config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
		
		//alert(ip.ip)
		$stateProvider
		    .state('map', {
		        url: '/map',
		        templateUrl: 'views/map.html',
		        controller: 'ctrlMap'
		    })
		    .state('login', {
		        url: '/login',
		        templateUrl: "views/login.html",
		        controller: 'ctrlLogin'
		    })		        

			.state('trips', {
		        url: '/trips',
		        templateUrl: "views/trips.html",
		        controller: 'ctrlTrips'
		    })
		    .state('newTrip', {
		        url: '/newTrip',
		        templateUrl: "views/newtrip.html",
		        controller: 'ctrlNewTrip'
		    })
		    .state('newDriver', {
		        url: '/trips/createDriver',
		        templateUrl: "views/createDriver.html",
		        controller: 'ctrlNewDriver'
		    })
		    .state('cashTrip', {
		        url: '/trips/cashTrip',
		        templateUrl: "views/cashTrip.html",
		        controller: 'ctrlCashTrip'
		    });

		    
		    $urlRouterProvider.otherwise('/login');

		    localStorageServiceProvider
		    .setPrefix('myApp')
		    .setStorageType('sessionStorage')
		    .setNotify(true, true);
		    
	});