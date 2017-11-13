 importScripts('https://www.gstatic.com/firebasejs/4.5.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/4.5.0/firebase-messaging.js');

 firebase.initializeApp({
   'messagingSenderId': '165900517247'
 });

 const messaging = firebase.messaging();
 const applicationKey = '3238:vvz7WQEc3UPHmb7gf9CzHMlbJny261Ee';

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  return showNotification(payload);
});

function showNotification(payload)
{
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

  if(payload.data.OFSYSReceptionID)
  {
     var data = {
      "ApplicationId": applicationKey,
      "PushId": payload.data.OFSYSReceptionID,
      "dtReception": new Date()
    };

    corsAjax({
      "url" : 'https://lightspeed.dev.osfys.com/webservices/ofc4/mobile.ashx?method=Mobile_TrackPushReception', 
      "data" : JSON.stringify(data), 
      "success" : function(responseText)
      {
      }, 
      "error" : function(status, responseText)
      {
      }
    });
  }

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
}

  function corsAjax(options)
  {
    try
    {
      var ajaxRequest = new XMLHttpRequest();
      var gotStdCors = ('withCredentials' in ajaxRequest);
      var gotXDomain = (window.XDomainRequest != null);
    
      if (gotXDomain && !gotStdCors)
      {
        // IE 8 et 9 n'implémentent pas le standard, mais ont l'extension XDomainRequest qui fait un peu la même chose 
        var xdr = new XDomainRequest();
        xdr.open("POST", options.url);
        //xdr.onprogress = function () { };
        xdr.ontimeout = function () { options.error(408, 'timeout'); };
        xdr.onerror = function () { options.error(500, 'error'); };
        xdr.onload = function() { options.success(xdr.responseText); }
        setTimeout(function () { xdr.send(options.data); }, 0);
      }
      else
      {
        ajaxRequest.open('POST', options.url, true);
        ajaxRequest.setRequestHeader("Content-type", "text/plain");
        ajaxRequest.onreadystatechange = function()
        {
          //console.log('onreadystatechange',ajaxRequest.readyState);
          if (ajaxRequest.readyState == 4 /* complete */)
          {
            if (ajaxRequest.status == 200)
              options.success(ajaxRequest.responseText);
            else
              options.error(ajaxRequest.status, ajaxRequest.responseText);
          }
        };
        ajaxRequest.send(options.data); 
      }
    }
    catch (e)
    {
      options.error(500, 'exception ' + e);
      if (window.console)
        console.error(e);
    }
  }


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

self.addEventListener('message', function (evt) {
  console.log('postMessage received', evt.data);
  if(typeof evt.data.showNotification !== 'undefined')
  {
    showNotification(evt.data.showNotification);
  }
})