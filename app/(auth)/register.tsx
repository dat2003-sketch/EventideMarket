import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import AuthScreen from '../../components/auth/AuthScreen';
import AuthTextField from '../../components/auth/AuthTextField';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getFieldError, validateSignUp } from '../../utils/validation';

const raceWithTimeout = <T,>(p: Promise<T>, ms = 12000) =>
  Promise.race<T>([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('Network timed out')), ms)) as Promise<T>,
  ]);

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([] as { field: string; message: string }[]);

  const onSubmit = async () => {
    const result = validateSignUp({ email, password, confirmPassword, displayName });
    setErrors(result.errors);
    if (!result.isValid) return;

    try {
      setSubmitting(true);
      await raceWithTimeout(signUp(email.trim().toLowerCase(), password, displayName));
      Alert.alert('Success', 'Tài khoản đã tạo. Nếu bật xác thực email, vui lòng kiểm tra hộp thư.');
      router.replace('../(auth)/login'); // Redirect to login after successful registration
    } catch (e: any) {
      const msg = String(e?.message || '');
      const friendly = msg.includes('timed out')
        ? 'Kết nối chậm hoặc biến .env Supabase chưa đúng.'
        : (msg.toLowerCase().includes('password') ? 'Mật khẩu cần ít nhất 6 ký tự.' : msg);
      Alert.alert('Register failed', friendly);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthTextField label="Display name" value={displayName} onChangeText={setDisplayName} error={getFieldError(errors, 'displayName')} />
      <AuthTextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" error={getFieldError(errors, 'email')} />
      <AuthTextField label="Password" value={password} onChangeText={setPassword} secureTextEntry error={getFieldError(errors, 'password')} />
      <AuthTextField label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={getFieldError(errors, 'confirmPassword')} />
      <Button title={submitting ? 'Creating...' : 'Create account'} onPress={onSubmit} loading={submitting} />
      <View style={{ alignItems: 'center' }}>
        <Link href='/(auth)/login'>Have an account? Sign in</Link>
      </View>
    </AuthScreen>
  );
}
