import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function BackgroundWelcome({ children }) {
    return (

        <ImageBackground
            style={styles.background}
            source={require('../assets/imagens/imagemBackground.jpg')}
            resizeMode="cover"
        >
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
});
