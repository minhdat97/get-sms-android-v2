package com.getsmsandroidv3;

import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationManagerCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    private static final String ENABLED_NOTIFICATION_LISTENERS = "enabled_notification_listeners";
    private static final String ACTION_NOTIFICATION_LISTENER_SETTINGS = "android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS";
    private AlertDialog enableNotificationListenerAlertDialog;
    private GetNotificationService.NotificationReceiver mReceiver = new GetNotificationService.NotificationReceiver();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Here we get a reference to the image we will modify when a notification is received
        // If the user did not turn the notification listener service on we prompt him to do so
        if (!isNotificationServiceEnabled()) {
            enableNotificationListenerAlertDialog = buildNotificationServiceAlertDialog();
            enableNotificationListenerAlertDialog.show();
        }
        Intent intent = new Intent(getApplicationContext(), GetNotificationService.class);
        Bundle dataIntent = new Bundle();
        Context context = getApplicationContext();

        dataIntent.putInt("id", 101);
        dataIntent.putString("msg", "hi");

        intent.putExtras(dataIntent);
        sendBroadcast(intent);
//        context.startService(intent);
//        HeadlessJsTaskService.acquireWakeLockNow(context);
    }

    //        @Override
//    protected void onStart() {
//        super.onStart();
//        // register broadcast receiver for the intent MyTaskStatus
//        LocalBroadcastManager.getInstance(this).registerReceiver(MyReceiver, new IntentFilter(GetNotificationService.ACTION_STATUS_BROADCAST));
//    }
//
//    @Override
//    protected void onStop() {
//        super.onStop();
//        LocalBroadcastManager.getInstance(this).unregisterReceiver(MyReceiver);
//    }
//    @Override
//    protected void onStart() {
//        super.onStart();
//        if (mReceiver == null) mReceiver = new GetNotificationService.NotificationReceiver();
//        registerReceiver(mReceiver, new IntentFilter(GetNotificationService.ACTION_STATUS_BROADCAST));
//    }
//
//    @Override
//    protected void onStop() {
//        super.onStop();
//        unregisterReceiver(mReceiver);
//    }

    /**
     * Is Notification Service Enabled.
     * Verifies if the notification listener service is enabled.
     * Got it from: https://github.com/kpbird/NotificationListenerService-Example/blob/master/NLSExample/src/main/java/com/kpbird/nlsexample/NLService.java
     *
     * @return True if enabled, false otherwise.
     */
    private boolean isNotificationServiceEnabled() {
        return NotificationManagerCompat.getEnabledListenerPackages(this).contains(getPackageName());
    }

    /**
     * Build Notification Listener Alert Dialog.
     * Builds the alert dialog that pops up if the user has not turned
     * the Notification Listener Service on yet.
     *
     * @return An alert dialog which leads to the notification enabling screen
     */
    private AlertDialog buildNotificationServiceAlertDialog() {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        alertDialogBuilder.setTitle(R.string.notification_listener_service);
        alertDialogBuilder.setMessage(R.string.notification_listener_service_explanation);
        alertDialogBuilder.setPositiveButton(R.string.yes,
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        startActivity(new Intent(ACTION_NOTIFICATION_LISTENER_SETTINGS));
                    }
                });
        alertDialogBuilder.setNegativeButton(R.string.no,
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // If you choose to not enable the notification listener
                        // the app. will not work as expected
                    }
                });
        return (alertDialogBuilder.create());
    }

    @Override
    protected String getMainComponentName() {
        return "GetSMSAndroidv3";
    }
}
