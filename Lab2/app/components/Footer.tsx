import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { memo } from 'react';

type FooterType = {
  timeUpdate: string;
  backgroundColor: string;
};

const Footer: React.FC<FooterType> = memo((props) => {
  const { timeUpdate, backgroundColor } = props;
  return (
    <View
      style={containerStyle({
        height: 100,
        backgroundColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Text style={styles.text}>
        Thời gian bạn cập nhật thông tin: {timeUpdate}
      </Text>
    </View>
  );
});

export default Footer;

const containerStyle = (props: ViewStyle) => ({
  ...props,
});

const styles = StyleSheet.create({
  text: {
    padding:0,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
   
  },
});
