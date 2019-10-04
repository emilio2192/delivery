import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export class MinimalMethod extends React.Component {
    render() {
        const { primary, type } = this.props;
        return (
            <TouchableOpacity
                onPress={() => this.props.onPress()}>
                <LinearGradient
                    colors={primary ? [Colors.YELLOW, Colors.YELLOW] : ['#7a7a7a', '#424242']}
                    style={styles.card}
                    start={{ x: 0, y: 0.75 }}
                    end={{ x: 1, y: 0.25 }}>
                    {type === 'EFECTIVO' && <Ionicons name="ios-cash" size={26} color="white"/>}
                    {type === 'PAQUETE' && <Ionicons name="ios-cube" size={26} color="white"/>}
                    <Text style={styles.cardNumber}>{type}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    cardType: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    cardNumber: {
        fontFamily: 'roboto-bold',
        fontSize: 12,
        color: 'white'
    }
});
