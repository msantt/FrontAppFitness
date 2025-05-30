import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import TextComponent from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';

import BackgroundDefault from '../components/BackgroundDefault';
import TextLink from '../components/Links';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SignUpScreen4() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');

    return (
        <View>




        </View>
    )
}