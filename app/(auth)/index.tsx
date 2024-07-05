import React, { useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { TextInput, Text, Title, Avatar, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import useAuthStore from "@/store/auth/authStore";
import {
  validateEmailFormat,
  validatePasswordLength,
} from "@/utils/validation";

export default function AuthScreen() {
  const {
    email,
    password,
    isValidEmail,
    isValidPassword,
    emailWarning,
    passwordWarning,
    isAuthenticated,
    setEmail,
    setPassword,
    setIsValidEmail,
    setIsValidPassword,
    setEmailWarning,
    setPasswordWarning,
    setAuthenticated,
  } = useAuthStore();

  const emailInputRef = React.useRef<RNTextInput>(null);
  const passwordInputRef = React.useRef<RNTextInput>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
        router.replace("/(tabs)");
      } else {
        setAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const validateEmail = (text: string) => {
    const isValid = validateEmailFormat(text);
    setIsValidEmail(isValid);
    setEmail(text);
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    const isValid = validatePasswordLength(text);
    setIsValidPassword(isValid);
    if (!isValid && text.length > 0) {
      setPasswordWarning("Password must be at least 8 characters long");
    } else {
      setPasswordWarning("");
    }
  };

  const handleEmailBlur = () => {
    if (!isValidEmail && email.length > 0) {
      setEmailWarning("Please enter a valid email");
    } else {
      setEmailWarning("");
    }
  };

  const handlePasswordBlur = () => {
    if (!isValidPassword && password.length > 0) {
      setPasswordWarning("Password must be at least 8 characters long");
    } else {
      setPasswordWarning("");
    }
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    emailInputRef.current?.blur();
    passwordInputRef.current?.blur();
  };

  const handleSignUp = async () => {
    if (isValidEmail && isValidPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Avatar.Icon size={40} icon="shoe-sneaker" />
          <Title style={styles.title}>stepbets</Title>
        </View>
        <View style={styles.content}>
          <Text variant="displaySmall">Registration</Text>
          <TextInput
            ref={emailInputRef as any}
            mode="outlined"
            label="Email"
            textContentType="emailAddress"
            style={styles.inputWidth}
            value={email}
            onChangeText={validateEmail}
            onBlur={handleEmailBlur}
            outlineColor={isValidEmail ? "green" : undefined}
            outlineStyle={{ borderWidth: 2 }}
          />
          {emailWarning !== "" && (
            <Text style={styles.errorText}>{emailWarning}</Text>
          )}
          <TextInput
            ref={passwordInputRef as any}
            mode="outlined"
            label="Password"
            style={styles.inputWidth}
            value={password}
            onChangeText={validatePassword}
            onBlur={handlePasswordBlur}
            secureTextEntry
            outlineColor={
              isValidPassword
                ? "green"
                : password.length > 0
                ? "red"
                : undefined
            }
            outlineStyle={{ borderWidth: 2 }}
          />
          {passwordWarning !== "" && (
            <Text style={styles.errorText}>{passwordWarning}</Text>
          )}
          <Button
            mode="contained"
            onPress={handleSignUp}
            disabled={!isValidEmail || !isValidPassword}
            style={styles.signUpButton}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    marginLeft: 10,
    fontSize: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  inputWidth: {
    width: "100%",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  signUpButton: {
    marginTop: 20,
    width: "100%",
  },
});
