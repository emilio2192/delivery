import React from 'react';
import { Text, StyleSheet, TextInput, View, TouchableOpacity, Dimensions, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

let goBack;

export class LocationInformation extends React.Component {

    state = {
        address: '',
        brief: ''
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.brief !== '') {
            this.setState({
                brief: this.props.brief,
                address: this.props.address
            });
        }
    }

    async _saveLocation() {
        try {
            const location = {
                address: this.state.address,
                brief: this.state.brief,
                disable: 'false',
                effectAllowed: 'move',
                lat: this.props.region.latitude,
                lng: this.props.region.longitude,
                priority: '1',
                status: '1'
            }
            const locations = await AsyncStorage.getItem('locations');
            if (this.props.brief === '') {
                if (locations) {
                    locationsParsed = JSON.parse(locations);
                    locationsParsed.push(location);
                    await AsyncStorage.setItem('locations', JSON.stringify(locationsParsed));
                } else {
                    await AsyncStorage.setItem('locations', JSON.stringify([location]));
                }
            } else {
                locationsParsed = JSON.parse(locations);
                locationsParsed[this.props.index] = location;
                await AsyncStorage.setItem('locations', JSON.stringify(locationsParsed));
            }
            goBack();
        } catch (error) { }
    }

    render() {
        let inputWidth = Dimensions.get('window').width - 48;
        goBack = this.props.navigation.goBack;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{fontWeight: 'bold', fontFamily: 'roboto-bold'}}>LOCATION INFORMATION</Text>
                    <TouchableOpacity
                        onPress={() => this.props.notifyChange()}
                    >
                        <EvilIcons name="chevron-down" size={30} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <Text style={styles.placeholder}>DIRECCIÓN</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(address) => this.setState({address})}
                        value={this.state.address}
                        placeholder="Escribe la dirección específica"
                    />
                    <Text style={styles.placeholder}>ASUNTO</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(brief) => this.setState({brief})}
                        value={this.state.brief}
                        placeholder="Indicaciones extras"
                    />
                    <TouchableOpacity
                        style={[styles.saveButton, {width: inputWidth}]}
                        onPress={() => this._saveLocation()}
                        disabled={this.state.brief === ''  && this.state.address === ''}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>GUARDAR DESTINO</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    placeholder: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 10,
        color: '#C1C1C1',
        fontFamily: 'roboto'
    },
    input: {
        height: 45,
        borderColor: '#e8e8ed',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f2f2f7',
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15
    },
    body: {
        flex: 1,
        padding: 24,
    },
    header: {
        height: 60,
        borderBottomColor: '#e8e8ed',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center' 
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#98CC33',
        padding: 10,
        height: 50,
        borderRadius: 5,
        shadowColor: '#98CC33',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 10,
        alignSelf: 'center',
        zIndex: 50,
        fontFamily: 'roboto-bold'
    },
});