import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "react-native-otp-entry";
import { toast } from "@backpackapp-io/react-native-toast";
import { instance } from "../../redux/actions/empActions";
import { useNavigation } from "@react-navigation/native";

const ResetPassword = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState();
  const [OTP, setOTP] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPass, setShowPass] = useState(false);
  const handleOtpFilled = (num) => {
    setOTP(num);
    setShowPass(true);
  };
  const handleResetPassword = async () => {
    try {
      setLoader(true);
      const { data } = await instance.post("/emp/reset-password", {
        OTP,
        newPassword: confirmPassword,
      });
      if (data.success) {
        setLoader(false);
        toast.success(data.message);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-3 h-full flex pt-[15%] bg-black">
        {!showPass && (
          <>
            <Text className="text-lg text-red-400 font-MonsB">Enter OTP</Text>
            <Text className="mt-2 mb-10 text-red-400 text-base font-Mons">
              Please enter otp sent to your registered email
            </Text>
          </>
        )}
        {showPass && (
          <>
            <Text className="text-lg font-MonsB text-red-400 mb-10">
              Set new password
            </Text>
          </>
        )}
        <View>
          {!showPass ? (
            <OtpInput
              numberOfDigits={6}
              style={{ backgroundColor: "red" }}
              focusColor="#000000"
              focusStickBlinkingDuration={500}
              onFilled={handleOtpFilled}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
              theme={{
                pinCodeTextStyle: {
                  color: "#ffffff",
                },
                focusStickStyle: {
                  backgroundColor: "#f87171", // Change focus stick color to red
                },
                pinCodeContainerStyle: {
                  borderColor: "#1f2937",
                  // borderWidth: 1,
                  backgroundColor: "#1f2937",
                },
                focusedPinCodeContainerStyle: {
                  borderColor: "#f87171",
                  borderWidth: 1,
                },
                filledPinCodeContainerStyle: {
                  backgroundColor: "#1f2937",
                  borderColor: "#1f2937", // Remove white border
                },
                disabledPinCodeContainerStyle: {
                  backgroundColor: "#1f2937",
                  borderColor: "#1f2937",
                },
              }}
            />
          ) : (
            <>
              <TextInput
                placeholderTextColor={"#9ca3af"}
                selectionColor="#f87171"
                secureTextEntry
                placeholder="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                className="bg-gray-800 px-4 py-4 mb-4 rounded-xl font-Quic text-lg text-white"
              />
              <TextInput
                placeholderTextColor={"#9ca3af"}
                selectionColor="#f87171"
                secureTextEntry
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className={`${
                  newPassword?.length > 1 &&
                  confirmPassword?.length > 1 &&
                  newPassword !== confirmPassword
                    ? "border-red-500 text-red-500"
                    : "border-bluee text-white"
                } border-[1.5px] p-4  rounded-xl font-Quic bg-gray-800 text-lg`}
              />
            </>
          )}
        </View>
        {showPass && (
          <View className="absolute bottom-0 left-0 bg-black p-3 w-[100vw]">
            <TouchableOpacity
              onPress={handleResetPassword}
              className="bg-red-400 px-4 py-4 rounded-[7px] flex items-center"
              disabled={newPassword !== confirmPassword}
            >
              <Text className="text-white text-center font-Mons">
                {loader ? (
                  <ActivityIndicator size={"small"} color={"#FFFFFF"} />
                ) : (
                  "Change Password"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
