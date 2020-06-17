package com.getsmsandroidv3;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

public class GetNotificationService extends NotificationListenerService {
    private NotificationReceiver getMessagerReceive;
    public static final String ACTION_STATUS_BROADCAST = "com.getsmsandroidv3.GetNotificationService";

    @Override
    public void onCreate() {
        super.onCreate();
        getMessagerReceive = new NotificationReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("com.getsmsandroidv3.NOTIFICATION_LISTENER_SERVICE");
        registerReceiver(getMessagerReceive, filter);
        Log.i("NLService", "NLService created!");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(getMessagerReceive);
        Log.i("NLService", "NLService destroyed!");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        //retrieving data from the received intent
        if (intent.hasExtra("command")) {
            Log.i("NLService", "Started for command '" + intent.getStringExtra("command"));
//            broadcastStatus();
        } else if (intent.hasExtra("id")) {
            int id = intent.getIntExtra("id", 0);
            String message = intent.getStringExtra("msg");
            Log.i("NLService", "Requested to start explicitly - id : " + id + " message : " + message);
        }
        super.onStartCommand(intent, flags, startId);
        // NOTE: We return STICKY to prevent the automatic service termination
        return START_STICKY;
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        Notification mNotification = sbn.getNotification();

        if (mNotification != null) {
            Bundle extras = mNotification.extras;
            Log.d("mNotification", extras.toString());
            Context context = getApplicationContext();
            Intent intent = new Intent("com.getsmsandroidv3.NOTIFICATION_LISTENER_SERVICE");
            intent.putExtras(extras);
            sendBroadcast(intent);

//            Notification.Action[] mActions=mNotification.actions;
//            if (mActions!=null){
//                for (Notification.Action mAction:mActions){
//                    int icon=mAction.icon;
//                    CharSequence actionTitle=mAction.title;
//                    PendingIntent pendingIntent=mAction.actionIntent;
//                }
//            }
        }
    }

    class NotificationReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Intent myIntent = new Intent(context, GetMessageEventService.class);

            Bundle bundle = intent.getExtras();
            Log.d("notification_event", intent.getExtras().toString());
            String notificationTitle = bundle.getString(Notification.EXTRA_TITLE);
            CharSequence notificationText = bundle.getCharSequence(Notification.EXTRA_TEXT);
            CharSequence notificationSubText = bundle.getCharSequence(Notification.EXTRA_SUB_TEXT);
            Log.d("notification_event_title", notificationTitle);
            Log.d("notification_event_text", notificationText.toString());

            myIntent.putExtra("isNotification", true);
            myIntent.putExtra("title", notificationTitle);
            myIntent.putExtra("text", notificationText.toString());

            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {

    }
}