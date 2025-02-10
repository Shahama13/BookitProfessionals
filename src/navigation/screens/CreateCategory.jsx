import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { instance } from "../../redux/actions/empActions";
import { useSelector } from "react-redux";
import { toast } from "@backpackapp-io/react-native-toast";

const CreateCategory = () => {
  const { goBack } = useNavigation();
  const { employee } = useSelector((state) => state.auth);
  const [name, setName] = useState(false);
  const [durationInminutes, setDurationInminutes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await instance.post("/cat/create", {
        name,
        durationInminutes,
        imageUrl,
        description,
        special: true,
        employee: employee?._id,
      });
      toast.success("Category created");
      setLoading(false);
      goBack();
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-2 flex-1">
        <View className="bg-white px-2 mt-2 py-4 flex items-center justify-center gap-4 rounded-lg">
          <TextInput
            placeholderTextColor={"#9ca3af"}
            placeholder="Name"
            selectionColor="#000000"
            value={name}
            onChangeText={setName}
            className="border-gray-200 text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic w-full text-lg"
          />
          <TextInput
            keyboardType="numeric"
            placeholderTextColor={"#9ca3af"}
            placeholder="Duration in minutes"
            selectionColor="#000000"
            value={durationInminutes}
            onChangeText={setDurationInminutes}
            className="border-gray-200 text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic w-full text-lg"
          />
          <TextInput
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            placeholderTextColor={"#9ca3af"}
            placeholder="Cover-image url (Pick from pexels)"
            selectionColor="#000000"
            value={imageUrl}
            onChangeText={setImageUrl}
            className="border-gray-200 text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic w-full text-lg"
          />
          <TextInput
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            placeholderTextColor={"#9ca3af"}
            placeholder="Description"
            selectionColor="#000000"
            value={description}
            onChangeText={setDescription}
            className="border-gray-200 text-black border-[1.5px] px-4 py-3 rounded-xl font-Quic w-full text-lg"
          />
        </View>
      </View>
      <View className="bg-white p-3 w-full">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="bg-black px-4 py-4 rounded-[7px] flex items-center justify-center"
        >
          <Text className="text-white font-JostL text-lg text-center font-Quic">
            {loading ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              "Create"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateCategory;
