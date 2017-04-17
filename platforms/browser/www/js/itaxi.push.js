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
            
            /*
            if ($rootScope.drivers) {
                global.getUncashedTrip();    
            }        
            */
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
        });
	////////////////////////////
})