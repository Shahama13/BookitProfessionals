import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar as CalendarPages } from "react-native-calendars";
import AppointmentBox from "../../components/AppointmentBox";
import ProtectedRoute from "../../components/ProtectedRoute";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getApptsOfASpecifiedDate } from "../../redux/actions/apptActions";
import { Modal, Portal, PaperProvider } from "react-native-paper";
import { toast } from "@backpackapp-io/react-native-toast";
import { instance } from "../../redux/actions/empActions";

const cancellationReasons = [
  "Unexpected personal emergency",
  "Scheduling conflict with another client",
  "Delayed shipment of required styling products",
  "Power or technical issues at the salon.",
  "Overbooking error in the schedule.",
];

const Calendar = () => {
  const dispatch = useDispatch();
  const { employee } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(moment().format().split("T")[0]);
  const [date, setDate] = useState(moment().format());
  const { loading, appt } = useSelector((state) => state.appt);
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

  const [apptSegregated, setApptSegregated] = useState({
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  });

  const segregateTimeSlots = () => {
    const timings = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
    };
    appt?.forEach((a) => {
      const startTime = new Date(a.startTime);
      const hour = startTime.getHours(); // Get local hour of the interval

      if (hour >= 3 && hour < 12) {
        timings.morning.push(a);
      } else if (hour >= 12 && hour < 16) {
        timings.afternoon.push(a);
      } else if (hour >= 16 && hour < 19) {
        timings.evening.push(a);
      } else if (hour >= 19 || hour < 3) {
        timings.night.push(a);
      }
    });
    setApptSegregated(timings);
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
      dispatch(getApptsOfASpecifiedDate(employee?._id, date));
      setVisible(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setCancelLoader(false);
    }
  };

  useEffect(() => {
    dispatch(getApptsOfASpecifiedDate(employee?._id, date));
  }, [date]);

  useEffect(() => {
    if (appt.length > 0) {
      segregateTimeSlots();
    }
  }, [appt]);

  return (
    <ProtectedRoute>
      <PaperProvider>
        <SafeAreaView className="flex-1 bg-slate-50 ">
          <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
          <ScrollView>
            <View className="px-1 pb-10">
              <CalendarPages
                style={{
                  borderRadius: 5,
                  borderColor: "gray",
                  height: 350,
                  marginTop: 10,
                }}
                onDayPress={(day) => {
                  setApptSegregated({
                    morning: [],
                    afternoon: [],
                    evening: [],
                    night: [],
                  });
                  setDate(moment(day.timestamp).format());
                  setSelected(day.dateString);
                }}
                markedDates={{
                  [selected]: {
                    selected: true,
                    selectedColor: "#f87171", // Background color for the selected day
                    textColor: "#ffffff", // Text color for the selected day
                  },
                }}
                theme={{
                  todayTextColor: "#f87171",
                  dayTextColor: "#64748b",
                  textMonthFontFamily: "MonsB",
                  textDisabledColor: "#cbd5e1",
                  arrowColor: "#f87181",
                  arrowWidth: 30, 
                  arrowHeight: 30, 
                }}
              />
              <View className="px-3 mt-6 w-[100%] flex-row items-center">
                <Text className="font-Mons w-[35%] bg-blue-50 pl-2">
                  {moment(date).format("LL").split(",")[0]}
                </Text>
                <View className="w-[65%] h-[1px] bg-slate-200" />
              </View>
              {loading && (
                <View className="mt-32">
                  <ActivityIndicator size={"large"} color={"#f87171"} />
                </View>
              )}
              {appt.length == 0 && (
                <View className="mt-32">
                  <Text className="text-red-400 font-MonsB text-center">
                    No appointments yet
                  </Text>
                </View>
              )}
              {apptSegregated?.morning?.length > 0 && (
                <>
                  <View className="px-3 mt-6 w-[100%] flex-row items-center">
                    <View className="w-[10%] h-[1px] bg-slate-200" />
                    <Text className="font-Mons w-[35%] bg-blue-50 pl-2">
                      Morning
                    </Text>
                    <View className="w-[55%] h-[1px] bg-slate-200" />
                  </View>
                  <View className="px-3 ">
                    {apptSegregated?.morning?.map((a) => (
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
                    ))}
                  </View>
                </>
              )}
              {apptSegregated?.afternoon?.length > 0 && (
                <>
                  <View className="px-3 mt-6 w-[100%] flex-row items-center">
                    <View className="w-[10%] h-[1px] bg-slate-200" />
                    <Text className="font-Mons w-[35%] bg-blue-50 pl-2">
                      Afternoon
                    </Text>
                    <View className="w-[55%] h-[1px] bg-slate-200" />
                  </View>
                  <View className="px-3 ">
                    {apptSegregated?.afternoon?.map((a) => (
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
                    ))}
                  </View>
                </>
              )}
              {apptSegregated?.evening?.length > 0 && (
                <>
                  <View className="px-3 mt-6 w-[100%] flex-row items-center">
                    <View className="w-[10%] h-[1px] bg-slate-200" />
                    <Text className="font-Mons w-[35%] bg-blue-50 pl-2">
                      Evening
                    </Text>
                    <View className="w-[55%] h-[1px] bg-slate-200" />
                  </View>
                  <View className="px-3 ">
                    {apptSegregated?.evening?.map((a) => (
                      <AppointmentBox
                        id={a._id}
                        key={a._id}
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
                    ))}
                  </View>
                </>
              )}
              {apptSegregated?.night?.length > 0 && (
                <>
                  <View className="px-3 mt-6 w-[100%] flex-row items-center">
                    <View className="w-[10%] h-[1px] bg-slate-200" />
                    <Text className="font-Mons w-[35%] bg-blue-50 pl-2">
                      Night
                    </Text>
                    <View className="w-[55%] h-[1px] bg-slate-200" />
                  </View>
                  <View className="px-3 ">
                    {apptSegregated?.night?.map((a) => (
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
                    ))}
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
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
      </PaperProvider>
    </ProtectedRoute>
  );
};

export default Calendar;
