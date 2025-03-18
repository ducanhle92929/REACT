import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import WrapInput from './WrapInput';
import images from './images';

interface CustomInputProps extends TextInputProps {
  title?: string;
  withColon?: boolean;
  required?: boolean;
  error?: string | null;
  description?: string;
  showClear?: boolean;
  eyePassword?: boolean;
  renderLeft?: React.ReactNode;
  renderRight?: React.ReactNode;
  style?: ViewStyle;
  onChangeText?: (text: string) => void;
  value?: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  title = 'Input',
  withColon = true,
  required = false,
  error = '',
  description = '',
  value = '',
  onChangeText,
  placeholder = '',
  showClear = true,
  eyePassword = false,
  renderLeft = null,
  renderRight = null,
  style = {},
  secureTextEntry: propSecureTextEntry,
  ...rest
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(
    propSecureTextEntry || false
  );

  useEffect(() => {
    if (propSecureTextEntry !== undefined) {
      setSecureTextEntry(propSecureTextEntry);
    }
  }, [propSecureTextEntry]);

  const inputRef = useRef<TextInput>(null);

  const renderLeftComponent = (): React.ReactNode => {
    return null;
  };

  const renderRightComponent = (): React.ReactNode => {
    return null;
  };

  const handleFocus = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ): void => {
    setIsFocus(true);
    if (rest.onFocus) rest.onFocus(e);
  };

  const handleBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ): void => {
    setIsFocus(false);
    if (rest.onBlur) rest.onBlur(e);
  };

  const handleClear = (): void => {
    if (onChangeText) onChangeText('');
    inputRef.current?.focus();
  };

  const toggleSecureTextEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.wrapper}>
      <WrapInput
        title={title}
        withColon={withColon}
        required={required}
        error={error}
        description={description}
        isFocus={isFocus}
      >
        <View
          style={[
            styles.container,
            style,
            isFocus && styles.focusedContainer,
            error && styles.errorContainer,
          ]}
        >
          <View style={styles.containerInput}>
            {renderLeft || renderLeftComponent()}
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry}
              autoCapitalize={rest.autoCapitalize || 'none'}
              {...rest}
            />
            {showClear && !!value && (
              <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
                <Image source={images.clear} style={styles.icon} />
              </TouchableOpacity>
            )}
            {eyePassword && (
              <TouchableOpacity
                onPress={toggleSecureTextEntry}
                style={styles.iconButton}
              >
                <Image
                  source={secureTextEntry ? images.eyeClosed : images.eyeOpen}
                  style={styles.icon}
                />
              </TouchableOpacity>
            )}
            {!!error && (
              <Image
                source={images.error}
                style={[styles.icon, { marginRight: 12 }]}
              />
            )}
            {renderRight || renderRightComponent()}
          </View>
        </View>
      </WrapInput>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  focusedContainer: {
    borderColor: '#0066cc',
  },
  errorContainer: {
    borderColor: 'red',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  iconButton: {
    padding: 6,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
