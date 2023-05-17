package com.blogapp;

import android.os.Build;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Promise;

// import com.facebook.react.modules.core.DeviceEventManagerModule;
// import com.facebook.react.bridge.ReadableMap;
// import com.facebook.react.bridge.WritableMap;
// import com.facebook.react.bridge.Arguments;
// import javax.annotation.Nullable;


import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.app.PendingIntent;


public class MyNotificationModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private static final String CHANNEL_ID = "notification_channel";
  private static final String CHANNEL_NAME = "notification_channel_name";

  private Class getActivityClass(String activityName) {
    try {
      if (activityName.equals("PageToJumpTo")) {
        // return Class.forName("com.blogapp.PageToJumpToActivity");
        return Class.forName("com.blogapp.MainActivity");
      }
    } catch (ClassNotFoundException e) {
      e.printStackTrace(); 
    }
    return null;
  } 

  public MyNotificationModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "MyNotificationManager";
  }

  @ReactMethod
  public void show(int contextId, String title, String content, String activityName, String routePath) {
    // https://juejin.cn/post/7195496297151381565
    // https://blog.csdn.net/canghieever/article/details/125430116

    // 创建一个NotificationManager对通知进行管理
    NotificationManager mNotificationManager = (NotificationManager) reactContext.getSystemService(ReactContext.NOTIFICATION_SERVICE);
    Notification notification = null;

    Intent intent = new Intent(reactContext, getActivityClass(activityName));
    // Intent intent = new Intent(reactContext, PageToJumpToActivity.class);
    // intent可以携带参数到指定页面
    // intent.putExtra("pageToJumpKey", Arguments.toBundle(data));
    intent.putExtra("pageToJumpKey", routePath);
    // intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    // https://blog.csdn.net/yubo_725/article/details/124413000
    // Targeting S+ (version 31 and above) requires that one of FLAG_IMMUTABLE or FLAG_MUTABLE be specified
    PendingIntent pendingIntent;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      // https://blog.csdn.net/zhangxiweicaochen/article/details/14002469
      // PendingIntent.getActivity(context,id, intent,PendingIntent.FLAG_UPDATE_CURRENT);
      // 上面id，一定要唯一，不然Intent就是接受到的重复！
      pendingIntent = PendingIntent.getActivity(reactContext, contextId, intent, PendingIntent.FLAG_IMMUTABLE);
    } else {
      pendingIntent = PendingIntent.getActivity(reactContext, contextId, intent, PendingIntent.FLAG_UPDATE_CURRENT);
    }

    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      // 安卓8.0之后
      // 创建channel
      // 参数：channel ID(ID可以随便定义，但保证全局唯一性)，channel 名称，重要等级
      NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
      mNotificationManager.createNotificationChannel(channel);

      notification = new Notification.Builder(reactContext, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(content)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setAutoCancel(true) // 当点击通知后显示栏的通知不再显示
                .setContentIntent(pendingIntent) // 点击跳到通知详情
                .build();
    } else {
      notification = new Notification.Builder(reactContext)
                .setContentTitle(title)
                .setContentText(content)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .build();
    }

    // notify(int id,Notification notification)
    // 第一个参数id可以随便填，第二个参数就是我们要发送的通知
    mNotificationManager.notify(100, notification);
  }
}

