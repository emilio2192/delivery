import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import MapContainer from '../containers/map-container';
import { MapAssign } from './Assignements/Map';
import { MyAssignement } from './Assignements/MyAssignements';


export default class App extends React.Component {

    static navigationOptions = {
        header: null,
    };

    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        return (
            <MyAssignement navigation={this.props.navigation}/>
        );
    }
}
