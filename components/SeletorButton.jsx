import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SeletorButton({ options, selected, onSelect }) {
    return (
        <View style={styles.container}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.button,
                        selected === option.value && styles.selectedButton,
                    ]}
                    onPress={() => onSelect(option.value)}
                >
                    <Text
                        style={[
                            styles.text,
                            selected === option.value && styles.selectedText,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: "space-around", alignItems: "" },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: '#ddd',
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: '#1DB954',
    },
    text: { color: '#000', fontSize: 18, textAlign: "center",alignItems: "center", alignContent: "center"},
    selectedText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', },
});
