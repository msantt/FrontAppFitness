
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

export default function BackgroundWelcome({ children }) {
    return (

        <ImageBackground
            style={styles.background}
            source={require('../assets/imagens/imagemBackground.jpg')}
            resizeMode="cover"
        >
            <View style={styles.overlay} />
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        zIndex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 0,
    }
});
