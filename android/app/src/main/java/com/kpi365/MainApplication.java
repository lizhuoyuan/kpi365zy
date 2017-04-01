package com.kpi365;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.yoloci.fileupload.FileUploadPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNDeviceInfo(),
                    new RNFSPackage(),
                    new VectorIconsPackage(),
                    new SplashScreenReactPackage(),
                    new ImagePickerPackage(),
                    new LinearGradientPackage(),
                    new FileUploadPackage(),
                    new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                    new RCTCameraPackage(),
                    new LinearGradientPackage()
            );
        }

    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
