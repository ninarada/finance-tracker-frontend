import { changePassword } from "@/services/userService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TertiaryButton } from "../buttons/TertiaryButton";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  token: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  token,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Both fields are required");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await changePassword(token, currentPassword, newPassword);
      Alert.alert("Success", "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center p-5">
        <View className="bg-white rounded-xl p-5 gap-4">
          <Text className="text-2xl font-bold text-slate-700 text-center">Change Password</Text>
          <Text className="text-slate-500 text-center mb-2">
            For your security, please enter your current password and choose a new one with at least 6 characters. 
          </Text>
          
          <TextInput
            className="bg-primary-50 shadow-sm rounded-full px-4 py-3"
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <TextInput
            className="bg-primary-50 shadow-sm rounded-full px-4 py-3"
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <View className="flex-row justify-end gap-2">
              <TertiaryButton title="Cancel" onPress={onClose}/>
              <PrimaryButton title="Save" onPress={handleSave} fontSize="text-md"/>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
