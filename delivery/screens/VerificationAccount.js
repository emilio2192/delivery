import React from "react";
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import constants from '../constants/Server';
import endpoints from '../constants/Endpoints';
import communStyles from '../constants/CommunStyles';
import {gateway} from '../services/gateway';
import {SafeAreaView} from 'react-navigation';
import {ScreenHeader} from "../components/ScreenHeader";

const {State: TextInputState} = TextInput;

export class VerificationAccountScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const username = navigation.getParam('username', '');
        this.state = {
            shift: new Animated.Value(0),
            data: {
                mobileEmail: username,
                verificationCode: ''
            }

        };
        console.log('=====> ', this.props.username);
    }

    verificate = async () => {
        try {
            let response = await fetch(constants.domain + endpoints.verifyAccount, {
                method: 'POST',
                headers: constants.headers,
                body: JSON.stringify(this.state.data)
            });
            if (response.ok) {
                this.props.navigation.navigate('Login');
            }
        } catch (e) {
            console.log("ERROR ", e);
        }
    };
    requestVerification = async () => {
        try {
            const data = {mobileEmail: this.state.data.mobileEmail};
            const response = await gateway(endpoints.requestVerification, 'POST', data, false);
            if (response.message) {
                alert(response.message);
            }
        } catch (e) {
            console.log("ERROR ", e);
        }
    };
    ;


    render() {
        const {height: windowHeight} = Dimensions.get('window') - 40;
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <View style={{flex: 1}}>
                <ScreenHeader customStyle={{position: 'absolute'}} title="Volver" navigation={this.props.navigation}/>
                {/*#F4F4F4*/}
                <SafeAreaView
                    style={{flex: 1, backgroundColor: '#F4F4F4'}}
                    forceInset={{top: 'never'}}>
                    <KeyboardAvoidingView
                        behavior='padding'
                        style={{flex: 1, flexDirection: 'column'}} enabled>
                        <ScrollView style={{flex: 2, flexDirection: 'column', backgroundColor:'white', borderRadius: 10}}>
                            <View style={{flex: 1, height: windowHeight, marginTop: 80}}>
                                <Image style={styles.logo}
                                       source={require('../assets/images/logo.png')}/>
                            </View>
                            <View style={{flex: 4, marginTop: 10, flexDirection: 'column', padding: 20}}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.textInput}>Email ó Teléfono:</Text>
                                    <TextInput
                                        value={this.state.data.mobileEmail}
                                        onChangeText={(text) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                mobileEmail: text
                                            }
                                        })}
                                        style={styles.inputStyle}
                                        textContentType='name'/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.textInput}>Código:</Text>
                                    <TextInput
                                        onChangeText={(text) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                verificationCode: text
                                            }
                                        })}
                                        style={styles.inputStyle}
                                        textContentType='name'/>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity
                                        style={[communStyles.btnPrincipal, {width: Dimensions.get('window').width - 40}]}
                                        onPress={() => this.verificate()}>
                                        <Text style={{color: 'white', fontFamily: 'roboto-bold'}}>VERIFICAR</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, textAlign: 'center'}}>
                                    <Text style={styles.register}
                                          onPress={() => this.requestVerification()}>REENVIAR</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#F4F4F4'
    },
    formContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        bottom: 24,
        position: 'absolute',
        paddingVertical: 75,
        borderRadius: 35,
        alignItems: 'center'
    },
    logo: {
        // position: 'absolute',
        resizeMode: 'contain',
        width: 250,
        height: 100,
        alignItems: 'center',
        // marginBottom: 75,
        // top: -150
    },
    register: {
        fontSize: 16,
        color: '#009ADE',
        marginTop: 15,
        textAlign: 'center'
    },
    textInput: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 10,
        color: '#C1C1C1',
        fontWeight: 'bold',
        fontFamily: 'roboto-semibold',
        alignSelf: 'flex-start'
    },
    inputStyle: communStyles.inputStyle
});
