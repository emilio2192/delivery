import React from 'react';
import { Dimensions } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Google from '../constants/Google';

class MapInput extends React.Component {
    render() {
        let inputWidth = Dimensions.get('window').width - 48;
        return (
            <GooglePlacesAutocomplete
                placeholder='¿Qué lugar deseas buscar?'
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    this.props.notifyChange(details.geometry.location);
                }
                }
                query={{
                    key: Google.apiKey,
                    language: 'es'
                }}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance'
                }}
    
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={200}
                enablePoweredByContainer={false}
                styles={{
                    container: {
                        zIndex: 10,
                        overflow: 'visible',
                        elevation: 20
                    },
                    textInputContainer: {
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        height: 50,
                        overflow: 'visible',
                        backgroundColor: 'white',
                        borderColor: 'white',
                        borderRadius: 100,
                    },
                    textInput: {
                        backgroundColor: 'white',
                        fontSize: 15,
                        paddingBottom: 0,
                        flex: 1,
                        height: 50,
                        borderRadius: 30,
                        top: -8,
                        paddingLeft: 40
                    },
                    listView: {
                        position: 'absolute',
                        top: 60,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        flex: 1,
                        elevation: 100,
                        zIndex: 100,
                        shadowColor: '#969696',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.8,
                        shadowRadius: 10,
                    },
                    description: {
                        color: '#24292e',
                        paddingRight: 50
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    }
                }}
            />
        );
    }
}

export default MapInput;