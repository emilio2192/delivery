import React from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export class MinimalCreditCard extends React.Component {
    render() {
        const { card, type } = this.props;
        return (
            <View style={styles.card}>
                {type === 'card' && <Image
                    source={card.type === 'visa' ? require('../assets/images/visa.png') :
                            card.type === 'master-card' ? require('../assets/images/master-card.png') :
                            card.type === 'american-express' ? require('../assets/images/master-card.png') :
                                require('../assets/images/master-card.png')}
                    style={styles.cardType} />}
                {type === 'cash' && <Ionicons name="ios-cash" size={16} color={Colors.DARK} style={{marginRight: 15}}/>}
                {type === 'card' && <Text style={{ color: Colors.DARK, fontSize: 16, fontFamily: 'roboto-bold' }}>•••• •••• •••• {card.number.split(' ')[3]}</Text>}
                {type === 'cash' && <Text style={styles.cardNumber}>EFECTIVO</Text>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        alignSelf: 'stretch'
    },
    cardType: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 15
    },
    cardNumber: {
        fontFamily: 'roboto-bold',
        fontSize: 14,
        color: Colors.DARK
    }
});
