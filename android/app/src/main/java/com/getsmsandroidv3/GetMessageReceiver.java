package com.getsmsandroidv3;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

public class GetMessageReceiver extends BroadcastReceiver {
    private static final String SMS_RECEIVED = "android.provider.Telephony.SMS_RECEIVED";
    private static final String TAG = "SMSBroadcastReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "Intent recieved: " + intent.getAction());
        Intent messIntent = new Intent(context, GetMessageService.class);
        Log.i(TAG, "Intent recieved: " + intent.getAction());
        Log.d(intent.getAction(), "intent");
        if (intent.getAction().equals(SMS_RECEIVED))
        {
            Log.d(TAG, "here");
            messIntent.putExtra("action", "new_message");
        }
        else
        {
            messIntent.putExtra("action", "no_message");
        }
        context.startService(messIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}
