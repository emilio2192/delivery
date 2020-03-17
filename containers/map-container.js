import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, Animated } from 'react-native';
import MapInput from '../components/map-input';
import MyMapView from '../components/map-view';
import { getLocation } from '../services/location-service';
import Ionicons from '@expo/vector-icons/Ionicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { LocationInformation } from '../components/LocationInformation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let savedRegion;

class MapContainer extends React.Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        region: {},
        bounceValue: new Animated.Value(Dimensions.get('window').height - 50),
        opacityValue: new Animated.Value(0),
        isHidden: true,
        brief: '',
        address: ''
    };

    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.location) {
            const location = {
                latitude: this.props.navigation.state.params.location.lat,
                longitude: this.props.navigation.state.params.location.lng
            };
            this.updateState(location);
            this._toggleSubview();
        } else {
            this.getInitialState();
        }
    }

    getInitialState() {
        getLocation().then(data => {
            this.updateState({
                latitude: data.latitude,
                longitude: data.longitude,
            });
        });
    }

    updateState(location) {
        savedRegion = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
        }
        this.setState({
            region: savedRegion,
        });
    }

    getCoordsFromName(loc) {
        this.updateState({
            latitude: loc.lat,
            longitude: loc.lng,
        });
    }

    _toggleSubview() {
        var toValue = Dimensions.get('window').height - 50;
        var opacity = 0;
        if (this.state.isHidden) {
            toValue = 0;
            opacity = 1;
        }
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();
        Animated.spring(
            this.state.opacityValue,
            {
                toValue: opacity,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();
        this.setState({
            isHidden: !this.state.isHidden,
            region: savedRegion
        });
    }

    onMapRegionChange(region) {
        savedRegion = region;
    }

    render() {
        const { goBack } = this.props.navigation;
        let inputWidth = Dimensions.get('window').width - 48;
        let height = Dimensions.get('window').height;
        return (
            <KeyboardAwareScrollView
                style={styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => goBack()}
                >
                    <EvilIcons name="chevron-left" color="black" size={28} />
                </TouchableOpacity>
                <View style={[styles.searchContainer, { width: inputWidth, zIndex: 20, position:'absolute' }]}>
                    <EvilIcons name="search" size={18} color="#151515" style={{ position: 'absolute', zIndex: 11, left: 20 }} />
                    <MapInput notifyChange={loc => this.getCoordsFromName(loc)} style={{position:'absolute', zIndex:20}} />
                </View>
                <Image
                    source={require('../assets/images/marker.png')}
                    style={[styles.marker, { top: (height / 2) - 20 }]}
                />
                {this.state.region['latitude'] ? (
                    <View style={{ flex: 1 }}>
                        <MyMapView
                            region={this.state.region}
                            onRegionChange={(reg) => this.onMapRegionChange(reg)}
                        />
                    </View>
                ) : null}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this._toggleSubview()}>
                    <Ionicons name="ios-arrow-round-forward" color="white" size={40} />
                </TouchableOpacity>
                <Animated.View
                    style={[
                            styles.subViewContainer,
                            this.state.isHidden ? {zIndex: -1} : {zIndex: 14, elevation: 14},
                            {opacity: this.state.opacityValue}
                        ]}>
                </Animated.View>
                <Animated.View
                        style={[styles.subView,
                            this.state.isHidden ? {} : {elevation: 15},
                        { transform: [{ translateY: this.state.bounceValue }] }]}
                    >
                        <LocationInformation
                            notifyChange={() => this._toggleSubview()}
                            region={this.state.region}
                            navigation={this.props.navigation}
                            brief={this.props.navigation.state.params ? this.props.navigation.state.params.location.brief : ''}
                            address={this.props.navigation.state.params ? this.props.navigation.state.params.location.address : ''}
                            index={this.props.navigation.state.params ? this.props.navigation.state.params.index : 0}
                        />
                    </Animated.View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subViewContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        opacity: 0,
        zIndex: -1,
    },
    subView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        height: Dimensions.get('window').height - 50,
        zIndex: 15
    },
    backButton: {
        position: 'absolute',
        top: 70,
        left: 24,
        zIndex: 10,
        backgroundColor: 'white',
        height: 50,
        width: 50,
        borderRadius: 50,
        color: '#424242',
        shadowColor: '#d6d6d6',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchContainer: {
        position: 'absolute',
        top: 140,
        alignSelf: 'center',
        height: 50,
        zIndex: 10,
        paddingVertical: 15,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#d6d6d6',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    searchInput: {
        color: '#151515',
        height: 50,
        flex: 1,
        marginRight: 30
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 75,
    },
    marker: {
        zIndex: 9,
        top: 20,
        position: 'absolute',
        alignSelf: 'center',
        width: 65,
        height: 65,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
        shadowColor: '#F9B232',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
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
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 13
    },
});


export default MapContainer;
