import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleWidth, scaleHeight } from '../../utils/responsive';

type KeyboardType = 'numeric' | 'default' | 'email-address' | 'phone-pad';

type OTPInputProps = {
  length?: number;
  value?: string; // controlled value (optional)
  onChange?: (value: string) => void;
  autoFocus?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  slotStyle?: StyleProp<ViewStyle>;

  disabled?: boolean;
  keyboardType?: KeyboardType;
};

const padToLength = (val: string, length: number) =>
  (val ?? '').slice(0, length).padEnd(length, '');

export default function OTPInput({
  length = 6,
  value,
  onChange,
  autoFocus = false,
  containerStyle,
  inputStyle,
  slotStyle,
  disabled = false,
  keyboardType = 'numeric',
}: OTPInputProps) {
  const { theme } = useTheme();

  const isControlled = typeof value === 'string';
  const [internal, setInternal] = useState<string>(() =>
    (value ?? '').slice(0, length),
  );

  // Keep refs stable
  const inputsRef = useRef<Array<TextInput | null>>([]);

  // Sync internal with controlled value
  useEffect(() => {
    if (isControlled) setInternal((value ?? '').slice(0, length));
  }, [isControlled, value, length]);

  const currentValue = isControlled ? value ?? '' : internal;

  const chars = useMemo(() => {
    return padToLength(currentValue, length).split('').slice(0, length);
  }, [currentValue, length]);

  const emitChange = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const setCharAt = useCallback(
    (idx: number, char: string) => {
      const arr = padToLength(currentValue, length).split('').slice(0, length);
      arr[idx] = char;
      // keep only actual filled chars at end trimmed
      const next = arr.join('').replace(/\s+$/g, '');
      emitChange(next);
    },
    [currentValue, length, emitChange],
  );

  const focusIndex = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < length) {
        inputsRef.current[idx]?.focus();
      }
    },
    [length],
  );

  const focusNext = useCallback(
    (idx: number) => {
      const next = idx + 1;
      if (next < length) focusIndex(next);
      else Keyboard.dismiss();
    },
    [length, focusIndex],
  );

  const focusPrev = useCallback(
    (idx: number) => {
      const prev = idx - 1;
      if (prev >= 0) focusIndex(prev);
    },
    [focusIndex],
  );

  // ✅ Paste support: if user pastes "123456" into a box, fill all
  const applyBulkInput = useCallback(
    (startIndex: number, text: string) => {
      const clean = text.replace(/\s/g, '');
      if (!clean) return;

      const arr = padToLength(currentValue, length).split('').slice(0, length);

      let j = 0;
      for (let i = startIndex; i < length && j < clean.length; i++) {
        arr[i] = clean[j];
        j += 1;
      }

      const next = arr.join('').replace(/\s+$/g, '');
      emitChange(next);

      const nextFocus = Math.min(startIndex + clean.length, length - 1);
      focusIndex(nextFocus);
      if (startIndex + clean.length >= length) Keyboard.dismiss();
    },
    [currentValue, length, emitChange, focusIndex],
  );

  const handleKeyPress =
    (idx: number) => (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key !== 'Backspace') return;

      const charHere = chars[idx] ?? '';
      if (charHere) {
        // if there's a char, clear it
        setCharAt(idx, '');
      } else {
        // if empty, go back and clear previous
        const prev = idx - 1;
        if (prev >= 0) {
          setCharAt(prev, '');
          focusPrev(idx);
        }
      }
    };

  const handleChangeText = (idx: number) => (text: string) => {
    if (disabled) return;

    // bulk paste or autofill
    if (text.length > 1) {
      applyBulkInput(idx, text);
      return;
    }

    if (!text) {
      setCharAt(idx, '');
      return;
    }

    setCharAt(idx, text.charAt(0));
    focusNext(idx);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }).map((_, i) => {
        const char = chars[i] ?? '';
        return (
          <View
            key={`slot-${i}`}
            style={[
              styles.slot,
              {
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.card,
              },
              slotStyle,
            ]}
          >
            <TextInput
              ref={r => {
                inputsRef.current[i] = r;
              }}
              value={char}
              onChangeText={handleChangeText(i)}
              onKeyPress={handleKeyPress(i)}
              keyboardType={keyboardType}
              maxLength={length} // ✅ allow paste; we still control per-slot display
              editable={!disabled}
              selectTextOnFocus
              autoFocus={autoFocus && i === 0}
              style={[
                styles.input,
                { color: theme.colors.textPrimary },
                inputStyle,
              ]}
              returnKeyType={i === length - 1 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (i < length - 1) focusNext(i);
                else Keyboard.dismiss();
              }}
            />
          </View>
        );
      })}
    </View>
  );
}

/* Optional helper subcomponents (typed) */

export function OTPGroup({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[{ flexDirection: 'row' }, style]}>{children}</View>;
}

export function OTPSlot({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.slot, style]}>{children}</View>;
}

export function OTPSeparator({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      {children ?? <Text style={{ fontSize: normalizeFont(14) }}>-</Text>}
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    width: scaleWidth(48),
    height: scaleHeight(48),
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: scaleWidth(8), // ✅ better than gap for RN compatibility
  },
  input: {
    fontFamily: Fonts.GilroyBold,
    fontSize: normalizeFont(18),
    textAlign: 'center',
    padding: 0,
    margin: 0, 
    width: '100%',
    height: '100%',
  },
});

