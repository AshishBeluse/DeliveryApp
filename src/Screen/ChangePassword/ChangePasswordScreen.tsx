import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../utils/theme/ThemeProvider';
import useStyles from './changePasswordStyles';
import Button from '../../components/button/button';
import { validatePassword } from '../../utils/validation';

export default function ChangePasswordScreen() {
  const styles = useStyles();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const oldErr = !submitted ? '' : !oldPass ? 'Old password required' : '';
  const newErr = !submitted
    ? ''
    : !newPass
    ? 'New password required'
    : !validatePassword(newPass)
    ? 'Min 6 characters'
    : '';
  const confirmErr = !submitted
    ? ''
    : !confirm
    ? 'Confirm password required'
    : confirm !== newPass
    ? 'Passwords do not match'
    : '';

  const canSave = useMemo(() => {
    return (
      !saving &&
      !oldErr &&
      !newErr &&
      !confirmErr &&
      !!oldPass &&
      validatePassword(newPass) &&
      confirm === newPass
    );
  }, [saving, oldErr, newErr, confirmErr, oldPass, newPass, confirm]);

  const onSave = async () => {
    setSubmitted(true);
    if (!canSave) return;

    try {
      setSaving(true);

      // TODO: connect API later
      // await dispatch(changePasswordThunk({ oldPass, newPass })).unwrap();

      Alert.alert('Success', 'Password updated (demo).');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Change Password', e?.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon
            name="chevron-left"
            size={22}
            color={theme.colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Old password</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={oldPass}
            onChangeText={setOldPass}
            placeholder="Old password"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.errorText}>{oldErr || ' '}</Text>

        <Text style={styles.label}>New password</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={newPass}
            onChangeText={setNewPass}
            placeholder="Min 6 characters"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.errorText}>{newErr || ' '}</Text>

        <Text style={styles.label}>Confirm new password</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Confirm new password"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.errorText}>{confirmErr || ' '}</Text>

        <Button
          onPress={onSave}
          disabled={!canSave}
          style={[
            styles.saveBtn,
            {
              backgroundColor: canSave
                ? theme.colors.primary
                : theme.colors.card,
              borderColor: theme.colors.border ?? theme.colors.inputBorder,
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
            {saving ? 'Saving...' : 'Update Password'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
