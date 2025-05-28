import {View, StyleSheet} from 'react-native';


export default function BackgroundDefault({children}) {
    return (
        <View style={styles.background}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#212020', // Default background color
    },
});
