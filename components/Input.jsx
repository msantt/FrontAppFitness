import { TextInput, StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // pega a largura da tela

export default function Input({ leftIcon, rightIcon, value, onChangeText, placeholder, style, ...props }) {
    return (
        <View style={[styles.inputContainer, style]}>
            {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                {...props}
            />
            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.9, // 90% da tela
        height: 60,
        borderWidth: 2,
        borderColor: '#565656',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: '#565656',
        alignSelf: 'center', // garante que fique centralizado
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 22,
        color: '#fff',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
});
