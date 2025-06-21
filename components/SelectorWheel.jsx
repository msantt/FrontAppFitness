import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SelectorWheel({ options, onSelect }) {
    const [selected, setSelected] = useState(0);

    const handleSelect = (index) => {
        setSelected(index);
        if (onSelect) onSelect(options[index]);
    };

    return (
        <FlatList
            data={options}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, idx) => idx.toString()}
            contentContainerStyle={styles.container}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={[
                        styles.item,
                        selected === index && styles.selectedItem
                    ]}
                    onPress={() => handleSelect(index)}
                >
                    <Text style={selected === index ? styles.selectedText : styles.text}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center',
        paddingHorizontal: 10,  // evita as bolas grudadas nas bordas
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: '#eee',
        marginHorizontal: 8,
        minWidth: width * 0.25,  // largura mínima proporcional à tela
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: '#4e8cff',
    },
    text: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});
