import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { instance } from "../../redux/actions/empActions";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import moment from "moment";

const Reviews = () => {
  const { employee } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loader, setLoader] = useState(false);

  const getReviews = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get(`/rev/my/${employee?._id}`);
      setReviews(data.data);
      setLoader(false);
    } catch (error) {
      setReviews([]);
      setLoader(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="mt-2">
        {loader ? (
          <View className="mt-20 ">
            <ActivityIndicator size={"large"} color={"#f87171"} />
          </View>
        ) : (
          <View className="px-4 gap-3 pb-10">
            {reviews?.map((r) => (
              <View
                key={r._id}
                className="flex flex-col px-5 py-6 bg-white rounded-lg gap"
              >
                <View className=" flex flex-row w-[100%] justify-between ">
                  <View className="w-[77%] ">
                    <Text className="font-MonsB">{r.user?.fullname}</Text>
                    <Text className="font-Quic my-2">{r.comment}</Text>
                    <Text className="font-MonsB">{r.rating}⭐</Text>
                  </View>

                  <Image
                    className=" h-16 w-16 rounded-full  object-center"
                    source={{
                      uri: r.user?.avatar?.url,
                    }}
                  />
                </View>
                <View className="flex flex-row  justify-between mt-3">
                  <View></View>
                  <Text className="italic text-sm text-slate-400">
                    {moment.utc(r.createdAt).local().fromNow()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reviews;
