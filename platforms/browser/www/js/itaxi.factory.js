var ip = '52.14.211.10';
var port = '1337';


angular.module('itaxi.factory', [])

.factory('global', function ( $state, $http, $rootScope, localStorageService, swal) {
	    var global = {};
	    $rootScope.guardando = false;
	    global.startPoint = {};
	    global.endPoint = {};
	    $rootScope.uncashedTrip = {};
	    global.myTrips = new Array();
	    $rootScope.address = '';
	    var markerId = 0;
		$rootScope.drivers = false;
		$rootScope.clients = false;

	    global.buttonValue = "indeterminate";	   

	    $rootScope.goto = function(to, desc){
	    	
	    	global.buttonValue = desc;	    	
	    	$state.go(to);
	    }
	    //Iniciar sesion conductores
	    global.loginDriver = function(user){
	    	$rootScope.cargando = true;
		        $http({
		            method: 'post',
		            cache: false,
		            headers: {'Content-Type': 'application/json'},
		            url: 'http://' + ip + ':' + port + '/drivers/session',
		            data :{
		            	user : user.user,
		            	password: user.password, 
		            	pushToken : localStorageService.get('pushtoken')
		            }
		        })
		        .then(function successCallback(response) {
		            $rootScope.cargando = false;
		            $rootScope.cargando = false;
          			if (response.data.user == null) {
          				swal.warning("Message", "user not found")
          			} else {
          				$rootScope.user = response.data.user;
          				$rootScope.drivers = true;
          				localStorageService.set('sesion', response.data.user);
          				swal.success("Welcome", "Press 'OK' to close");
          				$state.go('cashTrip');
          			}
		      }
		      ,function errorCallback(response) {
		      	$rootScope.cargando = false;
		      	swal.error("Error", "No se recibio respuesta del servidor")
		    });
    	};

    	//Iniciar sesion clientes
	    global.loginClient = function(user){
		        $rootScope.cargando = true;
		        $http({
		            method: 'post',
		            cache: false,
		            headers: {'Content-Type': 'application/json'},
		            url: 'http://' + ip + ':' + port + '/clients/session',
		            data :{
		            	user : user.user,
		            	password: user.password,
						pushToken : localStorageService.get('pushtoken')
		            }
		        })
		        .then(function successCallback(response) {
		            $rootScope.cargando = false;
          			if (response.data.user == null) {
          				swal.warning("Message", "user not found")

          			} else {
          				$rootScope.user = response.data.user;
          				$rootScope.clients = true;
          				localStorageService.set('sesion', response.data.user);
          				
          				swal.success("Welcome", "press ok to close")
          				$state.go('newTrip');
          			}
		      }
		      ,function errorCallback(response) {
		      	$rootScope.cargando = false;
		      	swal.error("Error", "No se recibio respuesta del servidor")
		    });
    	};

    	//obtener mis viajes (Cliente)
    	global.getMyTrips = function() {
		        $rootScope.cargando = true;
		        $http({
		            method: 'GET',
		            cache: false,
		            headers: {'Content-Type': 'application/json'},
		            url: 'http://' + ip + ':' + port + '/trips/' + localStorageService.get('sesion')._id,
		        })
		        .then(function successCallback(response) {
		            $rootScope.cargando = false;
		            angular.copy(response.data.trips, global.myTrips);
		            $.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});		            
		      	}
		      	,function errorCallback(response) {
		      		swal.error("Error", "No se recibio respuesta del servidor")
		    });
    	};

    	//Crear nuevo viaje
    	global.newTrip = function(trip){
		    $rootScope.cargando = true;
		    $http({
		        method: 'post',
		        cache: false,
		        headers: {'Content-Type': 'application/json'},
		        url: 'http://' + ip + ':' + port + '/trips/' + localStorageService.get('sesion')._id,
		        data : {
		        	longitudestart :trip.startPoint.longitudestart,
		            latitudestart : trip.startPoint.latitudestart,
		            longitudeend : trip.endPoint.longitudeend,
		            latitudeend : trip.endPoint.latitudeend
		            }
		        })
		        .then(function successCallback(response) {
					$rootScope.cargando = false;		        												
		            if(!response.data.error){
						swal.success("Message", response.data.message)		
		            	global.startPoint = {};
	    				global.endPoint = {};
		            	$state.go('trips');	
		            }else{
		            	swal.error("Message", response.data.message)		
		            }
		      	}
		      	,function errorCallback(response) {
		        	$rootScope.cargando = false;
		        	swal.error("Error", "No se recibio respuesta del servidor")
		    });
    	};
    	
    	//Cobrar un  viaje (Conductor)
    	global.cashTrip = function(trip){
		    $rootScope.cargando = true;
		    $http({
		        method: 'post',
		        cache: false,
		        headers: {'Content-Type': 'application/json'},
		        url: 'http://' + ip + ':' + port + '/trips/cash/' + $rootScope.uncashedTrip._id,
		        data : {
		        	duration : 2
		            }
		        })
		        .then(function successCallback(response) {
		        	
		            $.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});
		            //Actualiza la GUI para quitar o dejar el viaje
		           if (response.data.error) {
		           		return false;
		           } else {
		           		swal.success("Message", response.data.message);
		           		$rootScope.uncashedTrip = {};		           	
						//$state.go('cashTrip');		           			           
		           	}
		      	}
		      	,function errorCallback(response) {
		       		$rootScope.cargando = false;
		       		swal.error("Error", "No se recibio respuesta del servidor")
		    });
    	};

    	//obtener viaje por cobrar (Conductor)
    	global.getUncashedTrip = function() {
		    $rootScope.cargando = true;
		    $http({
		        method: 'GET',
		        cache: false,
		        headers: {'Content-Type': 'application/json'},
		        url: 'http://' + ip + ':' + port + '/trips/uncashed/' +localStorageService.get('sesion')._id,
			})
		        .then(function successCallback(response) {
		        		$rootScope.cargando = false;
		        		angular.copy(response.data.trip, $rootScope.uncashedTrip);
		       			//Notificación visual
		        		$.toast({
					    heading: (response.data.error)? 'Error':'Success',
					    text: response.data.message,
					    icon: (response.data.error)?'error':'success',
						position: 'bottom-center',
						showHideTransition: 'slide',
						bgColor : (response.data.error)?'#ff0000': '#1663c9',
					    loader: true,        // Change it to false to disable loader
					    textColor : 'white',
					    loaderBg: (response.data.error)?'#c60000':'#9EC600'  // To change the background
						});		        		
		      	}
		      	,function errorCallback(response) {
		      		$rootScope.cargando = false;
		        	swal.error("Error", "No se recibio respuesta del servidor")
		    });
    	};

		
    	//Validar que haya unsa sesión activa
    	global.verificateSession = function () {
	
	        if (localStorageService.get('sesion') == null)
	        {
	            $rootScope.visible = false;
	            $state.go('login');
	            swal.warning("Warning", "you should start an session");
	            return false;
	        }
	        if(localStorageService.get('sesion').balance == null){
	            $rootScope.drivers = true;
	            $rootScope.clients = false;
	        }else{
	            $rootScope.clients = true;
	            $rootScope.drivers = false;
	        }
	        $rootScope.visible = true; //se puede ver?
	        $rootScope.user = localStorageService.get('sesion');
	        return true;	        
    	};

    	$rootScope.closeSession = function(){
    		$rootScope.drivers = false;
			 $rootScope.clients = false;
		     $rootScope.visible = false;
		     localStorageService.remove('sesion');
		     $state.go('login');		     
		};

		function create(latitude, longitude) {
	        var marker = {
	            latitude: latitude,
	            longitude: longitude,
	            id: ++ markerId          
	        };
	        return marker;        
    	}

    	function invokeSuccessCallback(successCallback, marker) {
	        if (typeof successCallback === 'function') {
	            successCallback(marker);	        
	        }
    	}

    	global.createByCurrentLocation = function (successCallback) {
	        if (navigator.geolocation) {
	            navigator.geolocation.getCurrentPosition(function (position) {
	                var marker = create(position.coords.latitude, position.coords.longitude);
	                invokeSuccessCallback(successCallback, marker);
	            });
	        } else {
	            swal.error("Error", "No se recibio respuesta del servidor")
	        }
    	}

    	global.createByAddress = function (address, successCallback) {
	        var geocoder = new google.maps.Geocoder();
	        geocoder.geocode({'address' : address}, function (results, status) {
	            if (status === google.maps.GeocoderStatus.OK) {
	                var firstAddress = results[0];
	                var latitude = firstAddress.geometry.location.lat();
	                var longitude = firstAddress.geometry.location.lng();
	                var marker = create(latitude, longitude);
	                invokeSuccessCallback(successCallback, marker);
	            } else {
	                swal.warning("Unknown address", address);
	            }
	        });
    	}

		return global;
});