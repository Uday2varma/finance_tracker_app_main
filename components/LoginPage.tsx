import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from 'expo-checkbox';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle rememberMe logic here if needed
      // Redirect to home or dashboard
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : "Login failed";
      setError(errorMessage);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to home or dashboard
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : "Sign up failed";
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.rememberMeRow}>
        <Checkbox
          value={rememberMe}
          onValueChange={setRememberMe}
          color={rememberMe ? "#007bff" : undefined}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={isSignUp ? "Sign Up" : "Login"}
        onPress={isSignUp ? handleSignUp : handleLogin}
      />
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rememberMeText: {
    marginLeft: 8,
  },
  switchText: {
    color: "#007bff",
    marginTop: 16,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
});

export default LoginPage;
