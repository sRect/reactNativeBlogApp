// ToastModule.java
package com.blogapp;

import android.hardware.Camera;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CameraCharacteristics;
// import android.hardware.camera2.CaptureRequest;
// import android.hardware.camera2.CameraManager.TorchCallback;
import android.os.Build;
// import android.os.Bundle;
import android.content.pm.PackageManager;

// import java.util.concurrent.CountDownLatch;
// import java.util.concurrent.TimeUnit;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
// import com.facebook.react.bridge.Callback;
// import com.facebook.react.uimanager.IllegalViewOperationException;
// import com.facebook.react.modules.core.DeviceEventManagerModule;
// import com.facebook.react.bridge.WritableMap;

import android.util.Log;

import java.util.Map;
import java.util.HashMap;

public class FlashlightManModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private Camera camera;
  private Camera.Parameters mParameters;

  private CameraManager mCameraManager;
  private boolean hasClosed = true; // 定义开关状态，状态为false，打开状态，状态为true，关闭状态;

  private static final int FLASH_LIGHT_ON = 1; // 打开手电筒
  private static final int FLASH_LIGHT_OFF = 0; // 关闭手电筒
  private static final String E_LAYOUT_ERROR = "E_LAYOUT_ERROR";
  private static final String HAS_FLASH = "HAS_FLASH";
  private static final String NOT_HAS_FLASH = "NOT_HAS_FLASH";
  // private static final String TAG = "FlashlightUtil";
  // private static boolean isFlashlightOn = false;

  public FlashlightManModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "FlashlightManager";
  }

  // @Override
  // public Map<Int, Object> getConstants() {
  //   final Map<Int, Object> constants = new HashMap<>();
  //   constants.put(FLASH_LIGHT_ON, 1);
  //   constants.put(FLASH_LIGHT_OFF, 0);
  //   return constants;
  // }

  // @ReactMethod
  // public void addListener(String eventName) {
  //   // Set up any upstream listeners or background tasks as necessary
  // }
  // @ReactMethod
  // public void removeListeners(Integer count) {
  //   // Remove upstream listeners, stop unnecessary background tasks
  // }

  // 是否支持闪光灯
  @ReactMethod
  public void isSuportFlashlight(Promise promise) {
    // successCallback.invoke(hasClosed ? false : true);

    try {
      PackageManager packageManager = reactContext.getPackageManager();
      //检查设备是否支持闪光灯
      boolean hasFlash = packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH);
      
      String hasFlashStr = hasFlash ? HAS_FLASH : NOT_HAS_FLASH;
      
      if(!hasFlash) {
        promise.reject(E_LAYOUT_ERROR, hasFlashStr);
        return;
      }

      CameraManager mCameraManager = (CameraManager) reactContext.getSystemService(ReactContext.CAMERA_SERVICE);
      String[] cameraIds = mCameraManager.getCameraIdList();
      String cameraId = cameraIds[0];
      boolean r = mCameraManager.getCameraCharacteristics(cameraId).get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
      promise.resolve(r);
    } catch(CameraAccessException e) {
      e.printStackTrace();
      promise.reject(E_LAYOUT_ERROR, e);
    }
  }

  // // 获取当前闪光灯开光状态
  // @ReactMethod
  // public void getFlashlightType() {
  //   CameraManager cameraManager = (CameraManager) reactContext.getSystemService(ReactContext.CAMERA_SERVICE);
  //   CountDownLatch latch = new CountDownLatch(1);

  //   if (cameraManager != null) {
  //     cameraManager.registerTorchCallback(new TorchCallback() {
  //       @Override
  //       public void onTorchModeChanged(String cameraId, boolean enabled) {
  //         super.onTorchModeChanged(cameraId, enabled);
  //         isFlashlightOn = enabled;
  //         latch.countDown();
  //       }
  //     }, null);
  //   }

  //   try {
  //     latch.await(2, TimeUnit.SECONDS);
  //   } catch (InterruptedException e) {
  //     Log.e(TAG, "Error while waiting for torch callback", e);
  //     promise.reject(TAG, e);
  //   }

  //   promise.resolve(isFlashlightOn);
  // }

  // 闪光灯开、关
  @ReactMethod
  public void toggleLight(int lightType, Promise promise) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        // Android7.x之后：
        //获取CameraManager
        CameraManager mCameraManager = (CameraManager) reactContext.getSystemService(ReactContext.CAMERA_SERVICE);
        String[] cameraIds = mCameraManager.getCameraIdList();
        String cameraId = cameraIds[0];
        hasClosed = lightType == FLASH_LIGHT_ON;
        mCameraManager.setTorchMode(cameraId, lightType == FLASH_LIGHT_ON);
      } else {
        // Android7.x之前代码
        if(lightType == FLASH_LIGHT_ON) {
          camera = Camera.open();
          mParameters = camera.getParameters();
          mParameters.setFlashMode(mParameters.FLASH_MODE_TORCH);// 开启
          camera.setParameters(mParameters);
          hasClosed = false;
        } else {
          mParameters.setFlashMode(mParameters.FLASH_MODE_OFF);// 关闭
          camera.setParameters(mParameters);
          camera.release();
          hasClosed = true;
        }
      }
      

      promise.resolve(lightType);
    } catch (CameraAccessException e) {
      promise.reject(E_LAYOUT_ERROR, e);
    }
  }
}