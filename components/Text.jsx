import {View, Text, StyleSheet} from 'react-native';

export default function TextComponent({children, style}) {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, style]}>{children}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center",
    },
});