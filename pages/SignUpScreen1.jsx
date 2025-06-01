import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import Background from '../components/Background';
import TextComponent from '../components/Text';

export function SignUpScreen1() {
    return (
        <Background>
            <View>
                <TextComponent style={{ fontSize: 45, }}>
                    Cadastro
                </TextComponent>
                <View>
                    <TextComponent style={{ fontSize: 18, padding: 20, color: '#00D95F' }}>
                        Antes de começar, precisamos de algumas informações para personalizar sua jornada fitness.
                    </TextComponent>
                </View>
            </View>
        </Background>
    )
}