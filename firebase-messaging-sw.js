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

  if(payload.data.body)
    notificationOptions.body = payload.data.body;
  if(payload.data.title)
    notificationOptions.title = payload.data.title;
  if(payload.data.click_action)
  {
    notificationOptions.data = {url : payload.data.click_action};
  }
  if(payload.data.icon)
    notificationOptions.icon = payload.data.icon;
  if(payload.data.image)
    notificationOptions.image = payload.data.image;

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log(event);
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
// [END background_handler]
