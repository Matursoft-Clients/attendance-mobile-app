import { View } from "react-native"

function ContainerComponent({ children }) {

    return (
        <View
            style={{ paddingHorizontal: 25, backgroundColor: '#FFF', paddingTop: 20, paddingBottom: 35 }}
        >
            {children}
        </View>
    )
}

export default ContainerComponent