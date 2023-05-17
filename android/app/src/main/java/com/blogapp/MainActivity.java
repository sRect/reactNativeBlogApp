package com.blogapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

// import android.os.Bundle;
import android.content.Intent;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContext;
import com.facebook.react.ReactInstanceManager;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "blogApp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }

  public void addListener(String eventName) {
    // Set up any upstream listeners or background tasks as necessary
  }

  public void removeListeners(Integer count) {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //   super.onCreate(savedInstanceState);
    
  //    // 监听onNewIntent事件
  //   Intent intent = getIntent();
  //   String data = intent.getStringExtra("pageToJumpKey");

  //   if(data != null) {
  //     WritableMap params = Arguments.createMap();
  //     params.putString("eventProperty", data);

  //     ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
  //     ReactApplicationContext context= (ReactApplicationContext) mReactInstanceManager.getCurrentReactContext();

  //     context
  //             .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
  //             .emit("onNotificationClick", params);
  //   }
  // }

  @Override
  public void onNewIntent(Intent intent) {
    // 监听onNewIntent事件
    super.onNewIntent(intent);
    
    String data = intent.getStringExtra("pageToJumpKey");

    if(data != null) {
      WritableMap params = Arguments.createMap();
      params.putString("pageToJumpKey", data);

      ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
      ReactApplicationContext context= (ReactApplicationContext) mReactInstanceManager.getCurrentReactContext();

      context
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("pageToJumpKey", params);
    }
  }
}
