// msantt/frontappfitness/FrontAppFitness-MyModificationsSantt/CheckInFlow.jsx
// (Este arquivo não foi fornecido, a resposta assume a estrutura do arquivo com base na sua pergunta e contexto)

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Importe seus estilos e componentes
import { colors, spacing } from "../styles/theme"; // Assumindo que você tem um arquivo de tema
import PhotoCaptureStep from "../components/PhotoCaptureStep";
import LocationStep from "../components/LocationStep";
import LoadingStep from "../components/LoadingStep";
import ConfirmationStep from "../components/ConfirmationStep";

// Adapte esta função para aceitar a prop 'navigation'
const CheckInFlow = ({ navigation }) => { // <--- Adicione 'navigation' aqui
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const steps = [
    {
      component: PhotoCaptureStep,
      props: {
        onPhotoCapture: (photo) => {
          setCapturedPhoto(photo);
          setCurrentStep(1);
        },
        capturedPhoto
      }
    },
    {
      component: LocationStep,
      props: {
        onLocationCapture: (loc) => {
          setLocation(loc);
          setCurrentStep(2);
        },
        location
      }
    },
    {
      component: LoadingStep,
      props: {
        onComplete: () => setCurrentStep(3)
      }
    },
    {
      component: ConfirmationStep,
      props: {
        onConfirm: () => {
          // Reset para o início
          setCurrentStep(0);
          setCapturedPhoto(null);
          setLocation(null);
          // Adicione a navegação para a tela de desafios aqui
          navigation.navigate('DesafiosScreen'); // <--- Adicione esta linha
        },
        capturedPhoto,
        location
      }
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <CurrentStepComponent {...steps[currentStep].props} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});

export default CheckInFlow;