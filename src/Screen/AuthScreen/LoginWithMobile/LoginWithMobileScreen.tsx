import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import Feather from 'react-native-vector-icons/Feather';

import useStyles from './LoginWithMobileScreenStyles';
import { useTheme } from '../../../utils/theme/ThemeProvider';
import type { AuthStackParamList } from '../../../Navigation/types';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loginThunk } from '../../../redux/authSlice/authSlice';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'LoginWithMobile'>;

const getMaxLenFor = (c?: ICountry) => (c?.cca2 === 'IN' ? 10 : 15);

const safeValidatePhone = (
  value: string,
  country?: ICountry,
  opts?: { strict?: boolean },
) => {
  const strict = opts?.strict;

  const phone = (value ?? '').replace(/[^0-9]/g, '');
  if (!phone.length) return strict ? 'Please enter mobile number' : '';
  if (!country) return strict ? 'Please select country' : '';

  if (country.cca2 === 'IN') {
    if (phone.length !== 10) return 'Enter 10-digit mobile number';
  } else {
    if (phone.length < 4 || phone.length > 15)
      return 'Enter valid mobile number';
  }

  return '';
};

const LoginWithMobileScreen: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();

  const dispatch = useAppDispatch();
  const { status } = useAppSelector(s => s.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<
    ICountry | undefined
  >();
  const [phoneError, setPhoneError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState<string>('');

  const isIN = (selectedCountry?.cca2 ?? 'IN') === 'IN';

  const canSubmit = useMemo(() => {
    const pErr = safeValidatePhone(phoneNumber, selectedCountry);
    return !pErr && !!password.trim() && status !== 'loading';
  }, [phoneNumber, selectedCountry, password, status]);

  const onLogin = async () => {
    Keyboard.dismiss();

    const pErr = safeValidatePhone(phoneNumber, selectedCountry, {
      strict: true,
    });
    setPhoneError(pErr);
    if (pErr) return;

    if (!password.trim()) {
      setPasswordError('Please enter password');
      return;
    }

    setPasswordError('');
    setApiError('');

    try {
      const res = await dispatch(
        loginThunk({
          phone: phoneNumber.trim(),
          password: password.trim(),
        }),
      ).unwrap();

      // RootNavigator will switch automatically by token
      if (!res?.token) {
        setApiError('Login success but token missing');
      }
    } catch (e: any) {
      setApiError(e?.message ?? 'Login failed, try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.safeArea}>
        <StatusBar
          translucent={false}
          backgroundColor={theme.colors.background}
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />

        <View style={styles.container}>
          <Text style={styles.title}>{t('auth.loginTitle', 'Log in')}</Text>

          {/* Phone */}
          <View style={styles.row}>
            <PhoneInput
              defaultCountry="IN"
              value={phoneNumber}
              selectedCountry={selectedCountry}
              onChangePhoneNumber={(num: string) => {
                const onlyDigits = num.replace(/[^0-9]/g, '');
                const cap = getMaxLenFor(selectedCountry);
                const clamped = onlyDigits.slice(0, cap);

                setPhoneNumber(clamped);
                setPhoneError(safeValidatePhone(clamped, selectedCountry));
              }}
              onChangeSelectedCountry={(country: ICountry) => {
                setSelectedCountry(country);
                const cap = getMaxLenFor(country);
                const clamped = phoneNumber.slice(0, cap);
                if (clamped !== phoneNumber) setPhoneNumber(clamped);
                setPhoneError(safeValidatePhone(clamped, country));
              }}
              phoneInputStyles={{
                container: styles.phoneWrap,
                flagContainer: styles.flagBtn,
                callingCode: styles.codePrefix,
                input: styles.input,
              }}
              placeholder={
                isIN
                  ? t(
                      'auth.mobileNumberPlaceholderIN',
                      '10-digit mobile number',
                    )
                  : t('auth.mobileNumberPlaceholder', 'Mobile number')
              }
            />
          </View>
          <Text style={styles.errorText}>{phoneError || ' '}</Text>

          {/* Password */}
          <View style={styles.row}>
            <View style={styles.passwordWrap}>
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.password', 'Password')}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(p => !p)}
                style={styles.eyeBtn}
                activeOpacity={0.6}
              >
                <Feather
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.errorText}>
            {passwordError || apiError || ' '}
          </Text>

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.ctaPrimary, { opacity: canSubmit ? 1 : 0.6 }]}
            onPress={onLogin}
            disabled={!canSubmit}
          >
            {status === 'loading' ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <Text style={styles.ctaPrimaryText}>
                {t('auth.login', 'Login')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('NameEmail')}
            style={{ marginTop: 14, alignItems: 'center' }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: styles?.linkFontFamily as any,
              }}
            >
              {t('auth.newDriver', 'New driver? Register')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginWithMobileScreen;
