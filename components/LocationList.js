import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export class LocationList extends React.Component {
    render() {
        const { location, index } = this.props;
        return (
            <View style={styles.location}>
                {location && <View style={styles.locationIndex}>
                    <Text style={{ fontFamily: 'roboto-bold', color: '#b8c5dd' }}>{index + 1}</Text>
                </View>}
                {location && <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.address}</Text>
                    <Text style={styles.locationDescription}>{location.brief}</Text>
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    locationInfo:{
        paddingRight:5
    },
    location: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginTop: 5
    },
    locationName: {
        color: '#262626',
        fontFamily: 'roboto-semibold',
        fontSize: 16
    },
    locationDescription: {
        color: '#C1C1C1',
        fontFamily: 'roboto',
        fontSize: 10
    },
    locationIndex: {
        marginRight: 20,
        backgroundColor: '#F1F4FA',
        borderRadius: 5,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
});