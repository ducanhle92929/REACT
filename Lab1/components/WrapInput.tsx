import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

interface WrapInputProps {
  title?: string;
  withColon?: boolean;
  required?: boolean;
  error?: string | null;
  description?: string;
  isFocus?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const WrapInput: React.FC<WrapInputProps> = ({
  title,
  withColon = false,
  required = false,
  error,
  description,
  isFocus = false,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isFocus && styles.focusedTitle]}>
            {title}
            {withColon ? ':' : ''}
            {required && <Text style={styles.requiredMark}>*</Text>}
          </Text>
        </View>
      )}

      {children}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  } as TextStyle,
  focusedTitle: {
    color: '#0066cc',
  },
  requiredMark: {
    color: 'red',
    marginLeft: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default WrapInput;
