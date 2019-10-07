import React from "react";
import {
    AsyncStorage,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import communStyles from '../constants/CommunStyles';
import constants from '../constants/Server';
import endpoints from '../constants/Endpoints';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-navigation';

import LottieView from "lottie-react-native";


export class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            // shift: new Animated.Value(0),
            data: {
                username: '',
                password: ''
            },
            sending: false
        };
    }

    componentWillMount() {
    }

    login = async () => {
        try {
            this.setState({sending: true});
            let response = await fetch(constants.domain + endpoints.signIn, {
                method: 'POST',
                headers: constants.headers,
                body: JSON.stringify(this.state.data)
            });

            const body = JSON.parse(response._bodyInit);
            console.log('LOGIN ', body);
            if (response.status === 401 && response.ok === false && body.verified === false) {
                console.log('inside');
                this.setState({sending: false});
                this.props.navigation.navigate('Verify', {username: this.state.data.username});
                return;
            }
            if (response.ok && response.status === 200) {
                await AsyncStorage.setItem("token", JSON.stringify(body.token));
                await AsyncStorage.setItem("userInformation", JSON.stringify(body.user));
                this.props.navigation.navigate('Main');
            } else {
                alert(body.msg);
            }
            this.setState({sending: false});
        } catch (e) {
            console.log("ERROR ", e);
        }
    };

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }

    render() {
        return (
            <SafeAreaView
                style={{flex: 1, backgroundColor: '#F4F4F4'}}
                forceInset={{top: 'never'}}>
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                    scrollEnabled={false}>
                    <Image style={styles.logo}
                           source={require('../assets/images/logo.png')}/>
                    <KeyboardAvoidingView style={styles.formContainer} behavior="padding" enabled>
                        <Text style={styles.textInput}>Usuario:</Text>
                        <TextInput style={styles.inputStyle}
                                   onChangeText={(text) => this.setState({data: {...this.state.data, username: text}})}
                                   keyboardType='email-address'
                                   returnKeyType='next'
                                   onSubmitEditing={() => {
                                       this.password.focus();
                                   }}
                                   blurOnSubmit={false}
                                   onFocus={(event) => {
                                       this._scrollToInput(event.target)
                                   }}
                        />
                        <Text style={styles.textInput}>Contrase&ntilde;a:</Text>
                        <TextInput style={styles.inputStyle}
                                   ref={(input) => {
                                       this.password = input;
                                   }}
                                   secureTextEntry={true}
                                   onChangeText={(text) => this.setState({data: {...this.state.data, password: text}})}
                                   textContentType='password'
                                   returnKeyType='done'
                                   onSubmitEditing={() => {
                                       this.login()
                                   }}
                                   onFocus={(event) => {
                                       this._scrollToInput(event.target)
                                   }}
                        />
                        <View style={[styles.rowLink, {paddingTop: 0}]}>
                            <Text style={styles.register}
                                  onPress={() => this.props.navigation.navigate('RequestChangePass')}>Recuperar
                                Contrase&ntilde;a</Text>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.btnLogin, {width: Dimensions.get('window').width - 96}]}
                                onPress={() => this.login()}>
                                {
                                    !this.state.sending &&
                                    <Text style={{color: 'white', fontFamily: 'roboto-bold'}}>INGRESAR</Text>
                                }
                                {this.state.sending &&
                                <LottieView
                                    ref={animation => {
                                        this.animation = animation;
                                    }}
                                    source={require('../constants/sending.json')}
                                    loop={true}
                                />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.registerView}>
                            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
                            <Text style={styles.linkRegister}
                                  onPress={() => this.props.navigation.navigate('Register')}> Regístrate</Text>
                        </View>
                    </KeyboardAvoidingView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }

    _playAnimation = (anim) => {
        this.lottieAnim = anim;
        if (anim) {
            this.lottieAnim.play();
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#F4F4F4'
    },
    registerView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20,
        flexDirection: 'row'
    },
    registerText: {
        fontFamily: 'roboto',
        fontSize: 12,
        color: '#C1C1C1'
    },
    linkRegister: {
        fontFamily: 'roboto-bold',
        fontSize: 12,
        color: '#FBB44A'
    },
    formContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        bottom: 24,
        paddingTop: 35,
        borderRadius: 35,
        alignItems: 'center',
        paddingBottom: 75
    },
    logo: {
        resizeMode: 'contain',
        width: 250,
        height: 100,
        alignItems: 'center',
        marginBottom: 50
    },
    rowLink: {
        height: 40,
        paddingTop: 5
    },
    btnLogin: communStyles.btnPrincipal,
    register: {
        fontSize: 12,
        color: '#009ADE',
        textAlign: 'center',
        fontFamily: 'roboto'
    },
    inputStyle: communStyles.inputStyle,
    textInput: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 10,
        color: '#C1C1C1',
        fontWeight: 'bold',
        fontFamily: 'roboto-semibold',
        alignSelf: 'flex-start'
    }
});
