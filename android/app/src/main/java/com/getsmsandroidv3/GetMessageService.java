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
    private String nameIsReady, valueIsReady;
    private String nameSender, valueSender;
    private String nameContent, valueContent;
    private String nameTime, valueTime;
    private String nameAction, valueAction;


    private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();
            Intent myIntent = new Intent(context, GetMessageEventService.class);
            myIntent.putExtra(getNameAction(), getValueAction());
            myIntent.putExtra(getNameIsReady(), getValueIsReady());
            myIntent.putExtra(getNameSender(), getValueSender());
            myIntent.putExtra(getNameContent(), getValueContent());
            myIntent.putExtra(getNameTime(), getValueTime());

            // if (extra ==)
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            // handler.postDelayed(this, 12000);
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
        return nameIsReady;
    }

    public void setNameIsReady(String globalVariable) {
        this.nameIsReady = globalVariable;
    }

    public String getValueIsReady() {
        return valueIsReady;
    }

    public void setValueIsReady(String globalVariable) {
        this.valueIsReady = globalVariable;
    }


    //

    public String getNameAction() {
        return nameAction;
    }

    public void setNameAction(String globalVariable) {
        this.nameAction = globalVariable;
    }

    public String getValueAction() {
        return valueAction;
    }

    public void setValueAction(String globalVariable) {
        this.valueAction = globalVariable;
    }

    //sender
    public String getNameSender() {
        return nameSender;
    }

    public void setNameSender(String globalVariable) {
        this.nameSender = globalVariable;
    }

    public String getValueSender() {
        return valueSender;
    }

    public void setValueSender(String globalVariable) {
        this.valueSender = globalVariable;
    }

    //Content
    public String getNameContent() {
        return nameContent;
    }

    public void setNameContent(String globalVariable) {
        this.nameContent = globalVariable;
    }

    public String getValueContent() {
        return valueContent;
    }

    public void setValueContent(String globalVariable) {
        this.valueContent = globalVariable;
    }


    // Time
    public String getNameTime() {
        return nameTime;
    }

    public void setNameTime(String globalVariable) {
        this.nameTime = globalVariable;
    }

    public String getValueTime() {
        return valueTime;
    }

    public void setValueTime(String globalVariable) {
        this.valueTime = globalVariable;
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
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Bundle extras = intent.getExtras();

        // String action = extras.getString("action");
        String isReady = extras.getString("isReady");
        String sender = extras.getString("sender");
        String content = extras.getString("content");
        String time = extras.getString("time");


        if (sender != null & content != null && time != null) {
            Log.d("onStartCommand", "info here");
            setNameSender("sender");
            setValueSender(sender);

            setNameContent("content");
            setValueContent(content);

            setNameTime("time");
            setValueTime(time);

            setNameAction("action");
            setValueAction("new_message");

        }
        // if (action != null) {
        //     if(action.equals("new_message")) {
        //         setNameAction("action");
        //         setValueAction("new_message");
        //     }
        // }
        if (isReady != null) {
            if(isReady.equals("true")) {
                setNameIsReady("isReady");
                setValueIsReady("true");
            }
        }
        // Log.d("onStartCommand", "isReady: " + isReady);
        // Log.d("onStartCommand", "content: " + content);
        // Log.d("onStartCommand", "sender: " + sender);
        // Log.d("onStartCommand", "time: " + time);



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
