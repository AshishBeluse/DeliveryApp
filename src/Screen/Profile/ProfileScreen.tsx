import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { openSettings } from 'react-native-permissions';
import { useTheme } from '../../utils/theme/ThemeProvider';
import useStyles from './profileStyles';
import Button from '../../components/button/button';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { isValidEmail } from '../../utils/validation';
import { pickImage } from '../../utils/imagePickerHelper';
import {
  getProfileThunk,
  updateProfileThunk,
} from '../../redux/authSlice/authSlice';
import { Env } from '../../config/env';

type VehicleType = 'bike' | 'scooter' | '';

const toTitleCase = (v: string) =>
  v
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

const toUpperNoSpaces = (v: string) => v.replace(/\s+/g, '').toUpperCase();

export default function ProfileScreen() {
  const styles = useStyles();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const driver = useAppSelector(s => s.auth.driver);
  const { status } = useAppSelector(s => s.auth);

  // local photo (selected but not yet uploaded)
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  // split existing name into first/last (best-effort)
  const defaultFirst = useMemo(() => {
    const full = String(driver?.name ?? '').trim();
    if (!full) return '';
    return full.split(/\s+/)[0] ?? '';
  }, [driver?.name]);

  const defaultLast = useMemo(() => {
    const full = String(driver?.name ?? '').trim();
    if (!full) return '';
    const parts = full.split(/\s+/);
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }, [driver?.name]);

  const [first, setFirst] = useState(defaultFirst);
  const [last, setLast] = useState(defaultLast);

  const [email, setEmail] = useState(String((driver as any)?.email ?? ''));
  const phone = String(driver?.phone ?? '');

  const [vehicleType, setVehicleType] = useState<VehicleType>(
    ((driver as any)?.vehicleType as VehicleType) ?? '',
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    String((driver as any)?.vehicleNumber ?? ''),
  );
  const [hasVehicleNumberFromApi, setHasVehicleNumberFromApi] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState<{
    first: string;
    last: string;
    email: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    hasImage: boolean;
  } | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        await dispatch(getProfileThunk()).unwrap();
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  // Update local state when driver data changes
  useEffect(() => {
    if (driver) {
      const fullName = String(driver.name ?? '').trim();
      const parts = fullName.split(/\s+/);
      const newFirst = parts[0] ?? '';
      const newLast = parts.length > 1 ? parts.slice(1).join(' ') : '';
      const newEmail = String((driver as any)?.email ?? '');
      const newVehicleType = ((driver as any)?.vehicleType as VehicleType) ?? '';
      const imageUrl = (driver as any)?.image;

      const apiVehicleNumber = (driver as any)?.vehicleNumber;
      const newVehicleNumber = apiVehicleNumber ? String(apiVehicleNumber) : '';
      
      setFirst(newFirst);
      setLast(newLast);
      setEmail(newEmail);
      setVehicleType(newVehicleType);
      setVehicleNumber(newVehicleNumber);
      // Track if vehicle number came from API (not null/undefined)
      setHasVehicleNumberFromApi(!!apiVehicleNumber);

      // Store original values
      setOriginalValues({
        first: newFirst,
        last: newLast,
        email: newEmail,
        vehicleType: newVehicleType,
        vehicleNumber: newVehicleNumber,
        hasImage: !!imageUrl,
      });

      // Set profile image if available and no local selection
      if (imageUrl && !selectedImageFile) {
        // Construct full image URL if needed
        const fullImageUrl = imageUrl.startsWith('http')
          ? imageUrl
          : `${Env.API_BASE_URL}/uploads/${imageUrl}`;
        setPhotoUri(fullImageUrl);
      } else if (!imageUrl && !selectedImageFile) {
        setPhotoUri(null);
      }
    }
  }, [driver]);

  // --- Custom picker modal for Android (keeps Camera/Gallery together) ---
  const [pickerOpen, setPickerOpen] = useState(false);

  const firstErr = !submitted
    ? ''
    : first.trim().length < 2
    ? 'Enter first name'
    : '';
  const lastErr = !submitted
    ? ''
    : last.trim().length < 2
    ? 'Enter surname'
    : '';
  const emailErr = !submitted
    ? ''
    : !email.trim()
    ? 'Email required'
    : !isValidEmail(email.trim().toLowerCase())
    ? 'Invalid email'
    : '';

  const vehicleTypeErr = !submitted
    ? ''
    : !vehicleType
    ? 'Select vehicle type'
    : '';
  const vehicleNoErr = !submitted
    ? ''
    : !toUpperNoSpaces(vehicleNumber)
    ? 'Enter vehicle number'
    : '';

  // Check if user made any changes
  const hasChanges = useMemo(() => {
    if (!originalValues) {
      // If no original values yet, check if image is selected
      const result = !!selectedImageFile;
      console.log('hasChanges (no originalValues):', result, 'selectedImageFile:', !!selectedImageFile);
      return result;
    }

    const currentName = toTitleCase(`${first} ${last}`).trim();
    const originalName = toTitleCase(
      `${originalValues.first} ${originalValues.last}`,
    ).trim();
    const currentEmail = email.trim().toLowerCase();
    const originalEmail = originalValues.email.trim().toLowerCase();
    const currentVehicleNo = toUpperNoSpaces(vehicleNumber);
    const originalVehicleNo = toUpperNoSpaces(
      originalValues.vehicleNumber || '',
    );
    const vehicleNoChanged = currentVehicleNo !== originalVehicleNo;

    // Check if image changed: if selectedImageFile exists, it means user selected a new image
    // This is always considered a change since we can't compare image files easily
    const imageChanged = !!selectedImageFile;

    const result = (
      currentName !== originalName ||
      currentEmail !== originalEmail ||
      vehicleType !== originalValues.vehicleType ||
      vehicleNoChanged ||
      imageChanged
    );
    
    console.log('hasChanges:', result, {
      nameChanged: currentName !== originalName,
      emailChanged: currentEmail !== originalEmail,
      vehicleTypeChanged: vehicleType !== originalValues.vehicleType,
      vehicleNoChanged: currentVehicleNo !== originalVehicleNo,
      imageChanged,
    });

    return result;
  }, [
    first,
    last,
    email,
    vehicleType,
    vehicleNumber,
    selectedImageFile,
    originalValues,
  ]);

  // Check if only image changed (no other fields changed)
  const onlyImageChanged = useMemo(() => {
    if (!originalValues || !hasChanges) return false;
    
    const currentName = toTitleCase(`${first} ${last}`).trim();
    const originalName = toTitleCase(
      `${originalValues.first} ${originalValues.last}`,
    ).trim();
    const currentEmail = email.trim().toLowerCase();
    const originalEmail = originalValues.email.trim().toLowerCase();
    const currentVehicleNo = toUpperNoSpaces(vehicleNumber);
    const originalVehicleNo = toUpperNoSpaces(
      originalValues.vehicleNumber || '',
    );
    
    const imageChanged = !!selectedImageFile;
    const nameChanged = currentName !== originalName;
    const emailChanged = currentEmail !== originalEmail;
    const vehicleTypeChanged = vehicleType !== originalValues.vehicleType;
    const vehicleNoChanged = currentVehicleNo !== originalVehicleNo;
    
    // Only image changed if image changed but nothing else changed
    return imageChanged && !nameChanged && !emailChanged && !vehicleTypeChanged && !vehicleNoChanged;
  }, [first, last, email, vehicleType, vehicleNumber, selectedImageFile, originalValues, hasChanges]);

  // Only validate fields that have changed or are required
  // If only image changed, we allow saving since other fields haven't changed and were already valid when loaded
  const canSave =
    !saving &&
    !loading &&
    hasChanges &&
    // If only image changed, skip field validation (fields are unchanged and were already valid)
    (onlyImageChanged || (
    !firstErr &&
    !lastErr &&
    !emailErr &&
    !vehicleTypeErr &&
    !vehicleNoErr &&
    first.trim().length >= 2 &&
    last.trim().length >= 2 &&
    isValidEmail(email.trim().toLowerCase()) &&
    !!vehicleType &&
      !!toUpperNoSpaces(vehicleNumber)
    ));

  const open = async (source: 'camera' | 'gallery') => {
    // close modal first
    setPickerOpen(false);

    const res = await pickImage(source);

    if (res.requiresSettingsRedirect) {
      Alert.alert('Permission', 'Enable Camera permission from Settings', [
        { text: 'Open Settings', onPress: () => openSettings() },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    if (res.success && res.data) {
      setPhotoUri(res.data.uri);
      const imageFile = {
        uri: res.data.uri,
        name: res.data.fileName || 'image.jpg',
        type: res.data.type || 'image/jpeg',
      };
      setSelectedImageFile(imageFile);
      console.log('Image selected, selectedImageFile set:', imageFile);
    }
  };

  const openPickerSheet = () => {
    // Android native Alert cannot place buttons "near" each other.
    // So we use custom Modal for Android.
    if (Platform.OS === 'android') {
      setPickerOpen(true);
      return;
    }

    // iOS: use the same modal too for consistent UI (optional)
    // If you want ActionSheetIOS, tell me and I’ll swap it.
    setPickerOpen(true);
  };

  const onSave = async () => {
    Keyboard.dismiss();
    setSubmitted(true);
    if (!canSave) return;

    try {
      setSaving(true);

      const fullName = toTitleCase(`${first} ${last}`);
      const cleanedEmail = email.trim().toLowerCase();
      const cleanedVehicleNo = toUpperNoSpaces(vehicleNumber);

      await dispatch(
        updateProfileThunk({
          name: fullName,
          email: cleanedEmail,
          vehicleType,
          vehicleNumber: cleanedVehicleNo,
          image: selectedImageFile || undefined,
        }),
      ).unwrap();

      // Update original values to reflect saved state
      if (originalValues) {
        setOriginalValues({
          first,
          last,
          email: cleanedEmail,
          vehicleType,
          vehicleNumber: toUpperNoSpaces(vehicleNumber),
          hasImage: !!selectedImageFile || originalValues.hasImage,
        });
      }

      // Clear selected image file after successful upload
      setSelectedImageFile(null);

      Alert.alert('Success', 'Profile updated successfully');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
         {/* Header */}
         <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile</Text>
            </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
           

            {/* Photo */}
            <View style={styles.photoSection}>
              <Pressable
                onPress={openPickerSheet}
                style={styles.photoWrap}
                disabled={loading}
              >
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Icon
                      name="user"
                      size={28}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                )}

                <View style={styles.editBadge}>
                  <Icon
                    name="edit-3"
                    size={14}
                    color={theme.colors.buttonText ?? '#000'}
                  />
                </View>
              </Pressable>

              <Text style={styles.photoHint}>Tap to change photo</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* First Name */}
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={first}
                  onChangeText={setFirst}
                  placeholder="First name"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              <Text style={styles.errorText}>{firstErr || ' '}</Text>

              {/* Surname */}
              <Text style={styles.label}>Surname</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={last}
                  onChangeText={setLast}
                  placeholder="Surname"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              <Text style={styles.errorText}>{lastErr || ' '}</Text>

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="done"
                />
              </View>
              <Text style={styles.errorText}>{emailErr || ' '}</Text>

              {/* Phone (read-only) */}
              <Text style={styles.label}>Phone</Text>
              <View style={[styles.inputWrap, styles.readOnlyWrap]}>
                <Text style={styles.readOnlyText}>{phone || '-'}</Text>
              </View>
              <Text style={styles.errorText}> </Text>

              {/* Vehicle Type */}
              <Text style={styles.label}>Vehicle type</Text>
              <View style={styles.vehicleRow}>
                {(['bike', 'scooter'] as const).map(v => {
                  const selected = vehicleType === v;
                  return (
                    <Pressable
                      key={v}
                      onPress={() => setVehicleType(v)}
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
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.errorText}>{vehicleTypeErr || ' '}</Text>

              {/* Vehicle Number */}
              <Text style={styles.label}>Vehicle number</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={vehicleNumber}
                  onChangeText={txt => setVehicleNumber(toUpperNoSpaces(txt))}
                  placeholder="MP09BC2353"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  autoCapitalize="characters"
                  returnKeyType="done"
                />
              </View>
              <Text style={styles.errorText}>{vehicleNoErr || ' '}</Text>


              {/* Change Password */}
              <Pressable
                onPress={() => navigation.navigate('ChangePassword')}
                style={[
                  styles.rowButton,
                  {
                    borderColor:
                      theme.colors.border ?? theme.colors.inputBorder,
                  },
                ]}
              >
                <View style={styles.rowLeft}>
                  <Icon
                    name="lock"
                    size={18}
                    color={theme.colors.textPrimary}
                  />
                  <Text style={styles.rowText}>Change Password</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </Pressable>

              {/* Save */}
              <Button
                onPress={onSave}
                disabled={!canSave}
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor: canSave
                      ? theme.colors.primary
                      : theme.colors.card,
                    borderColor:
                      theme.colors.border ?? theme.colors.inputBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.saveText,
                    {
                      color: canSave
                        ? theme.colors.buttonText ?? '#000'
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Text>
              </Button>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* ✅ Custom Picker (Camera + Gallery near each other) */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setPickerOpen(false)}
        >
          <Pressable
            style={[styles.sheetCard, { backgroundColor: theme.colors.card }]}
          >
            <Text
              style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}
            >
              Profile Photo
            </Text>
            <Text
              style={[styles.sheetSub, { color: theme.colors.textSecondary }]}
            >
              Choose option
            </Text>

            <View style={styles.sheetRow}>
              <Pressable onPress={() => open('camera')} style={styles.sheetBtn}>
                <Text
                  style={[styles.sheetBtnText, { color: theme.colors.primary }]}
                >
                  CAMERA
                </Text>
              </Pressable>

              <Pressable
                onPress={() => open('gallery')}
                style={styles.sheetBtn}
              >
                <Text
                  style={[styles.sheetBtnText, { color: theme.colors.primary }]}
                >
                  GALLERY
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => setPickerOpen(false)}
              style={[
                styles.sheetCancelBtn,
                {
                  borderColor: theme.colors.border ?? theme.colors.inputBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.sheetCancelText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                CANCEL
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
