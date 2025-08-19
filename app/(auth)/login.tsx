import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import AuthScreen from '../../components/auth/AuthScreen';
import AuthTextField from '../../components/auth/AuthTextField';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getFieldError, validateSignIn } from '../../utils/validation';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([] as { field: string; message: string }[]);

  const onSubmit = async () => {
    const result = validateSignIn({ email, password });
    setErrors(result.errors);
    if (!result.isValid) return;

    try {
      setSubmitting(true);
      await signIn(email.trim().toLowerCase(), password);
      //  KHÔNG router.replace ở đây
      // Gate trong app/_layout.tsx sẽ tự điều hướng sang '/(tabs)'
    } catch (e: any) {
      Alert.alert('Login failed', e?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={getFieldError(errors, 'email')}
      />
      <AuthTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={getFieldError(errors, 'password')}
      />
      <Button title={submitting ? 'Signing in...' : 'Sign In'} onPress={onSubmit} loading={submitting} />
      <View style={{ alignItems: 'center' }}>
         <Link href='/(auth)/register'>No account? Register</Link>   
      </View>
    </AuthScreen>
  );
}
