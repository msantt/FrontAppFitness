import { Text, TouchableOpacity, StyleSheet, Linking } from "react-native";


export default function TextLink({ children, style, url }) {
    const handlePress = () => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <Text style={[styles.text, style]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Rightous-Regular",
        color: "#FFFFFF",
        fontSize: 22,
        textAlign: "center",
    },
});