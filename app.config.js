module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      name: 'rediary',
      slug: 'rediary',
      version: '0.1.10',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'rediary',
      platforms: ['ios', 'android'],
      userInterfaceStyle: 'automatic',
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.shinseimurakami.rediary',
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
        usesAppleSignIn: true,
      },
      android: {
        adaptiveIcon: {
          backgroundColor: '#E6F4FE',
          foregroundImage: './assets/images/android-icon-foreground.png',
          backgroundImage: './assets/images/android-icon-background.png',
          monochromeImage: './assets/images/android-icon-monochrome.png',
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: 'com.shinseimurakami.rediary',
      },
      web: {
        output: 'static',
        favicon: './assets/images/favicon.png',
      },
      plugins: [
        'expo-router',
        [
          'expo-splash-screen',
          {
            image: './assets/images/splash-icon.png',
            // imageWidth: 200,
            resizeMode: 'cover',
            backgroundColor: '#5B8CFF',
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
        reactCompiler: true,
      },
      updates: {
        enabled: true,
        checkAutomatically: 'ON_LOAD',
        fallbackToCacheTimeout: 0,
      },
      extra: {
        router: {},
        eas: {
          projectId: '5e1b2a51-6754-41e1-97fe-231cbf875693',
        },
      },
    },
  };
};
