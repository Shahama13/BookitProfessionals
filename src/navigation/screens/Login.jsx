import {
  ActivityIndicator,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentEmp, empLogin } from "../../redux/actions/empActions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { toast } from "@backpackapp-io/react-native-toast";
import * as SystemUI from "expo-system-ui";
import UnProtectedRoute from "../../components/UnProtectedRoute";

const Login = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("zulfa8a@gmail.com");
  const [password, setPassword] = useState("123456");
  const { loading, isAuthenticated, reload } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (e) => {
    // return navigation.navigate("HomeTabs");
    await dispatch(empLogin(email, password));
    await dispatch(getCurrentEmp());
    // setEmail("");
    // setPassword("");
  };
  useEffect(() => {
    // Set the root view background color
    SystemUI.setBackgroundColorAsync("#000000"); // White background

    // Optional: Set the navigation bar color (Android only)
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync("#000000"); // Black navigation bar
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigation.navigate("HomeTabs");
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(getCurrentEmp());
  }, [reload]);

  return (
    // <UnProtectedRoute>
    <SafeAreaView className="bg-black flex-1">
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View className="bg-black px-4 h-full">
        <View className="bg-black mt-16 flex flex-col items-center justify-center py-11 rounded-md">
          <Text className="font-Logo text-7xl text-red-400">bookit</Text>
          <Text className="font-Mons text-lg text-white mb-2">
            Professionals
          </Text>
        </View>

        <View className="flex mt-[10%]">
          {/* <Text className="font-MonsB text-center text-red-400">Login Now</Text> */}
          <View className="space-y-3 selection:mt-[10%] flex">
            <TextInput
              placeholderTextColor={"#9ca3af"}
              selectionColor="#f87171"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              className="bg-gray-800 px-4 py-4 mb-4 rounded-xl font-Quic text-lg text-white"
            />
            <TextInput
              placeholderTextColor={"#9ca3af"}
              selectionColor="#f87171"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              className="bg-gray-800 px-4 py-4 rounded-xl font-Quic text-lg text-white"
              secureTextEntry={true}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text className="self-end mr-3 text-red-400 font-MonsB my-3">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-[8%] bg-red-400 rounded-xl py-4"
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              <Text className="text-white text-center font-Monsx">Login</Text>
            )}
          </TouchableOpacity>

          {/* <Text
              onPress={() => setRegister(true)}
              className=" text-center mt-3 text-black font-Quic"
            >
              Dont have an account?
            </Text> */}
        </View>
      </View>
    </SafeAreaView>
    // </UnProtectedRoute>
  );
};

export default Login;
