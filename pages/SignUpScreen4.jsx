import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Função para responsividade
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;



export function SignUpScreen4({ navigation }) {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0]);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2a2a2a" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={moderateScale(24)} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Cadastro</Text>
                <Text style={styles.subtitle}>Configurar Perfil</Text>
            </View>

            {/* Profile Picture */}
            <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <View style={styles.profileImage}>
                        <Icon name="person" size={moderateScale(50)} color="#666" />
                    </View>
                    <View style={styles.greenDot} />
                </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="person" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nome Completo"
                        placeholderTextColor="#888"
                        value={nomeCompleto}
                        onChangeText={setNomeCompleto}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#888"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon
                            name={showPassword ? "visibility" : "visibility-off"}
                            size={moderateScale(20)}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.phoneContainer}>
                        <View style={styles.countryCode}>
                            <Image
                                source={{ uri: 'https://flagcdn.com/w20/br.png' }}
                                style={styles.flag}
                            />
                            <Icon name="keyboard-arrow-down" size={moderateScale(16)} color="#666" />
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="Telefone"
                            placeholderTextColor="#888"
                            value={telefone}
                            onChangeText={setTelefone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2a2a',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(30),
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(20),
    },
    backButton: {
        padding: scale(5),
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    title: {
        fontSize: moderateScale(32),
        fontWeight: '600',
        color: '#fff',
        marginBottom: verticalScale(5),
    },
    subtitle: {
        fontSize: moderateScale(18),
        color: '#fff',
        fontWeight: '400',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(50),
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
        backgroundColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greenDot: {
        position: 'absolute',
        bottom: scale(8),
        right: scale(8),
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: '#4CAF50',
        borderWidth: scale(3),
        borderColor: '#2a2a2a',
    },
    formContainer: {
        paddingHorizontal: scale(20),
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a3a3a',
        borderRadius: scale(12),
        marginBottom: verticalScale(20),
        paddingHorizontal: scale(15),
        height: verticalScale(60),
        minHeight: 50, // Altura mínima para telas pequenas
    },
    inputIcon: {
        marginRight: scale(12),
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: moderateScale(16),
    },
    eyeIcon: {
        padding: scale(8),
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: scale(12),
    },
    flag: {
        width: scale(20),
        height: scale(15),
        marginRight: scale(5),
    },
    phoneInput: {
        flex: 1,
        color: '#fff',
        fontSize: moderateScale(16),
    },
    buttonContainer: {
        paddingHorizontal: scale(20),
        paddingBottom: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(20),
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        borderRadius: scale(25),
        height: verticalScale(55),
        minHeight: 50, // Altura mínima para garantir usabilidade
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});