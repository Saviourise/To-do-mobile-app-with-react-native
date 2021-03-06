// package com.project1;
// import android.os.Bundle;
// import com.facebook.react.ReactActivity;
// import org.devio.rn.splashscreen.SplashScreen;
// import com.facebook.react.ReactActivityDelegate;
// import com.facebook.react.ReactRootView;


// import android.content.ComponentName;
// import android.content.Intent;
// import android.content.pm.PackageManager;
// import androidx.annotation.Nullable;

// public class MainActivity extends ReactActivity {

//   /**
//    * Returns the name of the main component registered from JavaScript. This is used to schedule
//    * rendering of the component.
//    */
//   @Override
//   protected String getMainComponentName() {
//     return "To do app";
//   }

//   @Override
//     protected void onCreate(Bundle savedInstanceState) {
//         SplashScreen.show(this);  // here
//         super.onCreate(savedInstanceState);

//          ComponentName receiver = new ComponentName(this, BootReceiver.class);
//   PackageManager packageManager = this.getPackageManager();

//   packageManager.setComponentEnabledSetting(receiver,
//           PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
//           PackageManager.DONT_KILL_APP);
//     }

//   /**
//    * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
//    * you can specify the rendered you wish to use (Fabric or the older renderer).
//    */
//   @Override
//   protected ReactActivityDelegate createReactActivityDelegate() {
//     return new MainActivityDelegate(this, getMainComponentName());
//   }

//   public static class MainActivityDelegate extends ReactActivityDelegate {
//     public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
//       super(activity, mainComponentName);
//     }

//     @Override
//     protected ReactRootView createRootView() {
//       ReactRootView reactRootView = new ReactRootView(getContext());
//       // If you opted-in for the New Architecture, we enable the Fabric Renderer.
//       reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
//       return reactRootView;
//     }
//   }
// }

package com.project1;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "To do app";
  }

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}