import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function IconReturn({ onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.iconContainer, style]}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
    );
}