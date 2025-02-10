import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import {
  getCurrentEmp,
  instance,
  setHeader,
} from "../../redux/actions/empActions";
import { toast } from "@backpackapp-io/react-native-toast";
import { useDispatch, useSelector } from "react-redux";
import mime from "mime";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [loader, setLoader] = useState(false);
  const { employee } = useSelector((state) => state.auth);
  const [fullname, setFullname] = useState(employee?.fullname);
  const [description, setDescription] = useState(employee?.description);

  const handleUpdateProfile = async () => {
    try {
      setLoader(true);
      const myForm = new FormData();
      fullname && myForm.append("fullname", fullname);
      description && myForm.append("description", description);
      avatar &&
        myForm.append("avatar", {
          uri: avatar,
          type: mime.getType(avatar),
          name: avatar.split("/").pop(),
        });
      await setHeader();
      const { data } = await instance.post("/emp/change-profile", myForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        setLoader(false);
        // toast.success(data.message);
        dispatch(getCurrentEmp());
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required");
      return;
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="px-2 flex-1">
        <View className="bg-white px-2 mt-2 py-4 flex items-center justify-center gap-1 rounded-lg">
          <View className="relative mb-6">
            {avatar || employee?.avatar?.url ? (
              <Image
                className="h-28 w-28 rounded-full"
                source={{
                  uri: avatar ? avatar : employee?.avatar?.url,
                }}
              />
            ) : (
              <FontAwesome5 name="user-circle" size={110} color={"#d1d5db"} />
            )}
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-2 right-2 bg-gray-200 p-1 rounded-full"
            >
              <Feather name="edit-2" size={15} color={"#000000"} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Name"
            selectionColor="#000000"
            value={fullname}
            onChangeText={setFullname}
            className="border-gray-200 font-Quic mb-3 border-[1.5px] px-4 py-3 rounded-xl z-0 w-full"
          />
          <TextInput
            placeholder="Email"
            selectionColor="#000000"
            value={employee?.email}
            //   onChangeText={setFullname}
            className="border-gray-200 font-Quic border-[1.5px] px-4 py-3 rounded-xl z-0 w-full mb-3"
          />
          <TextInput
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            placeholder="Description"
            selectionColor="#000000"
            value={description}
            onChangeText={setDescription}
            className="border-gray-200 font-Quic mb-3 border-[1.5px] px-4 py-3 rounded-xl z-0 w-full"
          />
        </View>
      </ScrollView>

      <View className="bg-white p-3 w-full">
        <TouchableOpacity
          onPress={handleUpdateProfile}
          className="bg-black px-4 py-4 rounded-[7px] flex items-center"
        >
          {loader ? (
            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
          ) : (
            <Text className="text-white text-lg text-center font-Quic">
              Update Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
