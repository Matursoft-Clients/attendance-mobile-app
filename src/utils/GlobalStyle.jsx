import { StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";
import AppUtil from "./AppUtil";

export default StyleSheet.create({
    initialFont: {
        fontFamily: 'opensans',
        color: '#414141'
    },
    textPrimary: {
        color: AppUtil.primary
    }
})