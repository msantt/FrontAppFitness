import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

const DropdownModal = ({ label, value, options, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.id === value);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {selectedOption ? selectedOption.nome : `Selecione ${label.toLowerCase()}`}
        </Text>
        <Text style={styles.dropdownIcon}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma opção disponível</Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#DDD",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#1E1E1E",
  },
  dropdownText: {
    fontSize: 17,
    color: "#EEE",
    flexShrink: 1,
  },
  dropdownIcon: {
    fontSize: 18,
    color: "#888",
    marginLeft: 10,
  },
  placeholder: {
    color: "#888",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 10,
    maxHeight: "50%",
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  modalItemText: {
    color: "#EEE",
    fontSize: 16,
  },
  emptyText: {
    color: "#888",
    padding: 20,
    textAlign: "center",
  },
});
