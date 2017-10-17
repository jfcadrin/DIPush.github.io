// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
/*importScripts('/__/firebase/3.9.0/firebase-app.js');
importScripts('/__/firebase/3.9.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();
*/
/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
**/
 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/4.5.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/4.5.0/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': '165900517247'
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.data.title || 'Notification';
  var notificationOptions = {
  };

  if(payload.data.Body)
    notificationOptions.body = payload.data.Body;
  if(payload.data.Title)
    notificationOptions.title = payload.data.Title;
  if(payload.data.URLRedirection)
  {
    if(!notificationOptions.data)
      notificationOptions.data = {};
    notificationOptions.data['url'] = payload.data.URLRedirection;
  }
  if(payload.data.Icon)
    notificationOptions.icon = payload.data.Icon;
  if(payload.data.Image)
    notificationOptions.image = payload.data.Image;
  if(payload.data.Direction)
    notificationOptions.direction = payload.data.Direction;
  if(payload.data.Sound)
  {
    notificationOptions.silent = false;
    notificationOptions.sound = payload.data.Sound;
  }
  if(payload.data.Action1_Title)
  {
    if(!notificationOptions.data)
      notificationOptions.data = {};
    notificationOptions.actions = [];
    var action1 = { action : 0, title : payload.data.Action1_Title };
    if(payload.data.Action1_Icon)
      action1['icon'] = payload.data.Action1_Icon;
    notificationOptions.actions.push(action1);
    notificationOptions.data['action0_url'] = payload.data.Action1_URL;
  }
  if(payload.data.Action2_Title)
  {
    if(!notificationOptions.data)
      notificationOptions.data = {};
    notificationOptions.actions = [];
    var action2 = { action : 1, title : payload.data.Action2_Title };
    if(payload.data.Action2_Icon)
      action1['icon'] = payload.data.Action2_Icon;
    notificationOptions.actions.push(action2);
    notificationOptions.data['action1_url'] = payload.data.Action2_URL;
  }

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log(event);

  var url = event.notification.data.url;
  if(event.action != null && event.action != '')
  {
    url = event.notification.data['action' + event.action + '_url'];
  }

  event.notification.close();
  event.waitUntil(
    clients.openWindow(url)
  );
});
// [END background_handler]
