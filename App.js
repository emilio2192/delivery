import React from "react";
import SettingsScreen from "./screens/SettingsScreen";
import { AuthLoadingScreen } from "./screens/AuthLoading";
import {
  createAppContainer,
  createSwitchNavigator,
  TabBarBottom
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import HomeScreen from "./screens/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NewAssignement } from "./screens/Assignements/NewAssignement";
import MapContainer from "./containers/map-container";
import Entypo from "@expo/vector-icons/Entypo";
import { ProfileScreen } from "./screens/ProfileScreen";
import { Payment } from "./screens/Profile/Payment";
import { AddPayment } from "./screens/Profile/AddPayment";
import * as Font from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PaymentScreen } from "./screens/Assignements/PaymentScreen";
import AuthStack from "./navigation/Auth";
import Colors from "./constants/Colors";

const HomeStack = createStackNavigator({
  Main: { screen: HomeScreen },
  New: { screen: NewAssignement },
  Map: { screen: MapContainer },
  PaymentScreen: { screen: PaymentScreen },
  AddPayment: { screen: AddPayment }
});
const ProfileStack = createStackNavigator({
  Profile: { screen: ProfileScreen },
  Payment: { screen: Payment },
  AddPayment: { screen: AddPayment }
});
const SettingsStack = createStackNavigator({
  Settings: { screen: SettingsScreen }
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;
  const routeName = navigation.state.routes[navigation.state.index].routeName;
  if (routeName == "Main") {
    tabBarVisible = true;
  }
  return {
    tabBarVisible
  };
};

ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;
  const routeName = navigation.state.routes[navigation.state.index].routeName;
  if (routeName == "Profile") {
    tabBarVisible = true;
  }
  return {
    tabBarVisible
  };
};

const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <Entypo name="home" size={30} color={tintColor} />;
        }
      })
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <FontAwesome name="user" size={30} color={tintColor} />;
        }
      })
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <Ionicons name="ios-help-circle" size={30} color={tintColor} />
          );
        }
      })
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Colors.CIAN,
      inactiveTintColor: Colors.DARK,
      style: {
        backgroundColor: "#F9F9F9",
        height: 70,
        paddingBottom: 15,
        paddingTop: 15,
        borderTopColor: "#F9F9F9",
        borderTopWidth: 5,
        borderTopColor: Colors.YELLOW
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    animationEnabled: true,
    swipeEnabled: true
  }
);

const navigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: RootStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);

const AppContainer = createAppContainer(navigator);

// Now AppContainer is the main component for React to render

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      "roboto-bold": require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
      "roboto-black": require("./assets/fonts/Roboto/Roboto-Black.ttf"),
      roboto: require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
      "roboto-thin": require("./assets/fonts/Roboto/Roboto-Thin.ttf"),
      "roboto-light": require("./assets/fonts/Roboto/Roboto-Light.ttf"),
      "roboto-semibold": require("./assets/fonts/Roboto/Roboto-Medium.ttf"),
      bebas: require("./assets/fonts/bebas_neue/BebasNeue-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return this.state.fontLoaded ? (
      <AppContainer
        ref={nav => {
          this.navigator = nav;
        }}
      />
    ) : null;
  }
}
