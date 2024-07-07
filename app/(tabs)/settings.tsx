import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import useAuthStore from "@/store/auth/authStore";

export default function SettingScreen() {
  const router = useRouter();
  const { setAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthenticated(false);
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "tomato",
  },
});
