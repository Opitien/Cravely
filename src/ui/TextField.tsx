import React, { forwardRef, useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string;
  hint?: string;
  /** Adds a show/hide toggle for password fields. */
  password?: boolean;
}

/** iOS inset text field: tertiary fill, 10pt corners, tint ring on focus, animated helper text. */
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
        <Text variant="footnoteStrong" tone="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, multiline && styles.multiline, focused && styles.focused, error ? styles.errored : null]}>
        {icon && <Icon name={icon} size={20} color={focused ? t.colors.primary : t.colors.tertiaryLabel} />}
        <TextInput
          ref={ref}
          placeholderTextColor={t.colors.tertiaryLabel}
          selectionColor={t.colors.primary}
          cursorColor={t.colors.primary}
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
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={t.colors.tertiaryLabel} />
          </Pressable>
        )}
      </View>
      <AnimatePresence>
        {error ? (
          <MotiView key="error" from={{ opacity: 0, translateY: -4 }} animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0 }} transition={{ type: 'timing', duration: 180 }}>
            <Text variant="footnote" tone="danger" style={styles.helper}>
              {error}
            </Text>
          </MotiView>
        ) : hint ? (
          <MotiView key="hint" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'timing', duration: 180 }}>
            <Text variant="footnote" tone="secondary" style={styles.helper}>
              {hint}
            </Text>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </View>
  );
});

const useStyles = makeStyles((t) => ({
  wrapper: { marginBottom: t.spacing.lg },
  label: { marginBottom: 6, marginLeft: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm + 2,
    minHeight: 50,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.tertiaryFill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  multiline: { alignItems: 'flex-start', paddingVertical: t.spacing.md },
  focused: { borderColor: t.colors.primary, backgroundColor: t.colors.secondaryGroupedBackground },
  errored: { borderColor: t.colors.danger },
  input: {
    flex: 1,
    ...t.type.body,
    color: t.colors.label,
    paddingVertical: 12,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top', paddingVertical: 0 },
  helper: { marginTop: 6, marginLeft: 4 },
}));
