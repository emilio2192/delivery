import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo';
import Animation from '../constants/Animation';
import Colors from '../constants/Colors';
import LottieView from "lottie-react-native";



export class SuccessView extends React.Component {

    state = {
        animation: null
    }

    componentDidMount() {
        this._playAnimation();
    }

    render() {
        return (
            <LinearGradient
                colors={[Colors.CIAN, Colors.CIAN]}
                style={styles.container}
                start={{ x: 0, y: 0.75 }}
                end={{ x: 1, y: 0.25 }}>
                <View style={{ width: 200, height: 200 }}>
                    <LottieView
                        ref={c => this._playAnimation(c)}
                        source={require('../constants/SuccessAnimation.json')}
                        loop={false}
                    />
                </View>
                <Text style={styles.title}>Se ha creado tu orden.</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => this.props.onHomePress()}>
                    <Text style={styles.buttonText}>PÁGINA PRINCIPAL</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: 'roboto-bold',
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        position: 'absolute',
        top: (Dimensions.get('window').height / 2) - 150
    },
    backButton: {
        position: 'absolute',
        top: (Dimensions.get('window').height / 2) + 130,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        borderRadius: 5,
        alignSelf: 'center',
        zIndex: 50,
        borderWidth: 0,
        paddingHorizontal: 60
    },
    buttonText: {
        color: '#3c3f42',
        fontFamily: 'roboto-bold',
        fontSize: 14
    }
});
