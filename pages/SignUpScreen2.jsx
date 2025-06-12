import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import Background from '../components/Background'
import SelectorWheel from '../components/SelectorWheel';

export function SignUpScreen2() {
    const options = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

    return (
        <Background>
            <View>

            </View>
        </Background>
    )
}