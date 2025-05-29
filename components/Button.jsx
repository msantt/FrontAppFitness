import { TouchableOpacity } from "react-native";
import { Text, StyleSheet } from "react-native";

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
        //{/* //fontFamily: "./assets/fonts/Reght.ttf", */}
        width: 350,
        height: 60,
        backgroundColor: '#1DB954',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    text: {
        zIndex: 1,
        //{/* fontFamily: "Rightous-Regular",*/}
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