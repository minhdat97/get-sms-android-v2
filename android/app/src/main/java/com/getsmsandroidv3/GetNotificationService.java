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
    public static final String ACTION_STATUS_BROADCAST = "com.getsmsandroidv3.NOTIFICATION_LISTENER_SERVICE";

    @Override
    public void onCreate() {
        super.onCreate();
        getMessagerReceive = new NotificationReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_STATUS_BROADCAST);
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
        Bundle extras = intent.getExtras();
        Log.d("Intent111", intent.getExtras().toString());
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
        String packageName = sbn.getPackageName();
        Notification mNotification = sbn.getNotification();

        Log.d("packageName", packageName);

        if (mNotification != null) {
            Bundle extras = mNotification.extras;
            extras.putString("packageName", packageName);
            Log.d("mNotification", extras.toString());
            Intent intent = new Intent(ACTION_STATUS_BROADCAST);
            intent.putExtras(extras);
            sendBroadcast(intent);
        }
    }

    static class NotificationReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equalsIgnoreCase(ACTION_STATUS_BROADCAST)) {
                Log.d("INFO1111", intent.getExtras().toString());
                //finish(); // do here whatever you want
                Intent myIntent = new Intent(context, GetMessageEventService.class);

                Bundle bundle = intent.getExtras();

                Log.d("notification_event", intent.getExtras().toString());
                String notificationTitle = bundle.getString(Notification.EXTRA_TITLE);
                CharSequence notificationText = bundle.getCharSequence(Notification.EXTRA_TEXT);
                String notificationApplicationInfo = bundle.getString("packageName");

                Log.d("notification_event_title", notificationTitle);
                Log.d("notification_event_text", notificationText.toString());
                Log.d("notification_event_packageName", notificationApplicationInfo);

                if (notificationTitle != null && notificationText != null && notificationApplicationInfo != null) {
                    myIntent.putExtra("isNotification", true);
                    myIntent.putExtra("title", notificationTitle);
                    myIntent.putExtra("text", notificationText.toString());
                    myIntent.putExtra("packageName", notificationApplicationInfo);
                }
                context.startService(myIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
            }
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        super.onNotificationRemoved(sbn);

        Notification notification = sbn.getNotification();
        String notificationText = notification.extras.getString(Notification.EXTRA_TEXT);

        Log.d(getClass().getSimpleName(),
                String.format("Dismissed notification: %s", notificationText));
    }
}