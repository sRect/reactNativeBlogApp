package com.blogapp;

import com.facebook.react.ReactActivity;
// import com.facebook.react.ReactRootView;
// import com.facebook.react.ReactInstanceManager;

// import android.os.Bundle;
// import android.content.Intent;
// import java.util.HashMap;

public class PageToJumpToActivity extends ReactActivity {
  // private ReactRootView mReactRootView;

  @Override
  protected String getMainComponentName() {
    return "PageToJumpTo";  // 返回要跳转的页面名
  }

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //   super.onCreate(savedInstanceState);
    
  //   Intent intent = getIntent();
  //   String pageToJumpKey = intent.getStringExtra("pageToJumpKey");
    
  //   HashMap<String, Object> props = new HashMap<>();
  //   props.put("pageToJumpKey", pageToJumpKey);
    
  //   // ReactInstanceManager manager = ReactInstanceManager.builder()
  //   //   .setCurrentActivity(this)
  //   //   .setBundleAssetName("index.android.bundle") 
  //   //   .addInitialProps(props)
  //   //   .build();
      
  //   // mReactRootView.startReactApplication(manager, "PageToJumpTo");
  // }

  // @Override
  // protected void onDestroy() {
  //   super.onDestroy();
    
  //   mReactRootView.unmountReactApplication();
  // }
}