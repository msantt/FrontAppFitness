import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const ModalFeedback = ({ visible, type = "success", message, onClose }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.container,
            { opacity, transform: [{ scale }] },
          ]}
        >
          <MaterialIcons
            name={isSuccess ? "check-circle" : "error"}
            size={64}
            color={isSuccess ? "#1DB954" : "#F44336"}
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.title}>
            {isSuccess ? "Sucesso!" : "Erro"}
          </Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const colors = {
  background: "#121212",
  card: "#1E1E1E",
  primary: "#1DB954",
  danger: "#F44336",
  text: "#FFF",
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.8,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
