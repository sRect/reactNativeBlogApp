package com.blogapp;

import androidx.annotation.NonNull;
import androidx.work.Worker; 
import androidx.work.WorkerParameters;

import android.os.Bundle;
import android.content.Intent;
import android.content.Context;

// import android.location.Location;  
// import android.location.LocationListener;  
// import android.location.LocationManager;

// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContext;
// import com.facebook.react.bridge.WritableMap;
// import com.facebook.react.bridge.Arguments;
// import com.facebook.react.modules.core.DeviceEventManagerModule;

// import java.util.Timer;
// import java.util.TimerTask;
// import javax.annotation.Nullable;

public class BackgroundPositionWorker extends Worker {
    // private static ReactApplicationContext reactContext;
    // private LocationManager locationManager; 
    // private LocationListener locationListener; 
    // private Timer timer = null;//计时器
    // private TimerTask task = null;

    public BackgroundPositionWorker(
        @NonNull Context context, 
        @NonNull WorkerParameters workerParams) {

        super(context, workerParams);
        // reactContext = context;
    }

    // private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    //   reactContext
    //       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
    //       .emit(eventName, params);
    // }

    // public void addListener(String eventName) {
    //   // Set up any upstream listeners or background tasks as necessary
    // }

    // public void removeListeners(Integer count) {
    //   // Remove upstream listeners, stop unnecessary background tasks
    // }

    // public void backgroundGetPosition() {
    //   locationManager = (LocationManager) reactContext.getSystemService(ReactContext.LOCATION_SERVICE); 
    //   locationListener = new LocationListener() {
        
    //     @Override 
    //     public void onLocationChanged(Location location) { 
    //       // 在这里获取到定位信息，并进行相应的处理 
    //       double latitude = location.getLatitude(); 
    //       double longitude = location.getLongitude(); 

    //       if(timer!=null) {
    //         timer.cancel();
    //         timer=null;
    //       }

    //       timer = new Timer();
    //       task = new TimerTask() {
    //         @Override
    //         public void run() {
    //             try {
    //               WritableMap params = Arguments.createMap();
    //               params.putString("location:", "latitude:"+latitude+",longitude:"+ longitude);
    //               sendEvent(reactContext, "backgroundPostion", params);
    //             } catch (Exception e) {
    //                 e.printStackTrace();
    //             }
    //         }

    //       };
    //       //1000ms执行一次
    //       timer.schedule(task, 1000, 2000);
    //     }
        
    //     @Override 
    //     public void onStatusChanged(String provider, int status, Bundle extras) { } 
        
    //     @Override 
    //     public void onProviderEnabled(String provider) { } 
        
    //     @Override 
    //     public void onProviderDisabled(String provider) { } 
    //   };

    //   // 注册位置监听器 
    //   locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, locationListener);
    //   Location lastKnownLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

    //   WritableMap params2 = Arguments.createMap();
    //   if(lastKnownLocation != null) {
    //     params2.putString("location:", "latitude:"+lastKnownLocation.getLatitude()+",longitude:"+ lastKnownLocation.getLongitude());
    //   } else {
    //     params2.putString("location:", "null");
    //   }
      
    //   sendEvent(reactContext, "backgroundTask", params2);
    // }

    @NonNull
    @Override
    public Result doWork() {
        Intent service = new Intent(getApplicationContext(), BackgroundPositionServices.class);
        Bundle bundle = new Bundle();
        bundle.putString("msg", "backgroundPosition start");
        service.putExtras(bundle);
        getApplicationContext().startService(service);
        return Result.success();
    }
}