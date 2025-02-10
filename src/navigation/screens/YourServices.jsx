import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { instance } from "../../redux/actions/empActions";
import Specialcategory from "../../components/Specialcategory";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const YourServices = () => {
  const focus = useIsFocused();
  const { navigate } = useNavigation();
  const [loader, setLoader] = useState(false);
  const [basicCategories, setBasicCategories] = useState([]);
  const [specialCategories, setSpecialCategories] = useState([]);
  const getCategories = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get("/cat/all");
      if (data.success) {
        setLoader(false);
        const { newData, newData2 } = data.data?.reduce(
          (acc, c) => {
            c?.special ? acc.newData2.push(c) : acc.newData.push(c);
            return acc;
          },
          { newData: [], newData2: [] }
        ) || { newData: [], newData2: [] };

        setBasicCategories(newData);
        setSpecialCategories(newData2);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [focus]);
  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      <ScrollView className="flex-1">
        {loader ? (
          <ActivityIndicator size={"large"} color={"#f87171"} />
        ) : (
          <>
            {basicCategories && (
              <View className="bg-white mx-3 px-3 py-5 rounded-lg mt-2">
                <Text className="font-Mons text-xl mb-3">Basic services</Text>
                <FlatList
                  data={basicCategories || []}
                  renderItem={({ item }) => (
                    <Text className="font-Quic px-10 py-4 bg-slate-50 rounded-xl">
                      {item.name}
                    </Text>
                  )}
                  keyExtractor={(item) => item?._id}
                  contentContainerStyle={{ columnGap: 10 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            {specialCategories && (
              <View className="bg-white mx-3 px-3 py-5 rounded-lg mt-2">
                <Text className="font-Mons text-xl mb-4">Special services</Text>

                <View className="">
                  {specialCategories?.map((f) => (
                    <Specialcategory
                      fav={true}
                      description={f.description}
                      id={f._id}
                      name={f.name}
                      rounded={true}
                      durationInminutes={f.durationInminutes}
                      uri={f.imageUrl}
                      key={f._id}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigate("CreateCategory")}
        style={{ position: "absolute", bottom: 60, right: 15 }}
        className="bg-red-400 p-3 rounded-full"
      >
        <Ionicons name={"add-outline"} size={30} color={"#ffffff"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default YourServices;
