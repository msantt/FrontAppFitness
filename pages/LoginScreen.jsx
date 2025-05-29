import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import TextComponent from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';

import BackgroundDefault from '../components/BackgroundDefault';
import TextLink from '../components/Links';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LoginScreen() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [lembrar, setLembrar] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('loginData').then(data => {
            if (data) {
                const { email, senha } = JSON.parse(data);
                setEmail(email);
                setSenha(senha);
                setLembrar(true);
            }
        });
    }, []);

    const usuariosFake = [
        { email: 'teste1@email.com', senha: 'TesteSenha123@' },
        { email: 'teste2@email.com', senha: 'TesteSenha321@' }
    ];

    const handleLogin = () => {
        const usuarioEncontrado = usuariosFake.find((u) => u.email === email && u.senha === senha);
        if (usuarioEncontrado) {
            alert('Login realizado com Sucesso');
        } else {
            alert('Usuario nao foi encontrado.');
        }
    };


    return (
        <BackgroundDefault>
            <View style={styles.screen}>
                <View style={styles.topText}>
                    <TextComponent style={{ fontSize: 45 }}>
                        Faça Login com{"\n"}
                        Sua Conta
                    </TextComponent>
                </View>
                <View style={styles.containerInput}>
                    <View>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        ></Input>
                    </View>
                    <View>
                        <Input
                            placeholder="Senha"
                            value={senha}
                            onChangeText={setSenha}
                        ></Input>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setLembrar(!lembrar)}>
                            <View
                                style={[styles.checkbox, lembrar && styles.checkboxChecked]}>
                                {lembrar && <Text style={styles.checkmark}>✓</Text>}
                            </View>

                            <Text style={styles.checkboxLabel}>Lembrar meus dados</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginBottom: 40, marginTop: -80 }}>
                    <Button
                        title="Entrar"
                        onPress={handleLogin}
                    ></Button>
                </View>
                <View>
                    <TextLink style={styles.link} url={"https://youtube.com"}>esqueceu a senha?</TextLink>
                </View>

                <View style={{ flexDirection: 'row' }} >
                    <Text>_______________________</Text>
                    <Text style={{ marginTop: 4 }}> OU </Text>
                    <Text>_______________________</Text>
                </View>

                // Adicione este trecho onde deseja exibir os boxes de login social
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialBox} onPress={() => alert('Login com Google')}>
                        <Image
                            //{/* source={require('../assets/')}; */}
                            style={styles.socialImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBox} onPress={() => alert('Login com Facebook')}>
                        <Image
                            //{/*//source={require('../assets/')} */}
                            style={styles.socialImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBox} onPress={() => alert('Login com Apple')}>
                        <Image
                            //{/*//source={require('../assets/')} */}
                            style={styles.socialImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.link}>
                    <TextComponent>Ainda não possui Conta? </TextComponent>
                    <TextLink style={styles.link} url={"https://youtube.com"}>Cadastre-se</TextLink>
                </View>


            </View>
        </BackgroundDefault >
    );
};


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        alignItems:'center',
        paddingVertical: 200,
    },
    topText: {
        marginTop: -10,
        fontFamily: 'bold'
    },
    containerInput: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100,
        marginTop: 120,
    },
    link: {
        marginTop: 20,
        marginBottom: 20,
        color: '#1DB954',
        flexDirection: 'row',
        fontSize: 18,
    },
    //{/* Styles para por a checkbox */}
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 3,
        borderColor: '#00D95F',
        borderRadius: 6,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#1DB954',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5,
        marginRight: 180,
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    checkboxLabel: {
        color: '#fff',
        fontSize: 18,
    },
    //{/*Styles para por as imagens */}
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    socialBox: {
        width: 60,
        height: 60,
        backgroundColor: '#4F4F4F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 40,
        elevation: 4, // sombra no Android
        shadowColor: '#000', // sombra no iOS
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    socialImage: {
        width: 36,
        height: 36,
    },
});