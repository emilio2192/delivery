import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    Alert,
    AsyncStorage
} from 'react-native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { NavigationEvents } from 'react-navigation';
import * as SQLite from 'expo-sqlite';
import { CreditCardInput } from "react-native-credit-card-input";

const db = SQLite.openDatabase('db.db');

export class AddPayment extends React.Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        validCard: false,
        card: {},
        saveButton: 'AGREGAR',
        additionalInputsProps: {}
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                `create table if not exists payment_method (
                    number text primary key not null,
                    expiry text,
                    cvc text,
                    type text
                );`
            );
        });
        if (this.props.navigation.state.params && this.props.navigation.state.params.card) {
            const card = this.props.navigation.state.params.card;
            this.setState({ 
                card,
                saveButton: 'GUARDAR',
                additionalInputsProps: {
                    number: {
                        editable: false
                    }
                } 
            });
            this.CCInput.setValues({
                number: card.number,
                expiry: card.expiry,
                cvc: card.cvc
            });
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.fromNew) {
            this.setState({
                saveButton: 'CONTINUAR',
            });
        }
    }

    _onChange = (form) => {
        this.setState({
            validCard: form.valid,
            card: form.values
        });
    }

    _add(card) {
        try {
            if (this.state.saveButton === 'AGREGAR' || this.state.saveButton === 'CONTINUAR') {
                db.transaction(tx => {
                    tx.executeSql('select * from payment_method where number = ?', [card.number], (_, { rows }) => {
                        if (rows._array.length === 0) {
                            tx.executeSql(`insert into payment_method (number, expiry, cvc, type) values (?, ?, ?, ?)`, [card.number, card.expiry, card.cvc, card.type],
                                async (transaction, result) => {
                                    const selectedCard = await AsyncStorage.getItem('selectedCard');
                                    if (selectedCard === null) {
                                        await AsyncStorage.setItem('selectedCard', card.number);
                                    }
                                    this.props.navigation.state.params && this.props.navigation.state.params.onGoBack(card.number);
                                    this.props.navigation.goBack();
                                },
                                (transaction, error) => {
                                    console.log(error);
                                });
                        } else {
                            Alert.alert('Ya tienes una tarjeta registrada con el mismo número');
                        }
                    });
                });
            } else this._update(card);
        } catch (error) { }
    }

    _update(card) {
        db.transaction(
            tx => {
                tx.executeSql(`update payment_method set expiry = ?, cvc = ? where number = ?;`,
                    [card.expiry, card.cvc, this.props.navigation.state.params.card],
                    (transaction, result) => {
                        this.props.navigation.goBack();
                    });
            }
        )
    }

    // Render any loading content that you like here
    render() {
        const fromNew = this.props.navigation.state.params && this.props.navigation.state.params.fromNew;
        return (
            <View style={styles.container}>
                {!fromNew && <ScreenHeader title={this.state.saveButton === 'GUARDAR' ? "Guardar Pago" : 'Agregar Pago'} navigation={this.props.navigation} />}
                {fromNew && <ScreenHeader title="Agregar Pago" navigation={this.props.navigation} />}
                <StatusBar barStyle="dark-content" />
                <View style={{ marginTop: 25 }}>
                    <CreditCardInput
                        ref={(c) => this.CCInput = c}
                        inputStyle={styles.input}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        onChange={this._onChange}
                        labelStyle={{ color: '#C1C1C1' }}
                        cardImageFront={require('../../assets/images/credit-card.png')}
                        cardImageBack={require('../../assets/images/credit-card-back.png')}
                        allowScroll={true}
                        labels={{ number: "NÚMERO DE TARJETA", expiry: "EXPIRA", cvc: "CVC/CCV" }}
                        additionalInputsProps={this.state.additionalInputsProps}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        !this.state.validCard ? styles.disabledButton : {},
                        { width: Dimensions.get('window').width - 40 }
                    ]}
                    onPress={() => this._add(this.state.card)}
                    disabled={!this.state.validCard}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {this.state.saveButton}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    input: {
        height: 50,
        borderRadius: 3,
        backgroundColor: '#F4F6FA',
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderBottomWidth: 0,
        marginTop: 10
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#98CC33',
        height: 60,
        borderRadius: 2,
        alignSelf: 'center',
        zIndex: 50
    },
    disabledButton: {
        backgroundColor: '#d2d2d2',
    },
});
