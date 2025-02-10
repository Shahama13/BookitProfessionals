import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { markAsComplete } from "../redux/actions/apptActions";

const AppointmentBox = ({
  userImg,
  userName,
  startTime,
  apptFor,
  endTime,
  durationInminutes,
  status,
  rating,
  id,
  setModalVisible,
  setId,
}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [apptId, setApptId] = useState("");
  const { loader } = useSelector((state) => state.appt);
  const handleFinish = () => {
    setApptId(id);
    dispatch(markAsComplete(id));
  };

  return (
    <View className="flex flex-col">
      <TouchableOpacity
        disabled={status !== "Booked"}
        onPress={() => setVisible(!visible)}
        className="bg-white p-5 mt-5 flex flex-row w-[100%] justify-between"
      >
        <View className=" w-[80%]">
          <Text className="font-MonsB text-red-400 text-base mb-4">
            {moment(startTime).format("LT")} - {moment(endTime).format("LT")}
          </Text>
          <Text className="font-Quic text-lg text-black">{userName}</Text>
          <Text className="font-Mons text-gray-500 mt-3 mb-1">
            {apptFor} Appointment
          </Text>
          <Text className="font-Mons text-gray-500">
            {durationInminutes} mins
          </Text>
        </View>
        {userImg && (
          <Image
            className=" h-16 w-16 rounded-full  object-center"
            source={{
              uri: userImg,
            }}
          />
        )}
      </TouchableOpacity>
      {visible && status === "Booked" && (
        <>
          <View className="w-[100%] h-[1px] bg-slate-200" />
          <View className="bg-white flex flex-row   w-[100%]">
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setId(id);
              }}
              className=" flex-row w-[50%] p-5"
            >
              <Ionicons name={"close-outline"} size={20} color={"#dc2626"} />
              <Text className="font-Mons ml-2">Cancel</Text>
            </TouchableOpacity>
            {loader && id === apptId ? (
              <View className=" flex items-center justify-center w-[50%] p-5">
                <ActivityIndicator size={"small"} color={"#f87171"} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleFinish}
                className=" flex-row w-[50%] p-5"
              >
                <Ionicons
                  name={"checkmark-outline"}
                  size={20}
                  color={"#22c55e"}
                />
                <Text className="font-Mons ml-2">Mark Finished</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {(status === "Completed" || status === "Cancelled") && (
        <View className="bg-white flex flex-row justify-between items-center px-5 pb-4 ">
          <View>
            {rating && (
              <Text className="font-Mons text-gray-500">Rated {rating} ⭐</Text>
            )}
          </View>
          {status === "Completed" ? (
            <Ionicons
              name={"checkmark-done-outline"}
              size={20}
              color={"#0ea5e9"}
            />
          ) : (
            <Text className="italic text-red-500 text-lg">Cancelled</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AppointmentBox;
