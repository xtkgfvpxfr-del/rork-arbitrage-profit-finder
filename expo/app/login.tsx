import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
// Conditionally import to avoid web crash
let AppleAuthentication: any = null;
if (Platform.OS === 'ios') {
  AppleAuthentication = require('expo-apple-authentication');
}
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid credentials. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  const handleAppleLogin = useCallback(async () => {
    setIsAppleLoading(true);
    try {
      if (Platform.OS === 'ios' && AppleAuthentication) {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const fullName = credential.fullName
          ? `${credential.fullName.givenName ?? ''} ${credential.fullName.familyName ?? ''}`.trim()
          : '';
        const appleEmail = credential.email ?? '';

        console.log('Apple credential received:', { fullName, email: appleEmail });

        const success = await loginWithApple(fullName, appleEmail);
        if (success) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', 'Apple sign in failed. Please try again.');
        }
      } else {
        const success = await loginWithApple('Apple User', 'apple@privaterelay.appleid.com');
        if (success) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', 'Apple sign in failed. Please try again.');
        }
      }
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'ERR_REQUEST_CANCELED') {
        console.log('Apple sign in was canceled');
      } else {
        console.error('Apple sign in error:', error);
        Alert.alert('Error', 'Apple sign in failed. Please try again.');
      }
    } finally {
      setIsAppleLoading(false);
    }
  }, [loginWithApple, router]);

  const renderAppleButton = () => {
    if (Platform.OS === 'ios' && AppleAuthentication) {
      return (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={14}
          style={styles.appleButtonNative}
          onPress={handleAppleLogin}
        />
      );
    }

    return (
      <Pressable
        style={({ pressed }) => [
          styles.appleButton,
          pressed && styles.appleButtonPressed,
          isAppleLoading && styles.loginButtonDisabled,
        ]}
        onPress={handleAppleLogin}
        disabled={isAppleLoading}
        testID="apple-sign-in"
      >
        {isAppleLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <>
            <Text style={styles.appleIcon}></Text>
            <Text style={styles.appleButtonText}>Sign in with Apple</Text>
          </>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A1628', '#132F4C', '#0A1628']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[Colors.dark.profit, Colors.dark.amazon]}
                style={styles.logoGradient}
              >
                <TrendingUp size={32} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Arbitrage Pro</Text>
            <Text style={styles.subtitle}>
              Find profitable deals between Amazon & eBay
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.dark.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.dark.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                testID="email-input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.dark.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.dark.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                testID="password-input"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              testID="sign-in-button"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </Pressable>

            <Pressable style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {renderAppleButton()}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Pressable onPress={() => {
              Alert.alert('Sign Up', 'Enter any email and 4+ character password above, then tap Sign In to create your account.');
            }}>
              <Text style={styles.signUpText}>Sign up free</Text>
            </Pressable>
          </View>

          <View style={styles.demoHint}>
            <Text style={styles.demoText}>
              Demo: Enter any email and 4+ character password
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    paddingVertical: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.profit,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#fff',
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  appleButtonNative: {
    height: 52,
    width: '100%',
    borderRadius: 14,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
  },
  appleButtonPressed: {
    opacity: 0.85,
  },
  appleIcon: {
    fontSize: 20,
    color: '#000',
  },
  appleButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    gap: 6,
  },
  footerText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  signUpText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.dark.profit,
  },
  demoHint: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
});
