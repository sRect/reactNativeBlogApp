package com.blogapp;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
import com.facebook.react.jstasks.LinearCountingRetryPolicy;

import javax.annotation.Nullable;

public class BackgroundPositionServices extends HeadlessJsTaskService {

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    WritableMap data = extras != null ? Arguments.fromBundle(extras) : Arguments.createMap();
    // https://github.com/eduardomota/smsgate/blob/803f775ae419db2aea63aeac5def15eb0ec28542/smsrelay2/android/app/src/main/java/com/smsrelay2/SmsEventService.java
    LinearCountingRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
      3, // Max number of retry attempts
      1000 // Delay between each retry attempt
    );

    // if (extras != null) {
    //   return new HeadlessJsTaskConfig(
    //       "BackgroundTask",
    //       Arguments.fromBundle(extras),
    //       5000, // 任务的超时时间
    //       false // 可选参数：是否允许任务在前台运行，默认为false
    //     );
    // }

    return new HeadlessJsTaskConfig(
      "BackgroundPosition",
      data,
      10000, // 任务的超时时间
      false, // 可选参数：是否允许任务在前台运行，默认为false
      retryPolicy
    );
  }
}