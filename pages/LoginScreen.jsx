import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import TextComponent from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import BackgroundDefault from "../components/BackgroundDefault";
import TextLink from "../components/Links";
import { apiService } from '../services/api';

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("loginData").then((data) => {
      if (data) {
        const { email, senha } = JSON.parse(data);
        setEmail(email);
        setSenha(senha);
        setLembrar(true);
      }
    });
  }, []);

  const handleLogin = async () => {
  try {
    const resultado = await apiService.login(email, senha);
    console.log('Login realizado com sucesso:', resultado);

    const { token } = resultado;
    if (!token) {
      throw new Error('Token não recebido da API');
    }

    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userEmail', email);

    if (lembrar) {
      await AsyncStorage.setItem('loginEmailLembrado', email);
      await AsyncStorage.setItem('loginSenhaLembrada', senha);
    } else {
      await AsyncStorage.removeItem('loginEmailLembrado');
      await AsyncStorage.removeItem('loginSenhaLembrada');
    }

    navigation.navigate('Home');
  } catch (error) {
    console.error('Falha no login:', error);
    alert('Usuário não foi encontrado.');
  }
};
  return (
    <BackgroundDefault>
      <View style={styles.screen}>
        <View style={styles.topText}>
          <TextComponent style={styles.titleText}>
            Faça Login com{"\n"}Sua Conta
          </TextComponent>
        </View>

        <View style={styles.containerInput}>
          <Input
            leftIcon={
              <Image
                source={require("../assets/imagens/perfil_icon.png")}
                style={styles.icon}
                resizeMode="contain"
              />
            }
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            leftIcon={
              <Image
                source={require("../assets/imagens/senha_icon.png")}
                style={styles.icon}
                resizeMode="contain"
              />
            }
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!senhaVisivel}
            rightIcon={
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Image
                  source={
                    senhaVisivel
                      ? require("../assets/imagens/ver_senha_icon.png")
                      : require("../assets/imagens/ocultar_senha_icon.png")
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setLembrar(!lembrar)}
          >
            <View style={[styles.checkbox, lembrar && styles.checkboxChecked]}>
              {lembrar && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Lembrar meus dados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Entrar" onPress={handleLogin} />
        </View>

        <TextLink style={styles.link} url={"https://youtube.com"}>
          Esqueceu a senha?
        </TextLink>

        <View style={styles.separator}>
          <Text style={styles.line}>______________________</Text>
          <Text style={styles.separatorText}> OU </Text>
          <Text style={styles.line}>______________________</Text>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialBox}>
            <SocialButton
              icon={require("../assets/imagens/apple_icon.png")}
              onPress={() => alert("Login com Apple")}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBox}>
            <SocialButton
              icon={require("../assets/imagens/instagram_icon.png")}
              onPress={() => alert("Login com Instagram")}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBox}>
            <SocialButton
              icon={require("../assets/imagens/google_icon.png")}
              onPress={() => alert("Login com Google")}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TextComponent style={styles.footerText}>
            Ainda não possui conta?{" "}
          </TextComponent>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUpScreen1")}
          >
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundDefault>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.05,
  },
  topText: {
    marginBottom: height * 0.04,
    alignItems: "center",
  },
  titleText: {
    fontSize: width * 0.08,
    textAlign: "center",
    fontWeight: "bold",
  },
  containerInput: {
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  link: {
    marginTop: height * 0.01,
    marginBottom: height * 0.015,
    color: "#1DB954",
    flexDirection: "row",
    fontSize: width / 22,
  },
  icon: {
    width: width * 0.06,
    height: width * 0.06,
  },
  checkbox: {
    width: width * 0.06,
    height: width * 0.06,
    borderWidth: 2,
    borderColor: "#00D95F",
    borderRadius: 6,
    marginRight: width * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1DB954",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
    alignSelf: "flex-start",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  checkboxLabel: {
    color: "#fff",
    fontSize: width * 0.04,
  },
  buttonWrapper: {
    width: "80%",
    marginBottom: height * 0.02,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  socialBox: {
    width: width * 0.14,
    height: width * 0.14,
    backgroundColor: "#4F4F4F",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.05,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.015,
  },
  line: {
    color: "#fff",
  },
  separatorText: {
    marginHorizontal: 8,
    marginTop: 2,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: width * 0.015,
  },
  footerText: {
    fontSize: width * 0.04,
    color: "#fff",
  },
  footerLink: {
    color: "#1DB954",
    fontSize: width * 0.04,
  },
});
