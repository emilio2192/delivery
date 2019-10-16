import React from "react";
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal
} from "react-native";
import Terms from '../components/Terms';
import {AntDesign} from '@expo/vector-icons/';
import colors from '../constants/Colors';
import communStyles from '../constants/CommunStyles';
import {ScreenHeader} from "../components/ScreenHeader";

import constants from '../constants/Server';
import endpoints from '../constants/Endpoints';

const {State: TextInputState} = TextInput;

export class RegisterScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    scrollref = null;

    constructor(props) {
        super(props);
        const {height: windowHeight} = Dimensions.get('window');
        this.state = {
            shift: new Animated.Value(0),
            modal: false,
            scrollTop: 50,
            data: {
                agreed: false,
                name: '',
                mobile: '',
                email: '',
                areaMobileCountry: '502',
                password: '',
                passwordConfirm: '',
                userType: 'client',
                countryCode: 'GTM'
            },
            heightScroll: 0

        };
        this.myScroll = React.createRef();
    }

    checkBox = () => {
        const agreedment = this.state.data.agreed ? 'checksquareo' : 'closesquareo';
        return <View style={{alignItems: 'center', height: 50, justifyContent: 'center', flexDirection: 'row'}}>
            <Text style={{paddingRight: 15, fontFamily: 'roboto-semibold'}} onPress={() => {
                this.setState({modal: !this.state.modal})
            }}>Términos y condiciones &nbsp;</Text>
            <AntDesign name={agreedment} size={20} color={this.state.data.agreed ? 'green' : 'red'} onPress={() => {
                this.setState({data: {...this.state.data, agreed: !this.state.data.agreed}})
            }}/>
        </View>
    }

    createNewUser = async () => {
        try {
            if (!this.state.data.agreed) {
                alert('Por favor aceptar términos y condiciones para proceder');
                return;
            }
            let response = await fetch(constants.domain + endpoints.signUp, {
                method: 'POST',
                headers: constants.headers,
                body: JSON.stringify(this.state.data)
            });
            const responseJson = await response.json();
            console.log(response);
            const body = response._bodyInit;
            if (response.ok) {
                alert('Usuario creado con exito, realiza la verificación por medio del codigo enviado a tu email o móvil.');
                this.props.navigation.navigate('Login');
            } else {
                alert("Error: " + responseJson.message);
            }
        } catch (e) {
            console.log("ERROR ", e);
        }


    };

    render() {
        const {height: windowHeight} = Dimensions.get('window');
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
        return (
            <SafeAreaView
                style={{flex: 1, backgroundColor: 'white'}}
                forceInset={{top: 'never'}}>
                <ScreenHeader title="Registro" navigation={this.props.navigation}/>
                <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column'}} behavior='padding'
                                      keyboardVerticalOffset={keyboardVerticalOffset} enabled>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modal}
                        onRequestClose={() => console.log('Modal closed')}>
                        <View style={styles.container}>
                            <View style={styles.closeModal}>
                                <AntDesign name="close" color="black" size={30} onPress={() => { this.setState({ modal: !this.state.modal }) }} />
                            </View>
                            <ScrollView style={styles.modalContainer}>
                                <Terms />
                            </ScrollView>
                        </View>
                    </Modal>
                    <ScrollView
                        style={{
                            backgroundColor: 'white',
                            flex: 8,
                            flexDirection: 'column',
                            padding: 5,

                        }}>
                        <View style={{flex: 1}}>
                            <Image style={[styles.logo, {flex: 1}]}
                                   source={require('../assets/images/logo.png')}/>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.textInput}>Nombre:</Text>
                            <TextInput
                                onChangeText={(text) => this.setState({data: {...this.state.data, name: text}})}
                                style={styles.inputStyle}

                                textContentType='name'/>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.textInput}>Telefono:</Text>
                            <TextInput
                                onChangeText={(text) => this.setState({data: {...this.state.data, mobile: text}})}
                                style={styles.inputStyle}

                                textContentType='telephoneNumber'/>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.textInput}>Correo:</Text>
                            <TextInput
                                onChangeText={(text) => this.setState({data: {...this.state.data, email: text}})}
                                style={styles.inputStyle}

                                keyboardType='email-address'/>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.textInput}>Contraseña:</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({data: {...this.state.data, password: text}})}
                                style={[styles.inputStyle]}
                                textContentType='password'/>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.textInput}>Confirmar contraseña:</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({
                                    data: {
                                        ...this.state.data,
                                        passwordConfirm: text
                                    }
                                })}
                                style={styles.inputStyle}
                                textContentType='password'/>
                        </View>
                        <View style={{flex: 1}}>
                            <View style={styles.row}>
                                {this.checkBox()}
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', width: '100%', flex: 1, paddingBottom:10}}>
                            <TouchableOpacity
                                style={[communStyles.btnPrincipal, {width: Dimensions.get('window').width - 10}]}
                                onPress={() => this.createNewUser()}>
                                <Text style={{color: 'white', fontFamily: 'roboto-bold'}}>REGISTRARSE</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>


            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
        backgroundColor: 'white',
        zIndex: 11
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
    formContainer: {
        paddingHorizontal: 24,
        paddingVertical: 24,
        paddingBottom: 50,
        borderRadius: 35,
        marginBottom: 25
    },
    logo: {
        flex: 1,
        resizeMode: 'contain',
        width: 250,
        height: 75,
        alignItems: 'center',
        marginBottom: 100,
    },
    row: {
        height: 70,
    },
    closeModal: {
        height: 30,
        position: 'absolute',
        right: 30,
        top: 30,
        alignItems: 'flex-end'
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        height: '90%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        position: 'absolute',
        left: 10,
        top: 50

    },

    rowImage: {
        height: 100,
        paddingBottom: 15
    },
    rowBtn: {
        height: 70,
        alignItems: 'flex-end'
    },
    register: {
        fontSize: 16,
        color: colors.llevoleBlue
    },
    inputStyle: communStyles.inputStyle
});




