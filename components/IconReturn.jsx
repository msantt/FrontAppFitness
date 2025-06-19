import { StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get('window');

export default function IconReturn({ onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.iconContainer, style]}>
            <Ionicons name="arrow-back" size={width * 0.06} color="#FFFFFF" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        padding: 10,
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
});
