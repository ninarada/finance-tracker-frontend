import { deleteUser } from "@/services/userService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TertiaryButton } from "../buttons/TertiaryButton";

interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    visible,
    onClose,
}) => {    
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      Alert.alert("Error", "Password is required");
      return;
    }
    try {
      setLoading(true);
      await deleteUser(password);
      Alert.alert("Success", "Password changed successfully");
      setPassword("");
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
          <Text className="text-2xl font-bold text-slate-700 text-center">Delete Account</Text>
          <Text className="text-slate-500 text-center mb-2">
          This action will permanently remove your account, receipts, and all related data. Once deleted, your information cannot be recovered. 
          </Text>
          
          <TextInput
            className="bg-primary-10 shadow-sm rounded-full px-4 py-3"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <View className="flex-row justify-end gap-1">
              <TertiaryButton title="Cancel" onPress={onClose} textColor="text-slate-700" />
              <PrimaryButton title="Delete " onPress={handleDelete} fontSize="text-md" backgroundColor="error" uppercase={true}/>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
