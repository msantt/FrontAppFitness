import { TouchableOpacity, StyleSheet, Text, Dimensions } from "react-native";

const { width } = Dimensions.get('window'); // pega a largura da tela

export default function Button({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        zIndex: 1,
        width: width * 0.9, // 90% da tela, continua grande, mas não ultrapassa
        height: 60,
        backgroundColor: '#1DB954',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    text: {
        zIndex: 1,
        color: "#000000",
        fontSize: 25,
        textAlign: "center",
    },
});



//{/* // --cor-fundo-principal: #1E1E1E;
//--cor-texto-principal: #FFFFFF;
//--cor-verde-destaque: #00D95F;
//--cor-input: #4F4F4F;
//--cor-texto-secundario: #B3B3B3;
//  --cor-fundo-externo: #F2F2F2;
// /*}