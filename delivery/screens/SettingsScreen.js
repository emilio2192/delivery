import React from 'react';
import {ExpoConfigView} from '@expo/samples';
import {Image, StyleSheet, View, ScrollView, Text, SafeAreaView, StatusBar} from "react-native";
import communStyles from "../constants/CommunStyles";

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return (
            <SafeAreaView
                style={{ flex: 1, backgroundColor: '#F4F4F4' }}
                forceInset={{ top: 'never' }}
                style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.rowImage}>
                    <Image style={styles.logo}
                           source={require('../assets/images/logo.png')}/>
                </View>
                <ScrollView style={styles.content}>
                    <View>
                        <Text style={styles.title}>Titulo 1</Text>
                        <Text style={styles.text}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper molestie libero, quis
                            pellentesque nibh tristique et. Sed feugiat ipsum vitae turpis porttitor vulputate. Sed eget
                            condimentum neque. Cras justo tellus, tempor quis porttitor sit amet, placerat a ipsum.
                            Praesent
                            quis porta mi, in scelerisque risus. Sed eu massa bibendum, luctus tortor eget, lacinia
                            nulla.
                            Etiam in viverra augue, vel lobortis velit. Donec quis urna non augue bibendum lacinia ut
                            euismod sapien. Sed magna nisi, placerat nec fringilla id, aliquet vitae dui. Quisque a
                            fermentum arcu. Nam euismod mauris quis turpis malesuada, quis venenatis nulla efficitur.
                            Sed mi
                            nisi, efficitur vel elementum eleifend, mollis in metus. Vestibulum eu volutpat massa.
                        </Text>
                        <Text style={styles.text}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper molestie libero, quis
                            pellentesque nibh tristique et. Sed feugiat ipsum vitae turpis porttitor vulputate. Sed eget
                            condimentum neque. Cras justo tellus, tempor quis porttitor sit amet, placerat a ipsum.
                            Praesent
                            quis porta mi, in scelerisque risus. Sed eu massa bibendum, luctus tortor eget, lacinia
                            nulla.
                            Etiam in viverra augue, vel lobortis velit. Donec quis urna non augue bibendum lacinia ut
                            euismod sapien. Sed magna nisi, placerat nec fringilla id, aliquet vitae dui. Quisque a
                            fermentum arcu. Nam euismod mauris quis turpis malesuada, quis venenatis nulla efficitur.
                            Sed mi
                            nisi, efficitur vel elementum eleifend, mollis in metus. Vestibulum eu volutpat massa.
                        </Text>
                        <Text style={styles.text}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper molestie libero, quis
                            pellentesque nibh tristique et. Sed feugiat ipsum vitae turpis porttitor vulputate. Sed eget
                            condimentum neque. Cras justo tellus, tempor quis porttitor sit amet, placerat a ipsum.
                            Praesent
                            quis porta mi, in scelerisque risus. Sed eu massa bibendum, luctus tortor eget, lacinia
                            nulla.
                            Etiam in viverra augue, vel lobortis velit. Donec quis urna non augue bibendum lacinia ut
                            euismod sapien. Sed magna nisi, placerat nec fringilla id, aliquet vitae dui. Quisque a
                            fermentum arcu. Nam euismod mauris quis turpis malesuada, quis venenatis nulla efficitur.
                            Sed mi
                            nisi, efficitur vel elementum eleifend, mollis in metus. Vestibulum eu volutpat massa.
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.title}>Titulo 2</Text>
                        <Text style={styles.text}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper molestie libero, quis
                            pellentesque nibh tristique et. Sed feugiat ipsum vitae turpis porttitor vulputate. Sed eget
                            condimentum neque. Cras justo tellus, tempor quis porttitor sit amet, placerat a ipsum.
                            Praesent
                            quis porta mi, in scelerisque risus. Sed eu massa bibendum, luctus tortor eget, lacinia
                            nulla.
                            Etiam in viverra augue, vel lobortis velit. Donec quis urna non augue bibendum lacinia ut
                            euismod sapien. Sed magna nisi, placerat nec fringilla id, aliquet vitae dui. Quisque a
                            fermentum arcu. Nam euismod mauris quis turpis malesuada, quis venenatis nulla efficitur.
                            Sed mi
                            nisi, efficitur vel elementum eleifend, mollis in metus. Vestibulum eu volutpat massa.
                        </Text>
                        <Text style={styles.text}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper molestie libero, quis
                            pellentesque nibh tristique et. Sed feugiat ipsum vitae turpis porttitor vulputate. Sed eget
                            condimentum neque. Cras justo tellus, tempor quis porttitor sit amet, placerat a ipsum.
                            Praesent
                            quis porta mi, in scelerisque risus. Sed eu massa bibendum, luctus tortor eget, lacinia
                            nulla.
                            Etiam in viverra augue, vel lobortis velit. Donec quis urna non augue bibendum lacinia ut
                            euismod sapien. Sed magna nisi, placerat nec fringilla id, aliquet vitae dui. Quisque a
                            fermentum arcu. Nam euismod mauris quis turpis malesuada, quis venenatis nulla efficitur.
                            Sed mi
                            nisi, efficitur vel elementum eleifend, mollis in metus. Vestibulum eu volutpat massa.
                        </Text>
                        <Text style={styles.text}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper molestie libero, quis
                            pellentesque nibh tristique et. Sed feugiat ipsum vitae turpis porttitor vulputate. Sed eget
                            condimentum neque. Cras justo tellus, tempor quis porttitor sit amet, placerat a ipsum.
                            Praesent
                            quis porta mi, in scelerisque risus. Sed eu massa bibendum, luctus tortor eget, lacinia
                            nulla.
                            Etiam in viverra augue, vel lobortis velit. Donec quis urna non augue bibendum lacinia ut
                            euismod sapien. Sed magna nisi, placerat nec fringilla id, aliquet vitae dui. Quisque a
                            fermentum arcu. Nam euismod mauris quis turpis malesuada, quis venenatis nulla efficitur.
                            Sed mi
                            nisi, efficitur vel elementum eleifend, mollis in metus. Vestibulum eu volutpat massa.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
        backgroundColor: '#F9F9F9'
    },
    row: {
        height: 70,
        paddingTop: 10
    },
    logo: {
        resizeMode: 'contain',
        width: 250,
        height: 100,
        alignItems: 'center',
        marginBottom: 25,
    },
    content: {
        width: '100%'
    },
    rowImage: {
        height: 100,
        paddingBottom: 15
    },
    rowLink: {
        height: 40,
        paddingTop: 5
    },
    btnLogin: communStyles.btnPrincipal,
    register: {
        fontSize: 16,
        color: '#009ADE',
        textAlign: 'center'
    },
    inputStyle: communStyles.inputStyle,
    textInput: {
        color: '#3E3E3E',
        paddingTop: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        paddingHorizontal: 24,
        alignContent: 'flex-start'
    },
    subTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        alignContent: 'flex-start'
    },
    text: {
        fontSize: 10,
        paddingBottom: 15,
        alignContent: 'stretch',
        paddingHorizontal: 24
    }
});

