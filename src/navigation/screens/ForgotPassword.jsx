import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { instance } from "../../redux/actions/empActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useNavigation } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoader(true);
      const { data } = await instance.post("/emp/forgot-password", {
        email,
      });
      if (data.success) {
        setLoader(false);
        toast.success(data.message);
        navigation.navigate("ResetPassword");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="bg-black flex-1">
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View className="px-4 h-full flex bg-black justify-center">
        {/* <Text className="mb-[8%] font-Logo text-3xl">Forgot Password?</Text> */}
        <TextInput
          placeholderTextColor={"#9ca3af"}
          selectionColor="#f87171"
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          className="bg-gray-800 px-4 py-4 mb-4 rounded-xl font-Quic text-lg text-white"
        />

        <TouchableOpacity
          className="mt-[5%]  bg-red-400 rounded-xl py-4"
          onPress={handleForgotPassword}
        >
          {loader ? (
            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
          ) : (
            <Text className="text-white text-center font-Quic">Send Email</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
