import React from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";

export class ScreenHeader extends React.Component {
  render() {
    const { title } = this.props;
    const { goBack } = this.props.navigation;
    return (
      <View style={[styles.header, this.props.customStyle]}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
          <Ionicons
            name="ios-arrow-back"
            color={this.props.customBack ? this.props.customBack : Colors.DARK}
            size={24}
          />
        </TouchableOpacity>
        <Text style={[styles.title, this.props.customLabel]}>{title}</Text>

        {this.props.iconRight ? (
          <Image
            style={{
              width: 35,
              height: 35,
              resizeMode: "contain",
              marginRight: 25
            }}
            source={
              this.props.iconRight == "newAssignement"
                ? require("../assets/images/kangaroo.png")
                : require("../assets/images/payment.png")
            }
          />
        ) : null}
        {this.props.border ? (
          <View style={styles.border}>
            <View style={styles.first}></View>
            <View style={styles.second}></View>
            <View style={styles.third}></View>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    height: 8,
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    flexDirection: "row",
    marginBottom: -8
  },
  first: {
    height: 8,
    width: "80%",
    backgroundColor: "#f2b43a"
  },
  second: {
    height: 8,
    width: "8%",
    backgroundColor: "#99cc33"
  },
  third: {
    height: 8,
    width: "12%",
    backgroundColor: "#ff0080"
  },
  backBtn: {
    position: "absolute",
    left: 4,
    top: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "rgba(0,0,0,0)",
    zIndex: 10
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    left: 60,
    fontFamily: "bebas",
    color: Colors.DARK
  }
});
