import { ActivityIndicator, Dimensions, View } from "react-native";
import AppUtil from "../utils/AppUtil";

export default function LoadingSpinnerComponent() {
    return (
        <View
            style={{ position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999999999999999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <ActivityIndicator size="large" color={AppUtil.primary} />
        </View>
    )
}