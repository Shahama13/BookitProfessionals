import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { logoutEmp } from "../../redux/actions/empActions";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsButton from "../../components/SettingsButton";

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { employee } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    await dispatch(logoutEmp());
  };
  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <ScrollView>
          <View className="px-3">
            <View className="mt-5 bg-white items-center gap-4 flex flex-row p-4 rounded-md mb-5">
              {employee?.avatar?.url ? (
                <Image
                  className="h-16 w-16 rounded-full"
                  source={{
                    uri: employee?.avatar?.url,
                  }}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={50}
                  color={"#d1d5db"}
                />
              )}

              <Text className="font-MonsB text-xl text-gray-700">
                {employee?.fullname}
              </Text>
            </View>
            <View className=" bg-white rounded-md mb-5 w-[100%]">
              <SettingsButton
                navigateTo={"Profile"}
                iconName={"person-outline"}
                head={"My Profile"}
                subText={"Change profile"}
              />
              <SettingsButton
                navigateTo={"YourServices"}
                iconName={"storefront-outline"}
                head={"My Services"}
                subText={"View services offered by me"}
              />
              <SettingsButton
                navigateTo={"WorkingHours"}
                iconName={"time-outline"}
                head={"Working Hours"}
                subText={"Change your working hours"}
              />
              <SettingsButton
                navigateTo={"ChangePassword"}
                iconName={"lock-closed-outline"}
                head={"Change Password"}
                subText={"Change your current password"}
              />
              <SettingsButton
                navigateTo={"Reviews"}
                iconName={"star-outline"}
                head={"Reviews"}
                subText={"Read your reviews"}
              />
            </View>

            <TouchableOpacity className="ml-4" onPress={handleLogout}>
              <Text
                style={{ color: "#ff0000" }}
                className="text-red-600 font-MonsB"
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default Profile;
