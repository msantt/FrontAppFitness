import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';

import Background from '../components/Background';
import TextComponent from '../components/Text';
import SeletorButton from '../components/SeletorButton';
import WheelSelector from '../components/WheelSelector';

export function SignUpScreen1() {

    const [sexoSelecionado, setSexoSelecionado] = useState('nao_definir');
    const idadeLista = Array.from({ length: 83 }, (_, i) => i + 18); // 18 até 100
    const pesoLista = Array.from({ length: 131 }, (_, i) => i + 40); // 40 até 170 kg
    const alturaLista = Array.from({ length: 81 }, (_, i) => (i + 120) / 100); // 1.20 até 2.00 m

    const [idadeIndex, setIdadeIndex] = useState(0);
    const [pesoIndex, setPesoIndex] = useState(0);
    const [alturaIndex, setAlturaIndex] = useState(0);

    const opcoesSexo = [
        { label: 'Masculino', value: 'masculino' },
        { label: 'Feminino', value: 'feminino' },
        { label: 'Prefiro não \ndefinir', value: 'nao_definir' },
    ];



    const podeContinuar = sexoSelecionado && idadeIndex >= 0 && pesoIndex >= 0 && alturaIndex >= 0;

    return (
        <Background>
            <View style={{ paddingHorizontal: 0.03 * width, paddingVertical: 0.06 * height, alignContent: "space-between", width: '100%' }}>
                <TextComponent style={{ fontSize: 45, marginBottom: 0.04 * height, color: '#00D95F', fontWeight: 'bold' }}>
                    Cadastro
                </TextComponent>

                <View style={{ marginBottom: 0.04 * height, alignItems: 'center' }}>
                    <TextComponent style={styles.subtitulo}>
                        Antes de começar, precisamos de algumas informações para personalizar sua jornada fitness.
                    </TextComponent>
                </View>

                <View >
                    <View style={{ alignItems: 'center', marginBottom: 0.02 * height }}>
                        <TextComponent styles={{ fontSize: 24 }}>GÊNERO</TextComponent>
                    </View>
                    <View styles={{ alignItems: 'center', marginBottom: 0.02 * height, marginTop: 0.09 * height, textAlign: 'center' }}>
                        <SeletorButton
                            options={opcoesSexo}
                            selected={sexoSelecionado}
                            onSelect={setSexoSelecionado}
                        />
                    </View>
                </View>


                <View style={styles.secao}>
                    <Text style={styles.label}>Idade: {idadeLista[idadeIndex]} anos</Text>
                    <WheelSelector
                        data={idadeLista}
                        selectedIndex={idadeIndex}
                        onSelect={setIdadeIndex}
                    />
                </View>

                <View style={styles.secao}>
                    <Text style={styles.label}>Peso: {pesoLista[pesoIndex]} kg</Text>
                    <WheelSelector
                        data={pesoLista}
                        selectedIndex={pesoIndex}
                        onSelect={setPesoIndex}
                    />
                </View>

                <View style={styles.secao}>
                    <Text style={styles.label}>Altura: {alturaLista[alturaIndex].toFixed(2)} m</Text>
                    <WheelSelector
                        data={alturaLista.map(v => v.toFixed(2))}
                        selectedIndex={alturaIndex}
                        onSelect={setAlturaIndex}
                    />
                </View>


                <TouchableOpacity
                    disabled={!podeContinuar}
                    style={[
                        styles.botao,
                        { backgroundColor: podeContinuar ? '#00D95F' : '#A5A5A5' },
                    ]}
                    onPress={() => {
                        // Ação de navegação ou próximo passo
                        console.log({
                            sexoSelecionado,
                            idade: idadeLista[idadeIndex],
                            peso: pesoLista[pesoIndex],
                            altura: alturaLista[alturaIndex].toFixed(2),
                        });
                    }}
                >
                    <Text style={styles.botaoTexto}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    subtitulo: {
        fontSize: 22,
        color: '#00D95F',
        alignSelf: "center",
        textAlign: 'center',
        lineHeight: 30,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2 * width,
        marginBottom: 10 * height,
    },
    secao: {
        marginTop: 40,
        marginBottom: 10 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botao: {
        width: "70%",
        height: "6%",
        backgroundColor: '#1DB954',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: "8%",
        marginBottom: 0.02 * height,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const { width, height } = Dimensions.get('window');