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
//  private ImageChangeBroadcastReceiver imageChangeBroadcastReceiver;
//  private ImageChangeBroadcastReceiver getMessageReceiver;

  public static String INTENT_ACTION_NOTIFICATION = "com.getsmsandroidv3.notification";
  private AlertDialog enableNotificationListenerAlertDialog;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    Intent intent = new Intent(getApplicationContext(), GetNotificationService.class);
    Context context = getApplicationContext();

    intent.putExtra("id", 101);
    intent.putExtra("msg", "hi");
    context.startService(intent);
    HeadlessJsTaskService.acquireWakeLockNow(context);

    super.onCreate(savedInstanceState);
//    setContentView(R.layout.activity_main);

    // Here we get a reference to the image we will modify when a notification is received
    // If the user did not turn the notification listener service on we prompt him to do so
    if(!isNotificationServiceEnabled()){
      enableNotificationListenerAlertDialog = buildNotificationServiceAlertDialog();
      enableNotificationListenerAlertDialog.show();
    }

    // Finally we register a receiver to tell the MainActivity when a notification has been received
//    getMessageReceiver = new ImageChangeBroadcastReceiver();
//    IntentFilter intentFilter = new IntentFilter();
//    intentFilter.addAction("com.getsmsandroidv3");
//    registerReceiver(getMessageReceiver, intentFilter);
  }

  @Override
  protected void onStart() {
    super.onStart();
    // register broadcast receiver for the intent MyTaskStatus
    LocalBroadcastManager.getInstance(this).registerReceiver(MyReceiver, new IntentFilter(GetNotificationService.ACTION_STATUS_BROADCAST));
  }

  @Override
  protected void onStop() {
    super.onStop();
    LocalBroadcastManager.getInstance(this).unregisterReceiver(MyReceiver);
  }

  //Defining broadcast receiver
  private BroadcastReceiver MyReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      Log.i("MainActivity", "Broadcast Recieved: "+intent.getStringExtra("serviceMessage"));
      String message = intent.getStringExtra("serviceMessage");
      Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
    }
  };

  /**
   * Is Notification Service Enabled.
   * Verifies if the notification listener service is enabled.
   * Got it from: https://github.com/kpbird/NotificationListenerService-Example/blob/master/NLSExample/src/main/java/com/kpbird/nlsexample/NLService.java
   * @return True if enabled, false otherwise.
   */
  private boolean isNotificationServiceEnabled(){
    return NotificationManagerCompat.getEnabledListenerPackages(this).contains(getPackageName());
  }

//  @Override
//  protected void onDestroy() {
//    super.onDestroy();
//    unregisterReceiver(getMessageReceiver);
//  }

  /**
   * Image Change Broadcast Receiver.
   * We use this Broadcast Receiver to notify the Main Activity when
   * a new notification has arrived, so it can properly change the
   * notification image
   * */
//  public class ImageChangeBroadcastReceiver extends BroadcastReceiver {
//    @Override
//    public void onReceive(Context context, Intent intent) {
////      int receivedNotificationCode = intent.getIntExtra("Notification Code",-1);
////      changeInterceptedNotificationImage(receivedNotificationCode);
//      Log.d("Intent", intent.toString());
//    }
//  }

  /**
   * Build Notification Listener Alert Dialog.
   * Builds the alert dialog that pops up if the user has not turned
   * the Notification Listener Service on yet.
   * @return An alert dialog which leads to the notification enabling screen
   */
  private AlertDialog buildNotificationServiceAlertDialog(){
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
    return(alertDialogBuilder.create());
  }

  @Override
  protected String getMainComponentName() {
    return "GetSMSAndroidv3";
  }
}
