angular.module('itaxi.push', [])

.run(function (localStorageService) {
 
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
            alert(data.registrationId);
            localStorageService.set('pushtoken', data.registrationId);
           
        });

        push.on('error', function(e) {
            alert("push error = " + e.message);
        });

        //Eventos 
        push.on('notification', function(data) {
            alert('notification event' + data.message);
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
        });
	////////////////////////////
})