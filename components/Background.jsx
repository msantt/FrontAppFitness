import { View, StyleSheet, Animated, Easing } from 'react-native';
import React, { useRef, useEffect } from 'react';

export default function BackgroundDefault({ children }) {

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
        backgroundColor: '#212020',
        justifyContent: 'center',
        alignItems: 'center',
    },
})