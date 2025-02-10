import "../global.css";
import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Navigation } from "./navigation";
import { useFonts } from "expo-font";
import { Platform, StatusBar, StyleSheet } from "react-native";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f87171",
    secondary: "#f8fafc",
  },
};

export function App() {
  const [loaded, error] = useFonts({
    MonoB: require("../assets/LXGWWenKaiMonoTC-Bold.ttf"),
    MonsB: require("../assets/Montserrat-SemiBold.ttf"),
    Logo: require("../assets/Righteous-Regular.ttf"),
    Mons: require("../assets/Montserrat-Regular.ttf"),
    Quic: require("../assets/Quicksand-Medium.ttf"),
  });
  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  React.useEffect(() => {
    // Set the root view background color
    SystemUI.setBackgroundColorAsync("#FFFFFF"); // White background

    // Optional: Set the navigation bar color (Android only)
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync("#FFFFFF"); // Black navigation bar
    }
  }, []);

  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <GestureHandlerRootView style={styles.container}>
        <PaperProvider theme={theme}>
          <Provider store={store}>
            <Navigation
              linking={{
                enabled: "auto",
                prefixes: [
                  // Change the scheme to match your app's scheme defined in app.json
                  "helloworld://",
                ],
              }}
              onReady={() => {
                SplashScreen.hideAsync();
              }}
            />
            <Toasts
              defaultStyle={{
                indicator: {
                  backgroundColor: "#f87171",
                },
              }}
            />
          </Provider>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
