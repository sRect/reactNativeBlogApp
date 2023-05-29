package com.blogapp;

import android.media.MediaPlayer; 
import android.content.res.AssetFileDescriptor;  
import android.content.res.Resources;
// import android.content.res.AssetManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class PlayMusicModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private static final String TAGERROR = "PLAY_MUSICE_RROR";
  private static final String AUDIO_PLAY = "play";
  private static final String AUDIO_PAUSE = "pause";
  private static final String AUDIO_STOP = "stop";
  private static final String AUDIO_RELEASE = "release";

  private MediaPlayer mediaPlayer;
  private static final float BEEP_VOLUME = 9.10f;
  private static final String PLAY_END = "playEnd";

  public PlayMusicModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  private void sendEvent(ReactContext reactContext,
                       String eventName,
                       @Nullable WritableMap params) {
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Set up any upstream listeners or background tasks as necessary
  }
  @ReactMethod
  public void removeListeners(Integer count) {
    // Remove upstream listeners, stop unnecessary background tasks
  }
  

  @Override
  public String getName() {
    return "PlayMusicManager";
  }

  @ReactMethod
  public void control(String filename, String playOrPauseType, Promise promise) {
    try {
        

        if(playOrPauseType.equals(AUDIO_PLAY)) {
          if(mediaPlayer == null) {
            // 获取Resources对象
            Resources res = reactContext.getResources();
            //  根据文件名获取资源 ID,比如 R.raw.music 
            int resId = res.getIdentifier(filename, "raw", reactContext.getPackageName());
            // MediaPlayer mediaPlayer = MediaPlayer.create(reactContext, resId);
            mediaPlayer = new MediaPlayer();
            // 监听播放结束
            MediaPlayer.OnCompletionListener completionListener = new MediaPlayer.OnCompletionListener() {
              @Override
              public void onCompletion(MediaPlayer mp) {
                // 播放结束时回调
                WritableMap params = Arguments.createMap();
                params.putString("filename", filename);
                params.putString("playerEnd", PLAY_END);
                sendEvent(reactContext, "backgroundMusicPlayEnd", params);
              }
            };
            mediaPlayer.setOnCompletionListener(completionListener); 

            // mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            AssetFileDescriptor afd = res.openRawResourceFd(resId);
            mediaPlayer.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            afd.close();
            // mediaPlayer.setVolume(BEEP_VOLUME, BEEP_VOLUME);

            mediaPlayer.prepare(); // 准备
            mediaPlayer.start(); // 播放
          } else {
            mediaPlayer.start(); // 继续播放
          }
          
        } else if(playOrPauseType.equals(AUDIO_PAUSE)) {
          mediaPlayer.pause(); // 暂停
        } else if(playOrPauseType.equals(AUDIO_STOP)) {
          mediaPlayer.stop(); // 停止
        } else {
          mediaPlayer.release(); // 释放资源
          mediaPlayer = null;
        }

        WritableMap params2 = Arguments.createMap();
        params2.putString("filename", filename);
        params2.putString("playerStatus", playOrPauseType);

        promise.resolve(params2);
    } catch (Exception e) {
        e.printStackTrace();
        promise.reject(TAGERROR, e); 
    }
  }
}

