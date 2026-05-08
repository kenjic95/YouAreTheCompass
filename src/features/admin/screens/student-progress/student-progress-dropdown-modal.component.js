import React from "react";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import { Text } from "../../../../components/typography/text.component";

export const StudentProgressDropdownModal = ({
  allLabel,
  onClose,
  onSelect,
  options,
  styles,
  visible,
}) => (
  <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.dropdownBackdrop} onPress={onClose}>
      <Pressable style={styles.dropdownPanel}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelect("all")}
          style={styles.dropdownOption}
        >
          <Text variant="caption" style={styles.dropdownOptionText}>
            {allLabel}
          </Text>
        </TouchableOpacity>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.85}
            onPress={() => onSelect(option.id)}
            style={styles.dropdownOption}
          >
            <Text variant="caption" style={styles.dropdownOptionText}>
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </Pressable>
    </Pressable>
  </Modal>
);
