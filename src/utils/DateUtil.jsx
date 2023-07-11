export default {
    getCurrentYear: () => {
        const dateObj = new Date()
        return dateObj.getFullYear()
    },
    getCurrentMonth: () => {
        const dateObj = new Date()
        const monthNumber = dateObj.getMonth()

        return monthNumber + 1 > 9 ? monthNumber + 1 : `0${monthNumber + 1}`
    },
    getCurrentDate: () => {
        const dateObj = new Date()
        const dateNumber = dateObj.getDate()

        return dateNumber > 9 ? dateNumber : `0${dateNumber}`
    },
    getCurrentMonthName: () => {
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dateObj = new Date()
        const monthNumber = dateObj.getMonth()

        return monthNames[monthNumber]
    },
}