import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    AsyncStorage,
    Alert
} from 'react-native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { NavigationEvents } from 'react-navigation';
import Ionicons from '@expo/vector-icons/Ionicons';
import {LinearGradient } from 'expo';
import * as SQLite from 'expo-sqlite';
import { ScrollView } from 'react-native-gesture-handler';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Colors from '../../constants/Colors';

const db = SQLite.openDatabase('db.db');

export class Payment extends React.Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        cards: [],
        selected: -1,
        primary: null
    }

    constructor(props) {
        super(props);
    }

    async _fetchPaymentMethods() {
        try {
            this._toggleCardOptions(-1);
            db.transaction(tx => {
                tx.executeSql('select * from payment_method', [], (_, { rows }) => {
                    this.setState({
                        cards: rows._array
                    });
                });
            });   
            this._fetchPrimaryCard();
        } catch (error) { }
    }

    async _fetchPrimaryCard() {
        try {
            const primary = await AsyncStorage.getItem('selectedCard');
            this.setState({ primary });
        } catch (error) { }
    }

    _toggleCardOptions(index) {
        this.setState({ selected: index });
    }

    async _setPrimaryCard(primary) {
        try {
            await AsyncStorage.setItem('selectedCard', primary);
            this.setState({ primary });
            this._toggleCardOptions(-1);
        } catch (error) { }
    }

    async _deleteCard(number) {
        db.transaction(tx => {
            tx.executeSql('delete from payment_method where number = ?;', [number]);
            this._fetchPaymentMethods();
            this._toggleCardOptions(-1);
        });
        const selected = await AsyncStorage.getItem('selectedCard');
        if(selected === number){
            await AsyncStorage.setItem('selectedCard', 'cash');
        }
        
    }

    _deleteCardConfirm(number) {
        Alert.alert(
            'Eliminar método de pago',
            '¿Estás seguro que deseas eliminar esta tarjecta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {text: 'Sí, eliminar', onPress: () => this._deleteCard(number)}
            ],
            {cancelable: true},
        );
    }

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this._fetchPaymentMethods()} />
                <ScreenHeader title="Pago" navigation={this.props.navigation} />
                <StatusBar barStyle="dark-content" />
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => this.props.navigation.navigate('AddPayment')}>
                    <Ionicons name="ios-add" color="white" size={36} />
                </TouchableOpacity>
                <ScrollView style={styles.body}>
                    <Text style={styles.sectionTitle}>TARJETAS</Text>
                    {   
                        this.state.cards.map((card, index) => (
                            <View key={index}>
                                <TouchableOpacity onPress={() => this._toggleCardOptions(index)}>
                                    <LinearGradient
                                        colors={this.state.primary === card.number ? 
                                            [Colors.DARK, Colors.YELLOW] : ['#7a7a7a', '#424242']}
                                        style={styles.card}
                                        start={{ x: 0, y: 0.75 }}
                                        end={{ x: 1, y: 0.25 }}>
                                        <Image
                                            source={card.type === 'visa' ? require('../../assets/images/visa.png') : 
                                                    card.type === 'master-card' ? require('../../assets/images/master-card.png') : 
                                                    card.type === 'american-express' ? require('../../assets/images/master-card.png') : 
                                                    require('../../assets/images/master-card.png')}
                                            style={styles.brand}
                                        />
                                        {this.state.primary === card.number &&
                                            <Text style={[styles.cardLabel, {position: 'absolute', top: 18, right: 18}]}>TARJETA PREDETERMINADA</Text>
                                        }
                                        <View style={{ marginBottom: 10, marginVertical: 60 }}>
                                            <Text style={styles.cardLabel}>CARD NUMBER</Text>
                                            <View style={styles.cardInput}>
                                                <Text style={styles.inputText}>• • • •</Text>
                                                <Text style={styles.inputText}>• • • •</Text>
                                                <Text style={styles.inputText}>• • • •</Text>
                                                <Text style={styles.inputText}>{card.number.split(' ')[3]}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View>
                                                <Text style={styles.cardLabel}>EXPIRY DATE</Text>
                                                <View style={styles.cardInput}>
                                                    <Text style={styles.inputText}>{card.expiry}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.cardLabel}>CVV</Text>
                                                <View style={styles.cardInput}>
                                                    <Text style={styles.inputText}>{card.cvc}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                                {this.state.selected === index && 
                                    <TouchableOpacity
                                        style={styles.optionsLayer}
                                        onPress={() => this._toggleCardOptions(-1)}>
                                        <TouchableOpacity
                                            style={styles.optionButton}
                                            onPress={() => this._setPrimaryCard(card.number)}>
                                            <Ionicons name="ios-checkmark" size={24} color='black'/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.optionButton}
                                            onPress={() => this.props.navigation.navigate('AddPayment', { card })}>
                                            <EvilIcons name="pencil" size={24} color='black'/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.optionButton, {backgroundColor: '#ea4141'}]}
                                            onPress={() => this._deleteCardConfirm(card.number)}>
                                            <EvilIcons name="trash" size={24} color='white'/>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                }
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    brand: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        position: 'absolute',
        top: 15,
        left: 20
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#98CC33',
        padding: 10,
        width: 65,
        height: 65,
        borderRadius: 50,
        shadowColor: '#98CC33',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 25
    },
    body: {
        padding: 16,
        marginBottom: 50
    },
    sectionTitle: {
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#C2C2C2',
        marginBottom: 10,
        fontFamily: 'roboto-bold'
    },
    card: {
        marginBottom: 20,
        padding: 18,
        shadowColor: '#d6d6d6',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        elevation: 5,
        alignSelf: 'stretch',
        backgroundColor: 'white',
        borderRadius: 5
    },
    cardLabel: {
        color: 'white',
        fontSize: 10,
        marginBottom: 5,
        fontFamily: 'roboto-light'
    },
    cardInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'roboto'
    },
    optionsLayer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: 20,
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionButton: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
