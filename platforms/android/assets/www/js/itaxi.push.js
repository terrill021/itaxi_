angular.module('itaxi.push', [])

.run(function (localStorageService, global, $state) {
 
	//////////////////////////////////////
        var push = PushNotification.init({
            "android": {
                "senderID": "821347345466"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });.0

        push.on('registration', function(data) {
            localStorageService.set('pushtoken', data.registrationId);
           
        });

        push.on('error', function(e) {
            alert("push error = " + e.message);
        });

        //Eventos 
        push.on('notification', function(data) {       
            //Si es un conductor que le actualize la GUI 
            //para que le aparesca el viaje por cobrar.


            //si es cliente que le actuailize la GUI para 
            //que le apresca cobrado el viaje
            var callback = function(){
            if(localStorageService.get('sesion').balance == null){
                    global.getUncashedTrip();
                }else{
                    $state.go('newTrip')
                }
            };

            //Mostrar notificacion push en la pantalla
            navigator.notification.alert(
                data.message,         // message
                callback,             // callback
                data.title,           // title
                'Ok'                  // buttonName
            );

            
        });
	////////////////////////////
})