import React, { forwardRef, useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '../theme';
import { Text } from './Text';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string;
  hint?: string;
  /** Adds a show/hide toggle for password fields. */
  password?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, icon, error, hint, password, multiline, style, onFocus, onBlur, ...rest },
  ref
) {
  const t = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" tone="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          multiline && styles.multiline,
          focused && styles.focused,
          error ? styles.errored : null,
        ]}
      >
        {icon && <Ionicons name={icon} size={20} color={focused ? t.colors.primary : t.colors.textMuted} />}
        <TextInput
          ref={ref}
          placeholderTextColor={t.colors.textMuted}
          selectionColor={t.colors.primary}
          secureTextEntry={password && hidden}
          multiline={multiline}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          {...rest}
        />
        {password && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={t.colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" style={styles.helper}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted" style={styles.helper}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const useStyles = makeStyles((t) => ({
  wrapper: { marginBottom: t.spacing.lg },
  label: { marginBottom: 6, marginLeft: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm + 2,
    minHeight: 54,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  multiline: { alignItems: 'flex-start', paddingVertical: t.spacing.md },
  focused: { borderColor: t.colors.primary, backgroundColor: t.colors.surface },
  errored: { borderColor: t.colors.danger },
  input: {
    flex: 1,
    fontFamily: t.fonts.medium,
    fontSize: 16,
    color: t.colors.text,
    paddingVertical: 14,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top', paddingVertical: 0 },
  helper: { marginTop: 6, marginLeft: 2 },
}));
