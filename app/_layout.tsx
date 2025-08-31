import { AuthProvider } from "@/AuthContext";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
       <Stack screenOptions={{headerShown: false}} />
    </AuthProvider>
  );
}
