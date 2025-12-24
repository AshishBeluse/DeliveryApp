import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

import useStyles from './NameEmailScreenStyles';
import { useTheme } from '../../../utils/theme/ThemeProvider';
import { scaleHeight } from '../../../utils/responsive';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { registerThunk } from '../../../redux/authSlice/authSlice';

import {
  isValidEmail,
  isValidPhone,
  validatePassword,
} from '../../../utils/validation';

// local upload type (matches what your API needs)
type UploadFile = { uri: string; name: string; type: string };

const onlyDigits = (v: string) => v.replace(/[^0-9]/g, '');

const toTitleCase = (v: string) =>
  v
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

const toUpperNoSpaces = (v: string) => v.replace(/\s+/g, '').toUpperCase();

const NameEmailScreen: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(s => s.auth);

  // --- Local state ---
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [vehicleType, setVehicleType] = useState<
    'bike' | 'car' | 'scooter' | ''
  >('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImage, setLicenseImage] = useState<UploadFile | undefined>();
  const [idProofImage, setIdProofImage] = useState<UploadFile | undefined>();

  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const lastRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const pickingRef = useRef(false);

  // cleaned values
  const cleanedPhone = onlyDigits(phone);
  const cleanedEmail = email.trim().toLowerCase();
  const cleanedVehicleNo = toUpperNoSpaces(vehicleNumber);
  const cleanedLicenseNo = toUpperNoSpaces(licenseNumber);

  // ---- Validation messages (only show after submit) ----
  const firstErr = !submitted
    ? ''
    : first.trim().length < 2
    ? 'Enter first name'
    : '';

  const lastErr = !submitted
    ? ''
    : last.trim().length < 2
    ? 'Enter last name'
    : '';

  const emailErr = !submitted
    ? ''
    : !cleanedEmail
    ? 'Email required'
    : !isValidEmail(cleanedEmail)
    ? 'Invalid email'
    : '';

  const phoneErr = !submitted
    ? ''
    : !cleanedPhone
    ? 'Phone required'
    : !isValidPhone(cleanedPhone)
    ? 'Enter valid phone'
    : '';

  const passwordErr = !submitted
    ? ''
    : !password.trim()
    ? 'Password required'
    : !validatePassword(password.trim())
    ? 'Min 6 characters'
    : '';

  const vehicleTypeErr = submitted && !vehicleType ? 'Select vehicle type' : '';
  const vehicleNumberErr =
    submitted && !cleanedVehicleNo ? 'Enter vehicle number' : '';
  const licenseNumberErr =
    submitted && !cleanedLicenseNo ? 'Enter license number' : '';
  const licenseImageErr =
    submitted && !licenseImage ? 'Upload license image' : '';
  const idProofImageErr =
    submitted && !idProofImage ? 'Upload ID proof image' : '';

  const canContinue = useMemo(() => {
    return (
      !firstErr &&
      !lastErr &&
      !emailErr &&
      !phoneErr &&
      !passwordErr &&
      !vehicleTypeErr &&
      !vehicleNumberErr &&
      !licenseNumberErr &&
      !licenseImageErr &&
      !idProofImageErr &&
      first.trim().length >= 2 &&
      last.trim().length >= 2 &&
      isValidEmail(cleanedEmail) &&
      isValidPhone(cleanedPhone) &&
      validatePassword(password.trim()) &&
      !!vehicleType &&
      !!cleanedVehicleNo &&
      !!cleanedLicenseNo &&
      !!licenseImage &&
      !!idProofImage &&
      status !== 'loading'
    );
  }, [
    firstErr,
    lastErr,
    emailErr,
    phoneErr,
    passwordErr,
    vehicleTypeErr,
    vehicleNumberErr,
    licenseNumberErr,
    licenseImageErr,
    idProofImageErr,
    first,
    last,
    cleanedEmail,
    cleanedPhone,
    password,
    vehicleType,
    cleanedVehicleNo,
    cleanedLicenseNo,
    licenseImage,
    idProofImage,
    status,
  ]);

  const keyboardOffset = Platform.OS === 'ios' ? 40 : 0;

  // ---- Image picker ----
  const pickImage = async (type: 'license' | 'id') => {
    if (pickingRef.current) return;
    pickingRef.current = true;

    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      const asset: Asset | undefined = res.assets?.[0];
      if (!asset?.uri) return;

      const file: UploadFile = {
        uri: asset.uri,
        name: asset.fileName || `${type}.jpg`,
        type: asset.type || 'image/jpeg',
      };

      if (type === 'license') setLicenseImage(file);
      else setIdProofImage(file);
    } finally {
      // ✅ always release lock
      setTimeout(() => {
        pickingRef.current = false;
      }, 300);
    }
  };

  // ---- Submit ----
  const onContinue = async () => {
    Keyboard.dismiss();
    setSubmitted(true);
    setApiError('');

    if (!canContinue) return;

    try {
      const name = toTitleCase(`${first} ${last}`);

      const res = await dispatch(
        registerThunk({
          name,
          email: cleanedEmail,
          phone: cleanedPhone,
          password: password.trim(),
          vehicleType,
          vehicleNumber: cleanedVehicleNo,
          licenseNumber: cleanedLicenseNo,
          licenseImage: licenseImage!,
          idProofImage: idProofImage!,
        }),
      ).unwrap();

      // OTP flow
      navigation.navigate('VerifyOtp', { phone: res.phone });
    } catch (e: any) {
      setApiError(e?.message ?? 'Register failed');
    }
  };

  const goBack = () => {
    const parent = (navigation as any).getParent?.();
    if (navigation.canGoBack()) navigation.goBack();
    else if (parent?.canGoBack?.()) parent.goBack();
    else navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View style={styles.safeArea}>
          <StatusBar
            translucent={false}
            backgroundColor={theme.colors.background}
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
          />

          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={goBack}
              activeOpacity={0.8}
              style={styles.backCircle}
            >
              <Text style={styles.backText}>{'‹'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[
                styles.container,
                { paddingBottom: scaleHeight(180) },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>What’s your name?</Text>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={first}
                  onChangeText={setFirst}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => lastRef.current?.focus()}
                />
              </View>
              <Text style={styles.errorText}>{firstErr || ' '}</Text>

              <View style={styles.inputWrap}>
                <TextInput
                  ref={lastRef}
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={last}
                  onChangeText={setLast}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              <Text style={styles.errorText}>{lastErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>Email</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
              </View>
              <Text style={styles.errorText}>{emailErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>Phone</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  ref={phoneRef}
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={phone}
                  onChangeText={txt => setPhone(onlyDigits(txt))}
                  keyboardType="number-pad"
                  maxLength={15}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              <Text style={styles.errorText}>{phoneErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>Password</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="Min 6 characters"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />
              </View>
              <Text style={styles.errorText}>{passwordErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>Vehicle type</Text>
              <View style={styles.vehicleRow}>
                {(['bike', 'car', 'scooter'] as const).map(v => {
                  const selected = vehicleType === v;
                  return (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setVehicleType(v)}
                      activeOpacity={0.85}
                      style={[
                        styles.vehiclePill,
                        {
                          backgroundColor: selected
                            ? theme.colors.primary
                            : theme.colors.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.vehiclePillText,
                          {
                            color: selected
                              ? theme.colors.buttonText
                              : theme.colors.textPrimary,
                          },
                        ]}
                      >
                        {v.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.errorText}>{vehicleTypeErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>
                Vehicle number
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="MP09BC2353"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={vehicleNumber}
                  onChangeText={txt => setVehicleNumber(toUpperNoSpaces(txt))}
                  autoCapitalize="characters"
                />
              </View>
              <Text style={styles.errorText}>{vehicleNumberErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>
                License number
              </Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="DL123456"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={licenseNumber}
                  onChangeText={txt => setLicenseNumber(toUpperNoSpaces(txt))}
                  autoCapitalize="characters"
                />
              </View>
              <Text style={styles.errorText}>{licenseNumberErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>
                License image
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.fieldButton}
                onPress={() => pickImage('license')}
              >
                <Text style={styles.fieldText}>
                  {licenseImage
                    ? 'License image selected'
                    : 'Upload license image'}
                </Text>
                <Text style={styles.chev}>{'›'}</Text>
              </TouchableOpacity>
              <Text style={styles.errorText}>{licenseImageErr || ' '}</Text>

              <Text style={[styles.title, { marginTop: 6 }]}>
                ID proof image
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.fieldButton}
                onPress={() => pickImage('id')}
              >
                <Text style={styles.fieldText}>
                  {idProofImage ? 'ID proof selected' : 'Upload ID proof'}
                </Text>
                <Text style={styles.chev}>{'›'}</Text>
              </TouchableOpacity>

              <Text style={styles.errorText}>
                {idProofImageErr || apiError || error || ' '}
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.ctaPrimary, { opacity: canContinue ? 1 : 0.6 }]}
                onPress={onContinue}
                disabled={!canContinue}
              >
                {status === 'loading' ? (
                  <ActivityIndicator color={theme.colors.buttonText} />
                ) : (
                  <Text style={styles.ctaPrimaryText}>Register</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NameEmailScreen;
