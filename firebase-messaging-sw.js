 importScripts('https://www.gstatic.com/firebasejs/4.5.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/4.5.0/firebase-messaging.js');

 firebase.initializeApp({
   'messagingSenderId': '165900517247'
 });

 const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  var notificationTitle = payload.data.Title || 'Notification';
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
    if(payload.data.Action1_URL)
      notificationOptions.data['action0_url'] = payload.data.Action1_URL;
  }
  if(payload.data.Action2_Title)
  {
    if(!notificationOptions.data)
      notificationOptions.data = {};
    if(!notificationOptions.actions)
      notificationOptions.actions = [];
    var action2 = { action : 1, title : payload.data.Action2_Title };
    if(payload.data.Action2_Icon)
      action2['icon'] = payload.data.Action2_Icon;
    notificationOptions.actions.push(action2);
    if(payload.data.Action2_URL)
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