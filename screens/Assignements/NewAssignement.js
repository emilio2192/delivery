import React from "react";
import ReactNative from "react-native";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  AsyncStorage
} from "react-native";
import { SafeAreaView } from "react-navigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { ScreenHeader } from "../../components/ScreenHeader";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";
import { TextInputMask } from "react-native-masked-text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MyDatePicker } from "../../components/DatePicker";
import Collapsible from "react-native-collapsible";
import moment from "moment";
import TimePicker from "react-native-24h-timepicker";
import * as SQLite from "expo-sqlite";
import KeyboardShift from "../../components/KeyboardShift";
import Colors from "../../constants/Colors";

const db = SQLite.openDatabase("db.db");

export class NewAssignement extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    name: "",
    phone: "",
    date: "",
    subject: "",
    locations: [],
    isCollapsed: true
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const date = moment().format("DD-MM-YYYY");
    this.setState({ date: `${date} 18:00` });
    this._defaultContact();
  }

  executeSql = async (sql, params = []) => {
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, { rows }) => resolve(rows._array),
          reject
        );
      })
    );
  };

  async _fetchLocations() {
    try {
      const locations = await AsyncStorage.getItem("locations");
      if (locations !== null) {
        this.setState({
          locations: JSON.parse(locations)
        });
      }
    } catch (error) {}
  }

  async _deleteLocation(index) {
    try {
      const locations = await AsyncStorage.getItem("locations");
      if (locations !== null) {
        let locationsParsed = JSON.parse(locations);
        locationsParsed.splice(index, 1);
        await AsyncStorage.setItem(
          "locations",
          JSON.stringify(locationsParsed)
        );
        this.setState({
          locations: locationsParsed
        });
      }
    } catch (error) {}
  }

  _formIsValid() {
    return (
      this.state.locations.length > 1 &&
      this.state.name !== "" &&
      this.state.phone !== "" &&
      this.state.subject !== "" &&
      this.state.locations.length >= 2
    );
  }

  _scrollToInput(reactNode) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode);
  }

  _onDayPress(date) {
    this.setState({
      date: moment(date).format("DD-MM-YYYY"),
      isCollapsed: true
    });
    this.TimePicker.open();
  }

  async _hasCreditCard() {
    try {
      const rows = await this.executeSql("select * from payment_method");
      return Promise.resolve(rows.length > 0);
    } catch (error) {
      return false;
    }
  }
  _defaultContact = async () => {
    let userInformation = await AsyncStorage.getItem("userInformation");
    userInformation = JSON.parse(userInformation);
    this.setState({ phone: userInformation.mobile });
  };

  // Render any loading content that you like here
  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "white" }}
        forceInset={{ top: "never" }}
      >
        <KeyboardAwareScrollView
          innerRef={ref => {
            this.scroll = ref;
          }}
          style={styles.container}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={false}
        >
          <TimePicker
            ref={ref => {
              this.TimePicker = ref;
            }}
            onCancel={() => this.TimePicker.close()}
            onConfirm={(hour, minute) => {
              this.setState({ date: `${this.state.date} ${hour}:${minute}` });
              this.TimePicker.close();
            }}
          />
          <NavigationEvents onDidFocus={() => this._fetchLocations()} />

          <ScreenHeader
            title="¿Qué haremos por ti?"
            customStyle={{ backgroundColor: Colors.CIAN, color: Colors.WHITE }}
            navigation={this.props.navigation}
            customLabel={{ fontSize: 18, color: Colors.WHITE }}
            customBack={Colors.WHITE}
            border={true}
            iconRight={"newAssignement"}
          />
          <StatusBar barStyle="dark-content" />
          <TouchableOpacity
            style={[
              styles.saveButton,
              { width: Dimensions.get("window").width - 44 },
              !this._formIsValid() ? styles.disabledButton : {}
            ]}
            onPress={async () => {
              this.props.navigation.navigate("PaymentScreen", {
                locations: this.state.locations,
                subject: {
                  contactName: this.state.name,
                  contactPhone: this.state.phone,
                  limitDateTime: this.state.date,
                  subject: this.state.subject
                }
              });
            }}
            disabled={!this._formIsValid()}
          >
            <Text style={{ color: "white", fontFamily: "roboto-bold" }}>
              SIGUIENTE
            </Text>
          </TouchableOpacity>
          <KeyboardShift>
            {() => (
              <ScrollView style={styles.body}>
                <Text style={styles.placeholder}>ASUNTO</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={subject => this.setState({ subject })}
                  value={this.state.subject}
                  onFocus={event => {
                    // `bind` the function if you're using ES6 classes
                    this._scrollToInput(
                      ReactNative.findNodeHandle(event.target)
                    );
                  }}
                />
                <Text style={styles.placeholder}>NOMBRE DE CONTACTO</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={name => this.setState({ name })}
                  value={this.state.name}
                  onFocus={event => {
                    // `bind` the function if you're using ES6 classes
                    this._scrollToInput(
                      ReactNative.findNodeHandle(event.target)
                    );
                  }}
                />
                <View style={styles.row}>
                  {/*<View style={{ width: (Dimensions.get('window').width - 60) / 2 }}>
         <Text style={styles.placeholder}>FECHA LÍMITE</Text>
         <TouchableOpacity
             style={styles.dateInput}
             onPress={() => this.setState({ isCollapsed: !this.state.isCollapsed })}>
             <Text style={styles.dateText}>{this.state.date}</Text>
         </TouchableOpacity>
     </View>*/}
                  <View style={{ width: Dimensions.get("window").width - 45 }}>
                    <Text style={styles.placeholder}>TELÉFONO DE CONTACTO</Text>
                    <TextInputMask
                      style={styles.input}
                      type={"cel-phone"}
                      keyboardType="numeric"
                      options={{
                        maskType: "BRL",
                        withDDD: false
                      }}
                      value={this.state.phone}
                      onChangeText={phone => this.setState({ phone })}
                      onFocus={event => {
                        // `bind` the function if you're using ES6 classes
                        this._scrollToInput(
                          ReactNative.findNodeHandle(event.target)
                        );
                      }}
                    />
                  </View>
                </View>
                <Collapsible collapsed={this.state.isCollapsed}>
                  <MyDatePicker
                    onDayPress={day => this._onDayPress(day)}
                    current={this.state.date}
                  />
                </Collapsible>

                <Text style={styles.placeholder}>DESTINOS</Text>
                {this.state.locations.length === 0 && (
                  <Text style={[styles.placeholder, { marginTop: 15 }]}>
                    Aún no has seleccionado ningún destino
                  </Text>
                )}
                <View>
                  {this.state.locations.map((item, index) => (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("Map", {
                            location: item,
                            index
                          })
                        }
                      >
                        <View style={styles.location}>
                          <View style={styles.locationInfo}>
                            <View>
                              <Text style={styles.locationAddress}>
                                {item.address}
                              </Text>
                              <Text
                                multiline={true}
                                style={styles.locationDescription}
                              >
                                {item.brief}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => this._deleteLocation(index)}
                            style={styles.deleteButton}
                          >
                            <EvilIcons name="trash" size={18} color="#ea4141" />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                      {/*(index + 1) !== this.state.locations.length &&
             <EvilIcons name="chevron-down" size={18} color="#8c8c8c"/>*/}
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => this.props.navigation.navigate("Map")}
                >
                  <Ionicons name="ios-add" size={18} color="black" />
                  <Text style={{ marginLeft: 15, fontFamily: "roboto" }}>
                    AÑADIR DESTINO
                  </Text>
                </TouchableOpacity>
                <View style={{ height: 100 }}></View>
              </ScrollView>
            )}
          </KeyboardShift>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dateInput: {
    height: 50,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  dateText: {
    fontSize: 16,
    color: "#5b5b5b",
    fontFamily: "roboto-semibold"
  },
  deleteButton: {
    position: "absolute",
    bottom: 0,
    right: 24,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25
  },
  disabledButton: {
    backgroundColor: "#d2d2d2",
    borderColor: "#d2d2d2",
    shadowColor: "#d2d2d2",
    elevation: 0
  },
  location: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 24,
    marginBottom: 10,
    shadowColor: "#d6d6d6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 5
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  locationDescription: {
    marginTop: 5,
    fontSize: 12,
    color: "#5b5b5b"
  },
  locationButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 50,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: "row"
  },
  placeholder: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#C1C1C1",
    fontWeight: "bold",
    fontFamily: "roboto-semibold"
  },
  input: {
    height: 50,
    borderRadius: 3,
    backgroundColor: "#F4F6FA",
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    alignSelf: "stretch",
    fontFamily: "roboto"
  },
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
    marginVertical: 100
  },
  backBtn: {
    position: "absolute",
    left: 24
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  saveButton: {
    position: "absolute",
    bottom: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38c0e0",
    height: 60,
    borderRadius: 2,
    shadowColor: "#98CC33",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
    alignSelf: "center",
    zIndex: 50,
    borderWidth: 0
  }
});
