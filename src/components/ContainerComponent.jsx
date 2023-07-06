import { Props } from "@ui-kitten/components/devsupport/services/props/props.service"
import { View } from "react-native"
import {
    setCustomText,
} from 'react-native-global-props';

function ContainerComponent({ children }) {

    setCustomText({
        style: {
            fontFamily: 'OpenSans',
            color: 'red'
        }
    })

    return (
        <View
            style={{ paddingHorizontal: 25, backgroundColor: '#FFF', paddingVertical: 20 }}
        >
            {children}
        </View>
    )
}

export default ContainerComponent