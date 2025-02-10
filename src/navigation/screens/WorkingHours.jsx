// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";
// import React, { useState } from "react";
// import { Checkbox } from "react-native-paper";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import moment from "moment";
// import { instance } from "../../redux/actions/empActions";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { toast } from "@backpackapp-io/react-native-toast";

// const WorkingHours = () => {
//   const days = [
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday",
//     "saturday",
//     "sunday",
//   ];
//   const { employee } = useSelector((state) => state.auth);
//   const [id, setId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loader, setLoader] = useState(false);
//   const [activeField, setActiveField] = useState(null); // Tracks whether 'start' or 'end' is being set
//   const [workingHr, setWorkingHr] = useState([]);
//   const [noHrs, setNohrs] = useState(false);

//   const getWorkingHrsOfemployee = async () => {
//     let b = [];
//     let a = {};
//     try {
//       setLoading(true);
//       const {
//         data: { data },
//       } = await instance.get(`/time/emp/${employee?._id}`);
//       setId(data._id);
//       const objectKeys = Object.keys(data).filter(
//         (key) => typeof data[key] === "object" && data[key] !== null
//       );
//       const objectValues = Object.values(data).filter(
//         (data) => typeof data === "object"
//       );
//       for (let i = 0; i < 7; i++) {
//         a[objectKeys[i]] = objectValues[i];
//         b.push(a);
//         a = {};
//       }
//       setWorkingHr(b);
//       setLoading(false);
//     } catch (error) {
//       toast.error(error.response.data.message);

//       setNohrs(true);

//       setLoading(false);
//       for (let i = 0; i < 7; i++) {
//         a[days[i]] = {
//           open: false,
//           start: "",
//           end: "",
//         };
//         b.push(a);
//         a = {};
//       }
//       setWorkingHr(b);
//       console.log("Error fetching working hrs:", error);
//     }
//   };

//   const updateWorkingHours = async () => {
//     try {
//       setLoader(true);
//       let a = {};

//       if (Array.isArray(workingHr) && workingHr.length === 7) {
//         workingHr.forEach((item) => {
//           const key = Object.keys(item)[0];
//           a[key] = item[key]; // This ensures correct assignment
//         });
//       } else {
//         throw new Error("Invalid working hours data format.");
//       }

//       const { data } = noHrs
//         ? await instance.post("/time/set-all", a)
//         : await instance.patch(`/time/${id}`, a);
//       toast.success(data.message);
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       setLoader(false);
//     }
//   };

//   const showDatePicker = (index, field) => {
//     setActiveField({ index, field }); // Set the active index and field (start or end)
//   };

//   const hideDatePicker = () => {
//     setActiveField(null);
//   };

//   const handleConfirm = (date) => {
//     if (activeField) {
//       setWorkingHr((prev) =>
//         prev.map((item, index) =>
//           index === activeField.index
//             ? {
//                 [Object.keys(item)[0]]: {
//                   ...Object.values(item)[0],
//                   [activeField.field]: moment(date).format(), // Update either 'start' or 'end'
//                 },
//               }
//             : item
//         )
//       );
//       hideDatePicker();
//     }
//   };

//   useEffect(() => {
//     getWorkingHrsOfemployee();
//   }, []);

//   return (
//     <SafeAreaView className="bg-slate-50 flex-1 relative">
//       <View className="bg-white flex-1 m-2 mt-2 rounded-lg py-7 px-2 flex flex-col gap-5 justify-start">
//         {loading ? (
//           <View className="h-[63%] flex items-center justify-center">
//             <ActivityIndicator size={"large"} color={"#f87171"} />
//           </View>
//         ) : (
//           workingHr.map((w, i) => (
//             <View key={i} className="flex-row items-center justify-between">
//               <View className="flex-row items-center gap-1">
//                 <Checkbox
//                   color="#f87171"
//                   uncheckedColor="#d1d5db"
//                   status={Object.values(w)[0].open ? "checked" : "unchecked"}
//                   onPress={() => {
//                     setWorkingHr((prev) =>
//                       prev.map((item, index) =>
//                         index === i
//                           ? {
//                               [Object.keys(item)[0]]: {
//                                 ...Object.values(item)[0],
//                                 open: !Object.values(item)[0].open,
//                               },
//                             }
//                           : item
//                       )
//                     );
//                   }}
//                 />
//                 <Text className="font-MonsB text-lg capitalize">
//                   {Object.keys(w)[0]}
//                 </Text>
//               </View>
//               <View className="flex-row items-center gap-1">
//                 <TouchableOpacity
//                   className=" bg-slate-50 rounded-md"
//                   onPress={() => showDatePicker(i, "start")}
//                 >
//                   {Object.values(w)[0].start ? (
//                     <Text className="py-2 px-4 text-red-400 font-MonsB">
//                       {moment(Object.values(w)[0].start).format("LT")}
//                     </Text>
//                   ) : (
//                     <Text className="text-black font-MonsB p-3 text-xs">
//                       Select Time{" "}
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//                 <Text className="font-Quic ">To</Text>
//                 <TouchableOpacity
//                   className=" bg-slate-50 rounded-md"
//                   onPress={() => showDatePicker(i, "end")}
//                 >
//                   {Object.values(w)[0].end ? (
//                     <Text className="py-2 px-4 text-red-400 font-MonsB">
//                       {moment(Object.values(w)[0].end).format("LT")}
//                     </Text>
//                   ) : (
//                     <Text className="text-black font-MonsB p-3 text-xs">
//                       Select Time{" "}
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))
//         )}
//         <DateTimePickerModal
//           isVisible={!!activeField}
//           mode="time"
//           date={
//             activeField
//               ? moment(
//                   Object.values(workingHr[activeField.index])[0][
//                     activeField.field
//                   ]
//                 ).toDate()
//               : new Date()
//           } // Set default date to the saved time or current time
//           onConfirm={handleConfirm}
//           onCancel={hideDatePicker}
//         />
//       </View>
//       <View className="bg-white p-3 w-full">
//         <TouchableOpacity
//           onPress={updateWorkingHours}
//           disabled={loader}
//           className="bg-black px-4 py-4 rounded-[7px] flex items-center justify-center"
//         >
//           <Text className="text-white font-JostL text-lg text-center font-Quic">
//             {loader ? (
//               <ActivityIndicator size={"small"} color={"#FFFFFF"} />
//             ) : (
//               "Update"
//             )}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default WorkingHours;
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Checkbox } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { instance } from "../../redux/actions/empActions";
import { useSelector } from "react-redux";
import { toast } from "@backpackapp-io/react-native-toast";

const WorkingHours = () => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Get today's day and reshuffle the days array
  const today = moment().format("dddd").toLowerCase(); // Get today's day in lowercase
  const reshuffledDays = [
    today,
    ...days.filter((day) => day !== today),
  ]; // Move today's day to the top

  const { employee } = useSelector((state) => state.auth);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [activeField, setActiveField] = useState(null); // Tracks whether 'start' or 'end' is being set
  const [workingHr, setWorkingHr] = useState([]);
  const [noHrs, setNohrs] = useState(false);

  const getWorkingHrsOfemployee = async () => {
    let b = [];
    let a = {};
    try {
      setLoading(true);
      const {
        data: { data },
      } = await instance.get(`/time/emp/${employee?._id}`);
      setId(data._id);
      const objectKeys = Object.keys(data).filter(
        (key) => typeof data[key] === "object" && data[key] !== null
      );
      const objectValues = Object.values(data).filter(
        (data) => typeof data === "object"
      );
      for (let i = 0; i < 7; i++) {
        a[objectKeys[i]] = objectValues[i];
        b.push(a);
        a = {};
      }
      setWorkingHr(b);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setNohrs(true);
      setLoading(false);
      for (let i = 0; i < 7; i++) {
        a[days[i]] = {
          open: false,
          start: "",
          end: "",
        };
        b.push(a);
        a = {};
      }
      setWorkingHr(b);
      console.log("Error fetching working hrs:", error);
    }
  };

  const updateWorkingHours = async () => {
    try {
      setLoader(true);
      let a = {};

      if (Array.isArray(workingHr) && workingHr.length === 7) {
        workingHr.forEach((item) => {
          const key = Object.keys(item)[0];
          a[key] = item[key]; // This ensures correct assignment
        });
      } else {
        throw new Error("Invalid working hours data format.");
      }

      const { data } = noHrs
        ? await instance.post("/time/set-all", a)
        : await instance.patch(`/time/${id}`, a);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const showDatePicker = (index, field) => {
    setActiveField({ index, field }); // Set the active index and field (start or end)
  };

  const hideDatePicker = () => {
    setActiveField(null);
  };

  const handleConfirm = (date) => {
    if (activeField) {
      setWorkingHr((prev) =>
        prev.map((item, index) =>
          index === activeField.index
            ? {
                [Object.keys(item)[0]]: {
                  ...Object.values(item)[0],
                  [activeField.field]: moment(date).format(), // Update either 'start' or 'end'
                },
              }
            : item
        )
      );
      hideDatePicker();
    }
  };

  useEffect(() => {
    getWorkingHrsOfemployee();
  }, []);

  return (
    <SafeAreaView className="bg-slate-50 flex-1 relative">
      <View className="bg-white flex-1 m-2 mt-2 rounded-lg py-7 px-2 flex flex-col gap-5 justify-start">
        {loading ? (
          <View className="h-[63%] flex items-center justify-center">
            <ActivityIndicator size={"large"} color={"#f87171"} />
          </View>
        ) : (
          reshuffledDays.map((day, i) => {
            const workingDay = workingHr.find((w) => Object.keys(w)[0] === day);
            return (
              <View key={i} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <Checkbox
                    color="#f87171"
                    uncheckedColor="#d1d5db"
                    status={workingDay ? (Object.values(workingDay)[0].open ? "checked" : "unchecked") : "unchecked"}
                    onPress={() => {
                      setWorkingHr((prev) =>
                        prev.map((item) =>
                          Object.keys(item)[0] === day
                            ? {
                                [day]: {
                                  ...Object.values(item)[0],
                                  open: !Object.values(item)[0].open,
                                },
                              }
                            : item
                        )
                      );
                    }}
                  />
                  <Text className="font-MonsB text-lg capitalize">
                    {day}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <TouchableOpacity
                    className=" bg-slate-50 rounded-md"
                    onPress={() => showDatePicker(i, "start")}
                  >
                    {workingDay && Object.values(workingDay)[0].start ? (
                      <Text className="py-2 px-4 text-red-400 font-MonsB">
                        {moment(Object.values(workingDay)[0].start).format("LT")}
                      </Text>
                    ) : (
                      <Text className="text-black font-MonsB p-3 text-xs">
                        Select Time{" "}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <Text className="font-Quic ">To</Text>
                  <TouchableOpacity
                    className=" bg-slate-50 rounded-md"
                    onPress={() => showDatePicker(i, "end")}
                  >
                    {workingDay && Object.values(workingDay)[0].end ? (
                      <Text className="py-2 px-4 text-red-400 font-MonsB">
                        {moment(Object.values(workingDay)[0].end).format("LT")}
                      </Text>
                    ) : (
                      <Text className="text-black font-MonsB p-3 text-xs">
                        Select Time{" "}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        <DateTimePickerModal
          isVisible={!!activeField}
          mode="time"
          date={
            activeField
              ? moment(
                  Object.values(workingHr[activeField.index])[0][
                    activeField.field
                  ]
                ).toDate()
              : new Date()
          } // Set default date to the saved time or current time
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <View className="bg-white p-3 w-full">
        <TouchableOpacity
          onPress={updateWorkingHours}
          disabled={loader}
          className="bg-black px-4 py-4 rounded-[7px] flex items-center justify-center"
        >
          <Text className="text-white font-JostL text-lg text-center font-Quic">
            {loader ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              "Update"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WorkingHours;