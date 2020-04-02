import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TouchableHighlight
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animation from "../constants/Animation";
import Colors from "../constants/Colors";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export class SuccessView extends React.Component {
  state = {
    animation: null
  };

  componentDidMount() {
    this._playAnimation();
  }

  render() {
    return (
      <LinearGradient
        colors={[Colors.CIAN, Colors.CIAN]}
        style={styles.container}
        start={{ x: 0, y: 0.75 }}
        end={{ x: 1, y: 0.25 }}
      >
        <View style={{ width: 200, height: 200 }}>
          <LottieView
            ref={c => this._playAnimation(c)}
            source={require("../constants/SuccessAnimation.json")}
            loop={false}
            colorFilters={Colors.GREEN}
          />
        </View>
        <Image
          style={styles.icon}
          source={require("../assets/images/kangaroo.png")}
        />
        <Text style={styles.title}>Tú Asignación ha sido creada.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.props.onHomePress()}
        >
          <Ionicons
            name="ios-arrow-back"
            color={Colors.DARK}
            style={{ marginRight: 20 }}
            size={24}
          />
          <Text style={styles.buttonText}>Asignaciones</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  _playAnimation = anim => {
    this.lottieAnim = anim;
    if (anim) {
      this.lottieAnim.play();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontFamily: "roboto-bold",
    fontSize: 18,
    color: "white",
    alignSelf: "center",
    position: "absolute",
    top: Dimensions.get("window").height / 2 - 150
  },
  icon: {
    alignSelf: "center",
    position: "absolute",
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginRight: 25,
    top: Dimensions.get("window").height / 2 - 250
  },
  backButton: {
    position: "absolute",
    top: Dimensions.get("window").height / 2 + 130,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 5,
    alignSelf: "center",
    zIndex: 50,
    borderWidth: 0,
    paddingHorizontal: 60,
    flexDirection: "row"
  },
  buttonText: {
    color: "#3c3f42",
    fontFamily: "roboto-bold",
    fontSize: 14
  }
});
