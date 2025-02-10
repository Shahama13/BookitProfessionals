import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Settings from "./screens/Settings.jsx";
import Login from "./screens/Login";
import Calendar from "./screens/Calendar";
import YourServices from "./screens/YourServices.jsx";
import { NotFound } from "./screens/NotFound";
import Ionicons from "@expo/vector-icons/Ionicons";
import Profile from "./screens/Profile.jsx";
import WorkingHours from "./screens/WorkingHours.jsx";
import ChangePassword from "./screens/ChangePassword.jsx";
import Reviews from "./screens/Reviews.jsx";
import ForgotPassword from "./screens/ForgotPassword.jsx";
import ResetPassword from "./screens/ResetPassword.jsx";
import CreateCategory from "./screens/CreateCategory.jsx";

const options = {
  headerShown: false,
  tabBarActiveTintColor: "#f87171",
  tabBarInactiveTintColor: "#64748b",
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontFamily: "MonsB",
    fontSize: 11,
  },
  tabBarStyle: {
    // height: "10%",
    // paddingTop: 5,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    // position: "absolute",
    // bottom: 0,
    // left: 20,
    // right: 20,
    // backgroundColor: "#fafafa", // Ensure the shadow is visible
  },
  tabBarItemStyle: {
    // padding: 5,
  },
};

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        ...options,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? "home" : "home-outline"}
            size={focused ? 25 : 20}
            color={color}
          />
        ),
      },
    },
    Calendar: {
      screen: Calendar,
      options: {
        ...options,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? "calendar-clear" : "calendar-clear-outline"}
            size={focused ? 25 : 20}
            color={color}
          />
        ),
      },
    },
    Settings: {
      screen: Settings,
      options: {
        ...options,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "settings" : "settings-outline"}
            size={focused ? 25 : 20}
            color={color}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        title: "Login",
        headerShown: false,
      },
    },
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: "My Profile",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    CreateCategory: {
      screen: CreateCategory,
      options: {
        title: "Create Category",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    WorkingHours: {
      screen: WorkingHours,
      options: {
        title: "Working Hours",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      options: {
        title: "Change Password",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    Reviews: {
      screen: Reviews,
      options: {
        title: "Reviews",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      options: {
        headerShown: false,
      },
    },
    ResetPassword: {
      screen: ResetPassword,
      options: {
        headerShown: false,
      },
    },
    YourServices: {
      screen: YourServices,
      options: {
        title: "My Services",
        headerTitleStyle: {
          fontFamily: "MonsB",
          fontSize: 17,
        },
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
