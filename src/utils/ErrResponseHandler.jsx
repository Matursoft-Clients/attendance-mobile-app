import { useToast } from "react-native-toast-notifications"

export default {
    handle: (err) => {
        const toast = useToast()

        if (err.response.status == 422) {
            toast.show(err.response.data.msg, {
                type: 'danger',
                placement: 'center'
            })
        }
    }
} 