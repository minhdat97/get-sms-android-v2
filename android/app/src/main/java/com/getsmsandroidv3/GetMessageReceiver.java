package com.getsmsandroidv3;

import android.annotation.TargetApi;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.HeadlessJsTaskService;


public class GetMessageReceiver extends BroadcastReceiver {
    // private static final String TAG = "SMSBroadcastReceiver";
    private static final String TAG = GetMessageReceiver.class.getSimpleName();
    public static final String pdu_type = "pdus";

    @TargetApi(Build.VERSION_CODES.M)
    @Override
    public void onReceive(Context context, Intent intent) {
        // Intent messIntent = new Intent(context, GetMessageService.class);
        // if (intent.getAction().equals(SMS_RECEIVED))
        // {
        // messIntent.putExtra("action", "new_message");
        // }
        // else
        // {
        // messIntent.putExtra("action", "no_message");
        // }

        Intent messIntent = new Intent(context, GetMessageService.class);
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
                content = msgs[i].getMessageBody();

                //int calendarDate = calendar.get(CALENDAR.DATE);
                Long timeStamp = (msgs[i].getTimestampMillis());
                Log.d(TAG, "OnReceive Time: Timestamp " + timeStamp);
                Long timestamp = (timeStamp) / 1000;
                //Date gmt = new Date(timestamp);
                //Date date = new Date(gmt.getTime() - Calendar.getInstance().getTimeZone().getOffset(gmt.getTime()));
                //DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
                //time = dateFormat.format(date);

                //Date date = new Date(timestamp);
                //DateFormat gmtFormat = new SimpleDateFormat("dd MMM yyyy hh:mm:ss a");
                //TimeZone gmtTime = TimeZone.getTimeZone("UTC");
                //gmtFormat.setTimeZone(gmtTime);
                //time = gmtFormat.format(date);
                //Log.d(TAG, "Current Time: " + date);
                //Log.d(TAG, "GMT Time: " + gmtFormat.format(date));
                time = Long.toString(timestamp);
                strMessage += "SMS from " + msgs[i].getOriginatingAddress();
                strMessage += " :" + msgs[i].getMessageBody() + "\n";
                // Log and display the SMS message.
                Log.d(TAG, "onReceive: " + strMessage);
                Log.d(TAG, "onReceive Time: " + time);

                Toast.makeText(context, strMessage, Toast.LENGTH_LONG).show();
            }
            extras.putString("time", time);
            // extras.putString("action", "true");
            extras.putString("sender", sender);
            extras.putString("content", content);
            // messIntent.putExtra("time", time);
            // messIntent.putExtra("sender", sender);
            // messIntent.putExtra("content", content);
            messIntent.putExtras(extras);
        }

        context.startService(messIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}
