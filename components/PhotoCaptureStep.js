import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, typography, spacing, borderRadius, shadows } from "../styles/theme";
import CustomButton from './CustomButton';

const PhotoCaptureStep = ({ onPhotoCapture, capturedPhoto }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        onPhotoCapture(photo);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível capturar a foto');
      }
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check-In</Text>
        <Text style={styles.subtitle}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check-In</Text>
        <Text style={styles.subtitle}>Captura de foto</Text>
        <Text style={styles.permissionText}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <CustomButton title="Permitir Câmera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In</Text>
      <Text style={styles.subtitle}>Captura de foto</Text>
      
      <View style={styles.cameraContainer}>
        {capturedPhoto ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: capturedPhoto.uri }} style={styles.capturedImage} />
            <View style={styles.successOverlay}>
              <View style={styles.successBadge}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
            </View>
          </View>
        ) : (
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
      </View>

      <CustomButton
        title={capturedPhoto ? "Avançar" : "Capturar Foto"}
        onPress={capturedPhoto ? () => onPhotoCapture(capturedPhoto) : takePicture}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  permissionText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cameraContainer: {
    width: 280,
    height: 280,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlayLight,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  cameraIconText: {
    fontSize: 32,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  successOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  successBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  successIcon: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
});

export default PhotoCaptureStep;

