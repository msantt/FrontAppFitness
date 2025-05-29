import { View, StyleSheet, Animated, Easing } from 'react-native';
import React, { useRef, useEffect } from 'react';

export default function BackgroundDefault({ children }) {
    // Crie refs para as escalas das bolas
    const scale1 = useRef(new Animated.Value(1)).current;
    const scale2 = useRef(new Animated.Value(1)).current;
    const scale3 = useRef(new Animated.Value(1)).current;
    const scale4 = useRef(new Animated.Value(1)).current;

    // Função para animar uma bola
    const animateBall = (scaleRef, delay = 0) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleRef, {
                    toValue: 1.4,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                    delay,
                }),
                Animated.timing(scaleRef, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        animateBall(scale1, 0);
        animateBall(scale2, 750);
        animateBall(scale3, 1000);
        animateBall(scale4, 1250);
    }, []);

    return (
        <View style={styles.background}>

            <Animated.View
                style={[
                    styles.ball,
                    styles.ball1,
                    { transform: [{ scale: scale1 }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.ball,
                    styles.ball2,
                    { transform: [{ scale: scale2 }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.ball,
                    styles.ball5,
                    { transform: [{ scale: scale2 }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.ball,
                    styles.ball3,
                    { transform: [{ scale: scale3 }] },
                ]}
            />
             <Animated.View
                style={[
                    styles.ball,
                    styles.ball4,
                    { transform: [{ scale: scale1 }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.ball,
                    styles.ball6,
                    { transform: [{ scale: scale3 }] },
                ]}
            />

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
    ball: {
        position: 'absolute',
        borderRadius: 100,
        opacity: 0.25,
    },
    ball1: {
        width: 200,
        height: 200,
        backgroundColor: '#1DB954',
        top: -10,
        left: -2,
    },
    ball2: {
        width: 150,
        height: 150,
        backgroundColor: '#00D95F',
        bottom: 100,
        right: 40,
    },
    ball3: {
        width: 150,
        height: 150,
        backgroundColor: '#00D95F',
        bottom: -100,
        right: 400,
    },
    ball4: {
        width: 150,
        height: 150,
        backgroundColor: '#00D95F',
        bottom: 400,
        right: 300,
    },
    ball5: {
        width: 150,
        height: 150,
        backgroundColor: '#00D95F',
        bottom: 400,
        right: -90,
    },
    ball6: {
        width: 150,
        height: 150,
        backgroundColor: '#00D95F',
        bottom: 800,
        right: -90,
    },
});
