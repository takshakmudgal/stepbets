import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Text,
  Title,
  Avatar,
  Button,
  IconButton,
} from "react-native-paper";
import { useRouter, Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import useAuthStore from "@/store/auth/authStore";
import {
  validateEmailFormat,
  validatePasswordLength,
} from "@/utils/validation";
import { FirebaseError } from "firebase/app";

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

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

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
      setIsLoading(true);
      setRegistrationError("");
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing up:", error);
        if ((error as FirebaseError).code === "auth/email-already-in-use") {
          setRegistrationError("User with this email already exists.");
        } else {
          setRegistrationError("An error occurred during registration.");
        }
        setIsLoading(false);
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
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordInputRef as any}
              mode="outlined"
              label="Password"
              style={[styles.inputWidth, { flex: 1 }]}
              value={password}
              onChangeText={validatePassword}
              onBlur={handlePasswordBlur}
              secureTextEntry={!isPasswordVisible}
              outlineColor={
                isValidPassword
                  ? "green"
                  : password.length > 0
                  ? "red"
                  : undefined
              }
              outlineStyle={{ borderWidth: 2 }}
            />
            <IconButton
              icon={isPasswordVisible ? "eye-off" : "eye"}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          </View>
          {passwordWarning !== "" && (
            <Text style={styles.errorText}>{passwordWarning}</Text>
          )}
          {registrationError !== "" && (
            <Text style={styles.errorText}>{registrationError}</Text>
          )}
          {isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Button
              mode="contained"
              onPress={handleSignUp}
              disabled={!isValidEmail || !isValidPassword}
              style={styles.signUpButton}
            >
              Sign Up
            </Button>
          )}
          <Link href="/login" style={styles.loginStyles}>
            Already a member? Log In
          </Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loginStyles: {
    textDecorationLine: "underline",
    color: "tomato",
  },
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
    borderRadius: 4,
    marginTop: 20,
    width: "90%",
    backgroundColor: "tomato",
    marginBottom: 6,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 5,
  },
});
