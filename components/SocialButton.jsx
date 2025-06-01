import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function SocialButton({ onPress, icon, style }) {
    return (
        <TouchableOpacity style={[styles.box, style]} onPress={onPress}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 60,
        height: 60,
        backgroundColor: '#4F4F4F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    icon: {
        width: 36,
        height: 36,
    },
});