import {
  View,
  Text,
  StatusBar,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "../../components/ProtectedRoute";
import AppointmentBox from "../../components/AppointmentBox";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getApptsOfASpecifiedDate } from "../../redux/actions/apptActions";
import moment from "moment";
import { toast } from "@backpackapp-io/react-native-toast";
import { instance } from "../../redux/actions/empActions";
import { Modal, Portal, Button, PaperProvider } from "react-native-paper";

const cancellationReasons = [
  "Unexpected personal emergency",
  "Scheduling conflict with another client",
  "Delayed shipment of required styling products",
  "Power or technical issues at the salon.",
  "Overbooking error in the schedule.",
];

const Home = () => {
  const { navigate } = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const { employee } = useSelector((state) => state.auth);
  const { loading, appt, latestAppt, loader } = useSelector(
    (state) => state.appt
  );
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [cancelReason, setCancelreason] = useState("");
  const [cancelLoader, setCancelLoader] = useState(false);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 15,
    borderRadius: 8,
  };
  const handleCancellation = async () => {
    try {
      if (!cancelReason) return toast.error("Select a reason");
      setCancelLoader(true);
      const { data } = await instance.post(`/appt/cancel/${id}`, {
        cancelReason,
      });
      toast.success(data.message);
      setCancelLoader(false);
      dispatch(getApptsOfASpecifiedDate(employee?._id, moment().format()));
      setVisible(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setCancelLoader(false);
    }
  };
  useEffect(() => {
    const handleBackPress = () => {
      BackHandler.exitApp(); // Exit the app directly
      return true; // Prevent default back behavior
    };

    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Cleanup the event listener on unmount
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    dispatch(getApptsOfASpecifiedDate(employee?._id, moment().format()));
  }, [focus]);

  useEffect(() => {
    if (loader === false) {
      dispatch(getApptsOfASpecifiedDate(employee?._id, moment().format()));
    }
  }, [loader]);

  const onRefresh = useCallback(() => {
    dispatch(getApptsOfASpecifiedDate(employee?._id, moment().format()));
  }, []);

  return (
    <ProtectedRoute>
      <PaperProvider>
        <SafeAreaView className="flex-1 bg-slate-50">
          <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="flex items-center px-4 pt-2 shadow-xl shadow-slate-500 bg-white pb-7">
              <Text className="font-Logo text-4xl text-red-400">bookit</Text>
              <Text className="text-xs font-Mons -mb-6">Professionals</Text>
            </View>

            {/* <View className="flex justify-center items-center flex-row px-4 py-4 shadow-sm shadow-slate-600 bg-white mb-[2px]">
            <Text className="font-Logo text-3xl text-red-400">bookit</Text>
          </View> */}

            <View className="px-3 mt-4">
              <Image
                className="w-full h-56 rounded-md relative object-center bg-black opacity-60"
                source={{
                  uri: "https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  // uri: "https://images.pexels.com/photos/3992873/pexels-photo-3992873.jpeg?auto=compress&cs=tinysrgb&w=600",
                }}
              />
              <View className="absolute bottom-10 left-5 pl-3">
                <Text className="font-Logo text-white text-xl">
                  FLexible Hours
                </Text>
                <Text className="text-white font-Mons tracking-wider">
                  Work at your convinient timings
                </Text>
              </View>
            </View>

            <View className="mt-2 mx-3">
              <View className="px-1 mt-6 w-[100%] flex-row items-center mb-5">
                <Text className="font-Mons w-[65%] bg-blue-50 pl-2">
                  Your appointments
                </Text>
                <View className="w-[35%] h-[1px] bg-slate-200" />
              </View>
              {loading ? (
                <View className="mt-14">
                  <ActivityIndicator size={"large"} color={"#f87171"} />
                </View>
              ) : (
                <View className="flex flex-row justify-start gap-4">
                  <TouchableOpacity className="bg-stone-50 w-[30%] py-7 gap-4 rounded-lg shadow-lg shadow-pink-500">
                    <Text className="font-Mons text-center text-sm">Today</Text>
                    <Text className="text-center font-Quic text-2xl">
                      {appt?.length}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-neutral-50 w-[30%] py-7 gap-4 rounded-lg shadow-lg shadow-cyan-500">
                    <Text className="font-Mons text-center text-sm">
                      Finished
                    </Text>
                    <Text className="text-center font-Quic text-2xl">
                      {appt?.reduce((count, appointment) => {
                        return appointment.status === "Completed"
                          ? count + 1
                          : count;
                      }, 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-neutral-50 w-[30%] py-7 gap-4 rounded-lg shadow-lg shadow-emerald-500">
                    <Text className="font-Mons text-center text-sm">
                      Pending
                    </Text>
                    <Text className="text-center font-Quic text-2xl">
                      {appt?.reduce((count, appointment) => {
                        return appointment.status === ("Booked" || "Cancelled")
                          ? count + 1
                          : count;
                      }, 0)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View className="mt-9 px-3 pb-10">
              <View className="px-1 mt-6 w-[100%] flex-row items-center ">
                <Text className="font-Mons w-[40%] bg-blue-50 pl-2">
                  Upcoming
                </Text>
                <View className="w-[60%] h-[1px] bg-slate-200" />
              </View>

              <View>
                {loading ? (
                  <View className="mt-16">
                    <ActivityIndicator size={"large"} color={"#f87171"} />
                  </View>
                ) : latestAppt.length === 0 ? (
                  <View className="mt-16">
                    <Text className="text-red-400 font-MonsB text-center">
                      No upcoming appointments yet
                    </Text>
                  </View>
                ) : (
                  latestAppt?.map((a) => (
                    <AppointmentBox
                      key={a._id}
                      id={a._id}
                      userImg={a.bookedBy?.avatar?.url}
                      userName={a.bookedBy?.fullname}
                      startTime={a.startTime}
                      apptFor={a.apptFor.name}
                      durationInminutes={a.apptFor.durationInminutes}
                      endTime={a.endTime}
                      status={a.status}
                      rating={a.review?.rating}
                      setModalVisible={setVisible}
                      setId={setId}
                    />
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <ScrollView>
            <Text className="font-MonsB  text-gray-800 ">
              Why do you want to cancel this appointment?
            </Text>

            <View className="mt-5">
              <View className="flex flex-row w-[100%] flex-wrap gap-2">
                {cancellationReasons.map((r, i) => (
                  <TouchableOpacity
                    onPress={() => setCancelreason(r)}
                    key={i}
                    className={`${
                      r === cancelReason
                        ? "border-[1px] border-red-400 bg-white"
                        : "bg-slate-100"
                    }  py-3 px-4 rounded-lg`}
                  >
                    <Text
                      className={`${
                        r === cancelReason ? "text-red-400 " : "text-gray-800"
                      } font-Quic `}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row justify-end mt-10 items-center gap-4">
                <TouchableOpacity disabled={cancelLoader} onPress={hideModal}>
                  <Text className="text-gray-500 font-Quic">Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={cancelLoader}
                  onPress={handleCancellation}
                  className="bg-red-400 rounded-lg py-3 px-4"
                >
                  {cancelLoader ? (
                    <View className="w-40">
                      <ActivityIndicator size={"small"} color={"#ffffff"} />
                    </View>
                  ) : (
                    <Text className="text-white font-MonsB">
                      Cancel Appointment
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </ProtectedRoute>
  );
};

export default Home;
