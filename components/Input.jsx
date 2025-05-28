import { TextInput, StyleSheet } from 'react-native';

export default function Input({ value, onChangeText, placeholder, style, ...props }) {
    return (
        <TextInput
            style={[styles.input, style]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: 400,
        height: 80,
        borderWidth: 10,
        borderColor: '#565656',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom:20,
        marginTop: 10,
        fontSize: 22,
        backgroundColor: '#565656',
    },
});