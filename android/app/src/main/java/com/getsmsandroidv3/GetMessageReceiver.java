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
    private static final String SMS_RECEIVED = "android.provider.Telephony.SMS_RECEIVED";
    //private static final String TAG = "SMSBroadcastReceiver";
    private static final String TAG = GetMessageReceiver.class.getSimpleName();
    public static final String pdu_type = "pdus";

    @TargetApi(Build.VERSION_CODES.M)
    @Override
    public void onReceive(Context context, Intent intent) {
        Intent messIntent = new Intent(context, GetMessageService.class);
        if (intent.getAction().equals(SMS_RECEIVED))
        {
            messIntent.putExtra("action", "new_message");
        }
       else
        {
            messIntent.putExtra("action", "no_message");
        }

        // Intent messIntent = new Intent(context, GetMessageService.class);
        // Bundle bundle = intent.getExtras();
        // Bundle extras = new Bundle();
        // SmsMessage[] msgs;
        // String strMessage = "";
        // String content = "";
        // String sender= "";
        // String time = "";
        // String format = bundle.getString("format");
        // // Retrieve the SMS message received.
        // Object[] pdus = (Object[]) bundle.get(pdu_type);
        // if (pdus != null) {
        //     // Check the Android version.
        //     boolean isVersionM = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M);
        //     // Fill the msgs array.
        //     msgs = new SmsMessage[pdus.length];
        //     for (int i = 0; i < msgs.length; i++) {
        //         // Check Android version and use appropriate createFromPdu.
        //         if (isVersionM) {
        //             // If Android version M or newer:
        //             msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i], format);
        //         } else {
        //             // If Android version L or older:
        //             msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
        //         }
        //         // Build the message to show.
        //         sender = msgs[i].getOriginatingAddress();
        //         content = msgs[i].getMessageBody();
        //         long timstamp= msgs[i].getTimestampMillis();
        //         time = Long.toString(timstamp);
        //         strMessage += "SMS from " + msgs[i].getOriginatingAddress();
        //         strMessage += " :" + msgs[i].getMessageBody() + "\n";
        //         // Log and display the SMS message.
        //         Log.d(TAG, "onReceive: " + strMessage);
        //         Toast.makeText(context, strMessage, Toast.LENGTH_LONG).show();
        //     }
        //     extras.putString("time", time);
        //     extras.putString("sender", sender);
        //     extras.putString("content", content);
        //     // messIntent.putExtra("time", time);
        //     // messIntent.putExtra("sender", sender);
        //     // messIntent.putExtra("content", content);
        //     messIntent.putExtras(extras);
        // }

        context.startService(messIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}
