import React from 'react';
import {
    AsyncStorage,
    Dimensions,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {ScreenHeader} from '../../components/ScreenHeader';
import * as SQLite from 'expo-sqlite';
import ENDPOINTS from '../../constants/Endpoints';
import Endpoints from '../../constants/Endpoints';
import {gateway} from '../../services/gateway';
import MapViewDirections from 'react-native-maps-directions';
import GOOGLE from "../../constants/Google";
import MapView, {AnimatedRegion, Marker, PROVIDER_GOOGLE, ProviderPropType} from 'react-native-maps';
import Drawer from '../../components/react-native-bottom-drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {MinimalCreditCard} from '../../components/MinimalCreditCard';
import {LocationList} from '../../components/LocationList';
import {SuccessView} from '../../components/SuccessView';
import Colors from '../../constants/Colors';
import {MinimalMethod} from '../../components/MinimalMethod';
import AlertAsync from "react-native-alert-async";
import Ionicons from '@expo/vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import LottieView from "lottie-react-native";


const db = SQLite.openDatabase('db.db');
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 14.6108992;
const LONGITUDE = -90.51908639999999;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export class PaymentScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        coordinates: [],
        isCollapsed: false,
        cards: [],
        primary: 'none',
        coordinate: new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        origin: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
        },
        modalVisible: false,
        sending: false,
        hasPackage: false,
        confirm: false,
        props: this.props.navigation.state.params,
        modalPaymentVisible: false
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const {locations, assignmentId} = this.props.navigation.state.params;
        console.log(assignmentId);
        const coordinates = [];
        locations.forEach(location => {
            coordinates.push({latitude: location.lat, longitude: location.lng});
        });
        // task to refresh location of messenger
        if (this.props.navigation.state.params.active === true) {
            await this._fetchMessengerLocation(assignmentId);
            setInterval(async () => {
                await this._fetchMessengerLocation(assignmentId);
            }, 10 * 1000)
        }
        this.setState({coordinates});
        await this._fetchPaymentMethods();
        await this._fetchPrimaryCard();
        if (this.state.primary === null) {
            this.setState({primary: 'cash'});
        }
        console.log(this.state.coordinates)
    }

    async _hasAvailablePackage(price) {
        try {
            let user = await AsyncStorage.getItem('userInformation');
            user = JSON.parse(user);
            const response = await gateway(Endpoints.GetPackage(user.id), 'GET');
            if (response.packege) {
                this.setState({
                    packageID: response.packege._id,
                    hasPackage: response.packege.TotalAmount >= price
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async _fetchMessengerLocation(assignmentId) {
        const response = await gateway(Endpoints.MessengerLocation, 'POST', {assignmentId});
        if (response) {
            const location = response.location.split(',');
            const messengerLocation = {
                latitude: +location[0],
                longitude: +location[1]
            }
            const {coordinate} = this.state;
            if (Platform.OS === 'android') {
                if (this.marker) {
                    this.marker._component.animateMarkerToCoordinate(messengerLocation, 500);
                }
            } else {
                coordinate.timing(messengerLocation).start();
            }
            this.setState({
                origin: {messengerLocation}
            });
        }
    }

    executeSql = async (sql, params = []) => {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(sql, params, (_, {rows}) => resolve(rows._array), reject)
        }))
    }

    async _fetchPaymentMethods() {
        try {
            const rows = await this.executeSql('select * from payment_method');
            rows.push({number: 'cash'}, {number: 'package'});
            this.setState({
                cards: rows
            });
        } catch (error) {
        }
    }


    async _fetchPrimaryCard() {
        try {
            const primary = await AsyncStorage.getItem('selectedCard');
            this.setState({primary});
        } catch (error) {
        }
    }

    async _getPrice(distance, time) {
        try {
            const body = {distance, time}
            const response = await gateway(ENDPOINTS.price, 'POST', body);
            return response.precio;
        } catch (e) {
            console.log("ERROR ", e);
        }
    }

    async _setPrimaryCard(primary) {
        this.setState({primary});
    }

    async _pay(price) {
        try {
            let body = {
                paymethod: this.state.primary,
                amount: price
            };

            console.log("json del precio ++++++++++++>", body);
            if (this.state.primary === 'package') {
                body.packageId = this.state.packageID;
            } else if (this.state.primary !== 'cash') {
                const rows = await this.executeSql('select * from payment_method where number = ?', [this.state.primary]);
                const card = rows[0];
                body.paymethod = 'cdcard';
                body.cvv = card.cvc;
                body.ccexp = card.expiry.replace('/', '');
                body.ccnumber = card.number.replace(/\s/g, '');
            }
            const response = await gateway(ENDPOINTS.payment, 'POST', body);
            if (response.statusCode === 200 && this.state.primary !== 'cash') {
                return response
            } else if (this.state.primary === 'package') {
                return {packageID: this.state.packageID};
            }
            return {};
        } catch (error) {
            console.log(error)
        }
    }

    async _create(locations, price, subject) {
        try {
            console.log("PRECIO EN CREAR ", price);
            if (this.state.primary === 'none') {
                alert('No se ha seleccionado metodo de pago');
                return;
            }
            const message = (this.state.primary === 'cash') ? 'Esta seguro de pagar con efectivo' : (this.state.primary === 'package') ? 'Esta seguro de pagar con paquete' : 'Esta seguro de pagar con tarjeta';
            const choice = await AlertAsync(
                'Confirmar',
                message,
                [
                    {text: 'Aceptar', onPress: () => Promise.resolve(true)},
                    {text: 'No', onPress: () => Promise.resolve(false)},
                ],
                {
                    cancelable: false,
                    onDismiss: () => Promise.resolve(false),
                },
            );
            if (!choice) {
                return;
            }
            if (this.state.primary === 'cash' && this.state.pointPaymentCash && this.state.indexPointPaymentCash === 99) {
                alert("Seleccione punto donde se pagara");
                return;
            }
            this.setState({sending: true});
            const payment = await this._pay(price);

            const paymentType = (this.state.primary === 'cash' || this.state.primary === 'package') ? this.state.primary : 'cdcard';
            const paymentMethod = paymentType;
            this.forceUpdate();
            const body = {
                paymentType,
                paymentMethod,
                price,
                userMessengerLocations: [],
                locations,
                payment,
                subject
            }
            console.log("CREAR ASIGNACION ++++++++++++++>>>> ",body);
            await gateway(ENDPOINTS.createAssignement, 'POST', body);
            this.setState({modalVisible: true, sending: false});
        } catch (e) {
            console.log(error)
        }
    }

    packageOption = () => {
        if (this.state.hasPackage === true && !this.props.navigation.state.params.readonly) {
            return (
                <MinimalMethod
                    key={index}
                    type="PAQUETE"
                    onPress={() => this._setPrimaryCard('package')}
                    primary={this.isOptionSelected('cash')}
                />
            );
        }
    }
    cashOption = () => {
        if (!this.props.navigation.state.params.readonly) {
            return (
                <MinimalMethod
                    key={'cash'}
                    type="EFECTIVO"
                    onPress={() => this._setPrimaryCard('cash')}
                    primary={this.isOptionSelected('cash')}
                />
            )
        }
    }
    isOptionSelected = (option) => {
        if (this.state.primary === option) {
            return true;
        }
        return false;
    }

    refresh = async (primary) => {
        await this._fetchPaymentMethods();
        this.setState({primary});
    }

    // Render any loading content that you like here
    render() {
        const GOOGLE_MAPS_APIKEY = GOOGLE.apiKey;
        const {locations, subject, readonly} = this.props.navigation.state.params;
        let active = this.props.navigation.state.params.active;
        let _props = {...this.state.props};
        _props['isAssignmentScreen'] = true;
        return (
            // <View><Text>hola</Text></View>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content"/>
                <ScreenHeader title={readonly ? (active ? "Mapa en vivo" : "Resumen") : "Forma de Pago"}
                              navigation={this.props.navigation}/>
                <MapView
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    style={{position: 'absolute', bottom: 0, top: 0, left: 0, right: 0}}
                    customMapStyle={GOOGLE.MinimalMap}
                    provider={PROVIDER_GOOGLE}
                    ref={c => this.mapView = c}>
                    {
                        this.state.coordinates.length >= 2 && active &&
                        <Marker.Animated
                            coordinate={this.state.coordinate}
                            ref={marker => {
                                this.marker = marker;
                            }}>
                            <MaterialIcons name="person-pin-circle" size={30} color="#ffb600"/>
                        </Marker.Animated>
                    }
                    {this.state.coordinates.map((coordinate, index) =>
                        <Marker key={`coordinate_${index}`} coordinate={coordinate}>
                            <MaterialIcons name="place" size={30} color={Colors.YELLOW}/>
                        </Marker>
                    )}
                    {(this.state.coordinates.length >= 2) && (
                        <MapViewDirections
                            origin={active ? this.state.origin.messengerLocation : this.state.coordinates[0]}
                            destination={this.state.coordinates[this.state.coordinates.length - 1]}
                            waypoints={
                                active ? (
                                    (this.state.coordinates.length > 1) ?
                                        this.state.coordinates.slice(0, -1) : null
                                ) : (
                                    (this.state.coordinates.length > 2) ?
                                        this.state.coordinates.slice(1, -1) : null
                                )
                            }
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor={Colors.CIAN}
                            onReady={async result => {
                                const price = await this._getPrice(result.distance, result.duration);
                                // await this._hasAvailablePackage(price);
                                this.setState({price});
                                this.mapView.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        top: 150,
                                        right: 20,
                                        bottom: 600,
                                        left: 10
                                    }
                                });
                            }}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onError={(error) => {
                                console.log(error)
                            }}
                        />
                    )}
                </MapView>
                <Drawer teaserHeight={readonly ? 125 : 300}>
                    <View style={styles.drawerHeader}>
                        <Text style={styles.titlePlaceholder}>TOTAL</Text>
                        <Text style={styles.drawerTitle}>Q {
                            Number.parseFloat(this.state.price ? this.state.price : 0).toFixed(2)
                        }</Text>
                    </View>
                    {!readonly && <View style={{paddingHorizontal: 24}}>
                        <Text style={[styles.titlePlaceholder, {marginBottom: 5, marginTop: 15}]}>SELECCIONA UN MÉTODO
                            DE PAGO</Text>
                        <TouchableOpacity
                            style={[
                                styles.addButton,
                            ]}
                            onPress={() => this.setState({modalPaymentVisible: true})}>
                            {
                                this.state.primary !== 'cash' && this.state.cards.map((card, index) => {
                                    if (card.number === this.state.primary) {
                                        return (
                                            <MinimalCreditCard card={card} type="card" key={index}/>
                                        );
                                    }
                                })
                            }
                            {
                                this.state.primary === 'cash' && <MinimalCreditCard type="cash"/>
                            }
                            <Ionicons name="ios-arrow-forward" color={Colors.DARK} size={16}/>
                        </TouchableOpacity>
                    </View>}
                    <Text style={[styles.titlePlaceholder, {marginBottom: 5, marginTop: 35, marginHorizontal: 24}]}>INFORMACIÓN
                        DE CONTACTO</Text>
                    <View style={{padding: 24, marginHorizontal: 24, backgroundColor: 'white', borderRadius: 5}}>
                        <View style={styles.row}>
                            <Text style={styles.label}>NOMBRE</Text>
                            <Text style={styles.label}>{subject.contactName}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>TELÉFONO</Text>
                            <Text style={styles.label}>{subject.contactPhone}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>ASUNTO</Text>
                            <Text style={styles.label}>{subject.subject}</Text>
                        </View>
                        {

                            locations.map((location, index) => [
                                <LocationList
                                    location={location}
                                    index={index}
                                    key={index}

                                />
                            ])
                        }
                    </View>
                </Drawer>
                {!readonly &&
                <View style={[styles.saveButtonContainer, {width: Dimensions.get('window').width - 24, elevation: 10}]}>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            {width: Dimensions.get('window').width - 48}
                        ]}
                        onPress={() => this._create(locations, this.state.price, subject)}>
                        {!this.state.sending &&
                        <Text style={{color: 'white', fontFamily: 'roboto-bold'}}>CONFIRMAR ORDEN</Text>}
                        {this.state.sending &&
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            source={require('../../constants/sending.json')}
                            loop={true}
                        />
                        }
                    </TouchableOpacity>
                </View>}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => console.log('')}>
                    <SuccessView onHomePress={() => this.props.navigation.navigate('Main')}/>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalPaymentVisible}
                    onRequestClose={() => console.log('')}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setState({modalPaymentVisible: false})}>
                        <Ionicons name="ios-checkmark" color="white" size={40}/>
                    </TouchableOpacity>
                    <ScrollView style={{paddingHorizontal: 24, paddingTop: 50, flex: 1}}>
                        <TouchableOpacity style={{paddingHorizontal: 24}}
                                          onPress={() => this.setState({modalPaymentVisible: false})}>
                            <Ionicons name="ios-close" size={36} color={Colors.DARK}/>
                        </TouchableOpacity>
                        <Text style={styles.labelInfo}>SELECCIONA MÉTODO DE PAGO</Text>
                        {
                            this.state.cards.map((card, index) => {
                                if (card.number !== 'cash' && card.number !== 'package') {
                                    return (
                                        <TouchableOpacity
                                            style={[styles.addButton, {marginTop: 10}]}
                                            onPress={() => this._setPrimaryCard(card.number)}
                                            key={index}>
                                            <MinimalCreditCard card={card} type="card"/>
                                            {card.number === this.state.primary &&
                                            <Ionicons name="ios-checkmark-circle" size={30} color={Colors.GREEN}/>}
                                        </TouchableOpacity>
                                    );
                                }
                            })
                        }
                        <TouchableOpacity
                            style={[styles.addButton, {marginTop: 10}]}
                            onPress={() => {
                                console.log('Setting cash as primary method');
                                this._setPrimaryCard('cash')
                            }}>
                            <MinimalCreditCard type="cash"/>
                            {'cash' === this.state.primary &&
                            <Ionicons name="ios-checkmark-circle" size={30} color={Colors.GREEN}/>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.addButton, {marginTop: 25}]}
                            onPress={() => {
                                this.setState({modalPaymentVisible: false})
                                this.props.navigation.navigate('AddPayment', {
                                    onGoBack: (primary) => this.refresh(primary),
                                })
                            }}>
                            <Text style={{color: Colors.DARK, fontSize: 16, fontFamily: 'roboto-bold'}}>AGREGAR
                                TARJETA</Text>
                            <Ionicons name="ios-add" size={30} color={Colors.DARK}/>
                        </TouchableOpacity>
                    </ScrollView>
                </Modal>
            </View>
        );
    }

    _playAnimation = (anim) => {
        this.lottieAnim = anim;
        if (anim) {
            this.lottieAnim.play();
        }
    };
}

PaymentScreen.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    cardNumber: {
        fontFamily: 'roboto-bold',
        fontSize: 14,
        color: Colors.DARK
    },
    label: {
        fontFamily: 'roboto-bold',
        color: Colors.DARK,
        fontSize: 14
    },
    labelInfo: {
        fontFamily: 'roboto-bold',
        color: Colors.DARK,
        fontSize: 12,
        paddingHorizontal: 24,
        paddingTop: 30
    },
    row: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    drawerHeader: {
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    drawerTitle: {
        fontFamily: 'roboto-bold',
        fontSize: 48,
        color: 'white'
    },
    titlePlaceholder: {
        fontFamily: 'roboto-bold',
        fontSize: 12,
        color: 'white'
    },
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
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.YELLOW,
        borderColor: 'white',
        borderWidth: 2,
        padding: 10,
        height: 60,
        borderRadius: 5,
        fontFamily: 'roboto-bold',
    },
    addButton: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        borderRadius: 5,
        fontFamily: 'roboto-bold',
        alignSelf: 'stretch',
        paddingHorizontal: 24,
        flexDirection: 'row'
    },
    saveButtonContainer: {
        alignItems: 'center',
        backgroundColor: Colors.YELLOW,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        zIndex: 50,
        elevation: 500,
        paddingBottom: 50,
        paddingVertical: 10,
    },
    button: {
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
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 13
    },
});
