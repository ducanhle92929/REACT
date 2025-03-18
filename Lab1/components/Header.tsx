import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

interface HeaderProps {
  leftComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  title?: string;
  iconLeft?: ImageSourcePropType;
  iconLeftColor?: string;
  iconRight?: ImageSourcePropType;
  iconRightColor?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  leftIconSize?: number;
  rightIconSize?: number;
  numberOfLines?: number;
}

const Header: React.FC<HeaderProps> = ({
  leftComponent,
  centerComponent,
  rightComponent,
  title = '',
  iconLeft,
  iconLeftColor = '#000',
  iconRight,
  iconRightColor = '#000',
  onPressLeft,
  onPressRight,
  leftIconSize = 24,
  rightIconSize = 24,
  numberOfLines = 1,
}) => {
  const router = useRouter();
  const handleGoBack = () => {
    Alert.alert('Bạn đã bấm nút back');
  };

  const renderLeft = () => {
    return (
      leftComponent || (
        <View>
          {iconLeft ? (
            <Pressable hitSlop={15} onPress={onPressLeft || handleGoBack}>
              <Image
                source={iconLeft}
                style={{
                  tintColor: iconLeftColor,
                  width: leftIconSize,
                  height: leftIconSize,
                }}
                resizeMode="contain"
              />
            </Pressable>
          ) : (
            <View style={{ width: leftIconSize, height: leftIconSize }}></View>
          )}
        </View>
      )
    );
  };

  const renderCenter = () => {
    return (
      centerComponent || (
        <View style={styles.containerCenter}>
          <Text style={styles.title} numberOfLines={numberOfLines}>
            {title}
          </Text>
        </View>
      )
    );
  };

  const renderRight = () => {
    return (
      rightComponent || (
        <View style={styles.containerRight}>
          {iconRight ? (
            <Pressable hitSlop={15} onPress={onPressRight}>
              <Image
                source={iconRight}
                style={{
                  tintColor: iconRightColor,
                  width: rightIconSize,
                  height: rightIconSize,
                }}
                resizeMode="contain"
              />
            </Pressable>
          ) : (
            <View style={{ width: rightIconSize, height: rightIconSize }} />
          )}
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      {renderLeft()}
      {renderCenter()}
      {renderRight()}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  containerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
