import { createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import {LoginScreen} from "../screens/Login";
import {RegisterScreen} from "../screens/Register";
import {VerificationAccountScreen} from "../screens/VerificationAccount";
import {RequestChangePasswordScreen} from "../screens/RequestChangePassword";
import {ChangePasswordScreen} from '../screens/ChangePassword';

const AuthClientStack = createStackNavigator({
    Register: {screen: RegisterScreen, navigationOptions: {title: "Registro"}},
    Verify: {screen: VerificationAccountScreen, navigationOptions: {title: "Verificación"}},
    RequestChangePass: RequestChangePasswordScreen,
    ChangePassword: ChangePasswordScreen,
    Login: LoginScreen,
}, {initialRouteName: 'Login'});

export default createSwitchNavigator({AuthClientStack});
