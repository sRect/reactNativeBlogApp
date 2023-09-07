package com.blogapp;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.InputStream;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;  
import javax.net.ssl.TrustManagerFactory;

public class TrustIkunCrtModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String IKUN_STR = "ikun.crt已设置为信任";
  private static final String IKUN_READ_ERROR = "IKUN_READ_ERROR";

  @Override
  public String getName() {
    return "TrustIkunCrt";
  }

  public TrustIkunCrtModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @ReactMethod
  public void readIkunCrt(Promise promise) {
    try {
      // 读取证书文件
      InputStream certStream = reactContext.getResources().openRawResource(R.raw.ikun);
      CertificateFactory cf = CertificateFactory.getInstance("X.509");
      X509Certificate cert = (X509Certificate) cf.generateCertificate(certStream);

      // 创建一个证书集合,将自签名证书放入
      KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
      keyStore.load(null, null);
      keyStore.setCertificateEntry("ca", cert);

      // 使用含有新证书的 TrustManager
      SSLContext sslContext = SSLContext.getInstance("TLS");
      TrustManagerFactory trustManagerFactory = TrustManagerFactory
          .getInstance(TrustManagerFactory.getDefaultAlgorithm());
      trustManagerFactory.init(keyStore);
      sslContext.init(null, trustManagerFactory.getTrustManagers(), new SecureRandom());

      // 设置全局的 SSLSocketFactory
      HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());

      promise.resolve(IKUN_STR);
    } catch (Exception e) {
      promise.reject(IKUN_READ_ERROR, e);
    }
  }
}