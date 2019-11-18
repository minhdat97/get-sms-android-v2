package com.getsmsandroidv3;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class GetMessageEventService extends HeadlessJsTaskService {

    private static final String TASK_NAME = "GetMessage";

    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        Log.d("getTaskConfig", "extras " + extras);
        WritableMap data = extras != null ? Arguments.fromBundle(extras) : null;
        Log.d("getTaskConfig", "data " + data);
        return new HeadlessJsTaskConfig(
                TASK_NAME,
                data,
                5000,
                true);
    }
}