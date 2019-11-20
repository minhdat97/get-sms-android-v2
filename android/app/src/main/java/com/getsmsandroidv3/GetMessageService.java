package com.getsmsandroidv3;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;


public class GetMessageService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "GETMESSAGE";
    private String name;
    private String value;


    private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();
            Log.d("service", "context: " + context);
            Intent myIntent = new Intent(context, GetMessageEventService.class);
            myIntent.putExtra(getName(), getValue());
            // myIntent.putExtra(getNameSender(), getValueSender());
            // myIntent.putExtra(getNameContent(), getValueContent());
            // myIntent.putExtra(getNameTime(), getValueTime());

            

            Log.d("myIntent", "intent: " + myIntent);
            Log.i("SMSBroadcastReceiver", "Intent recieved: " + myIntent.getAction());
            // if (extra ==)
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            //handler.postDelayed(this, 2000);
        }
    };

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "GETMESSAGE", importance);
            channel.setDescription("CHANEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public String getNameIsReady() {
        return name;
    }

    public void setNameIsReady(String globalVariable) {
        this.name = globalVariable;
    }

    public String getValueIsReady() {
        return value;
    }

    public void setValueIsReady(String globalVariable) {
        this.value = globalVariable;
    }


    // action
    public String getNameAction() {
        return name;
    }

    public void setNameAction(String globalVariable) {
        this.name = globalVariable;
    }

    public String getValueAction() {
        return value;
    }

    public void setValueAction(String globalVariable) {
        this.value = globalVariable;
    }

    // get
    public String getName() {
        return name;
    }

    public void setName(String globalVariable) {
        this.name = globalVariable;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String globalVariable) {
        this.value = globalVariable;
    }

    // sender
    public String getNameSender() {
        return name;
    }

    public void setNameSender(String globalVariable) {
        this.name = globalVariable;
    }

    public String getValueSender() {
        return value;
    }

    public void setValueSender(String globalVariable) {
        this.value = globalVariable;
    }

    //Content
    public String getNameContent() {
        return name;
    }

    public void setNameContent(String globalVariable) {
        this.name = globalVariable;
    }

    public String getValueContent() {
        return value;
    }

    public void setValueContent(String globalVariable) {
        this.value = globalVariable;
    }


    // Time
    public String getNameTime() {
        return name;
    }

    public void setNameTime(String globalVariable) {
        this.name = globalVariable;
    }

    public String getValueTime() {
        return value;
    }

    public void setValueTime(String globalVariable) {
        this.value = globalVariable;
    }


    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public void onDestroy() {
        Log.d("Destroy", "here");
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Bundle extras = intent.getExtras();

        String action = extras.getString("action");
        String isReady = extras.getString("isReady");
        String sender = extras.getString("sender");
        String content = extras.getString("content");
        String time = extras.getString("time");

        if (sender != null && content != null && time != null) {
            Log.d("onStartCommand", "info here");
            setNameSender("sender");
            setValueSender(sender);

            setNameContent("content");
            setValueContent(content);

            setNameTime("time");
            setValueTime(time);

        }

        if (action != null) {
            if(action.equals("new_message")) {
                Log.d("onStartCommand", "isReady here");
                setName("action");
                setValue("new_message");
            }
        }
        if (isReady != null) {
            if(isReady.equals("true")) {
                Log.d("onStartCommand", "isReady here");
                setName("isReady");
                setValue("true");
            }
        }
        Log.d("onStartCommand", "isReady: " + isReady);
        Log.d("onStartCommand", "action: " + action);

        this.handler.post(this.runnableCode);
        createNotificationChannel();
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent,
                PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("GetMessage service").setContentText("Running...").setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent).setOngoing(true).build();
        startForeground(SERVICE_NOTIFICATION_ID, notification);

        return START_STICKY;
    }

}
