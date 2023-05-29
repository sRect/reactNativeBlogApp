package com.blogapp;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;
// import com.amazonaws.retry.HeadlessJsRetryPolicy;
// import com.amazonaws.retry.LinearCountingRetryPolicy;

public class MyHeadlessJsTaskService extends HeadlessJsTaskService {

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    // HeadlessJsRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
    //   3, // Max number of retry attempts
    //   1000 // Delay between each retry attempt
    // );
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "backgroundPlayMusic",
          Arguments.fromBundle(extras),
          5000, // 任务的超时时间
          false // 可选参数：是否允许任务在前台运行，默认为false
        );
    }
    return null;
  }
}