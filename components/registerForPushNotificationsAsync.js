import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import server from '../constants/Server';
import endpoints from '../constants/Endpoints';
const PUSH_ENDPOINT = server.domain+endpoints.registerDevice;

export default async function registerForPushNotificationsAsync(userId, tokenJWT) {
    // Permissions.getAsync(Permissions.Notifications);
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Get the token that identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    try {
        console.log("-----//---");
        console.log(token);
        return fetch(PUSH_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : tokenJWT
            },
            body: JSON.stringify({
                tokenDeviceId: token
            }),
        });
    } catch (e) {
        return e;
        console.error(e);
    }

}