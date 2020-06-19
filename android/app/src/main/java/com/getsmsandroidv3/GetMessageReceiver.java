package com.getsmsandroidv3;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.HeadlessJsTaskService;

import java.util.ArrayList;
import java.util.List;

public class GetMessageReceiver extends BroadcastReceiver {
    private static final String TAG = GetMessageReceiver.class.getSimpleName();
    public static final String pdu_type = "pdus";

    @TargetApi(Build.VERSION_CODES.M)
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("Intent", intent.getExtras().toString());

        boolean hasInternet = isNetworkAvailable(context);
        Intent messIntent = new Intent(context, GetMessageService.class);
        Intent notificationIntent = new Intent(context, GetNotificationService.class);
        Log.d("Notification", notificationIntent.toString());
        // Log.d("Mess", messIntent.toString());

        Bundle bundle = intent.getExtras();
        Bundle extras = new Bundle();
        SmsMessage[] msgs;
        String strMessage = "";
        String content = "";
        String sender = "";
        String time = "";
        String format = bundle.getString("format");
        // Retrieve the SMS message received.
        Object[] pdus = (Object[]) bundle.get(pdu_type);
        if (pdus != null) {
            // Check the Android version.
            boolean isVersionM = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M);
            // Fill the msgs array.
            msgs = new SmsMessage[pdus.length];
            for (int i = 0; i < msgs.length; i++) {
                // Check Android version and use appropriate createFromPdu.
                if (isVersionM) {
                    // If Android version M or newer:
                    msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i], format);
                } else {
                    // If Android version L or older:
                    msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                }
                // Build the message to show.
                sender = msgs[i].getOriginatingAddress();
                content += msgs[i].getMessageBody();

                Long timeStamp = (msgs[i].getTimestampMillis());
                Log.d(TAG, "OnReceive Time: Timestamp " + timeStamp);
                Long timestamp = (timeStamp) / 1000;
                time = Long.toString(timestamp);
                // strMessage += "SMS from " + msgs[i].getOriginatingAddress();
                // strMessage += " :" + msgs[i].getMessageBody() + "\n";
                // Log and display the SMS message.
                Log.d(TAG, "onReceive: " + strMessage);
                Log.d(TAG, "onReceive Time: " + time);

                Toast.makeText(context, strMessage, Toast.LENGTH_LONG).show();
            }
            extras.putString("time", time);
            extras.putString("sender", sender);
            extras.putString("content", content);
            if (hasInternet) {
                messIntent.putExtras(extras);
                messIntent.putExtra("hasInternet", hasInternet);
            } else {
                try {
                    Log.d(TAG, "go here");
                    sendSMS(context, "+84909000200", content);
                    extras.putBoolean("failSend", false);
                    messIntent.putExtras(extras);
                    messIntent.putExtra("hasInternet", hasInternet);
                } catch (Exception e) {
                    Log.d(TAG, "go here1: " + e);
                    extras.putBoolean("failSend", true);
                    messIntent.putExtras(extras);
                    messIntent.putExtra("hasInternet", hasInternet);
                    Toast.makeText(context, "SMS Failed to Send, Please try again", Toast.LENGTH_SHORT).show();
                }
            }
        }

        context.startService(messIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }

    private void sendSMS(Context mContext, String phoneNumber, String message) {
        String SENT = "SMS_SENT";
        String DELIVERED = "SMS_DELIVERED";
        int MAX_SMS_MESSAGE_LENGTH = 160;

        PendingIntent sentPI = PendingIntent.getBroadcast(mContext, 0, new Intent(SENT), 0);

        PendingIntent deliveredPI = PendingIntent.getBroadcast(mContext, 0, new Intent(DELIVERED), 0);

        // ---when the SMS has been sent---
        mContext.getApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String state = "";
                switch (getResultCode()) {
                    case Activity.RESULT_OK:
                        /*
                         * ContentValues values = new ContentValues(); values.put("address",
                         * phoneNumber);// txtPhoneNo.getText().toString()); values.put("body",
                         * message); context.getContentResolver().insert(
                         * Uri.parse("content://sms/sent"), values);
                         */

                        state = "SMS sent successfully";
                        break;
                    case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                        state = "Generic failure cause";
                        break;
                    case SmsManager.RESULT_ERROR_NO_SERVICE:
                        state = "Service is currently unavailable";
                        break;
                    case SmsManager.RESULT_ERROR_NULL_PDU:
                        state = "No PDU provided";
                        break;
                    case SmsManager.RESULT_ERROR_RADIO_OFF:
                        state = "Radio was explicitly turned off";
                        break;
                }
                Log.d(TAG, "smssend: " + state);
                Toast.makeText(context, state, Toast.LENGTH_SHORT).show();
            }
        }, new IntentFilter(SENT));

        // ---when the SMS has been delivered---
        mContext.getApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String state = "";
                switch (getResultCode()) {
                    case Activity.RESULT_OK:
                        state = "SMS delivered";
                        break;
                    case Activity.RESULT_CANCELED:
                        state = "SMS not delivered";
                        break;
                }
                Log.d(TAG, "smsdelivery: " + state);
                Toast.makeText(context, state, Toast.LENGTH_SHORT).show();
            }
        }, new IntentFilter(DELIVERED));

        SmsManager sms = SmsManager.getDefault();
        int length = message.length();

        if (length > MAX_SMS_MESSAGE_LENGTH) {
            ArrayList<String> messagelist = sms.divideMessage(message);

            sms.sendMultipartTextMessage(phoneNumber, null, messagelist, null, null);
        } else {
            sms.sendTextMessage(phoneNumber, null, message, sentPI, deliveredPI);
        }
        // sms.sendTextMessage(phoneNumber, null, message, sentPI, deliveredPI);
    }

    private boolean isAppOnForeground(Context context) {
        /**
         * We need to check if app is in foreground otherwise the app will crash.
         * http://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         **/
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
                    && appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return (netInfo != null && netInfo.isConnected());
    }

}
