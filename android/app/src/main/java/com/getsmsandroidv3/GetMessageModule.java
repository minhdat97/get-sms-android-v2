package com.getsmsandroidv3;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class GetMessageModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "GetMessage";
    private static ReactApplicationContext reactContext;

    public GetMessageModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        Intent myIntent = new Intent(this.reactContext, GetMessageService.class);
        myIntent.putExtra("isReady", "true");
        this.reactContext.startService(myIntent);
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, GetMessageService.class));
    }
}
