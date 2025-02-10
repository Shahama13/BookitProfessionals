import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const SettingsButton = ({ iconName, head, subText, navigateTo }) => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate(navigateTo)}
      className="flex flex-row justify-between items-center w-[100%] p-4 py-5"
    >
      <View className="bg-slate-50 p-3 rounded-full">
        <Ionicons name={iconName} size={20} color={"#000000"} />
      </View>
      <View className="flex-1 ml-4">
        <Text className="font-MonsB text-gray-700">{head}</Text>
        <Text className="font-Mons text-gray-500">{subText}</Text>
      </View>
      <View className="justify-end">
        <Ionicons name="chevron-forward-outline" size={16} color={"#000000"} />
      </View>
    </TouchableOpacity>
  );
};

export default SettingsButton;
