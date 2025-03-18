import { Image, StyleSheet, Platform, View } from 'react-native';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import { useCallback, useEffect, useState } from 'react';

type UserType = {
  name: string;
  avatar: string;
};

const colors = ['white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple'];

export default function HomeScreen() {
  const [user, setUser] = useState<UserType>({
    name: 'Chưa có tên',
    avatar:
      'https://bloganchoi.com/wp-content/uploads/2022/05/hinh-avatar-doi-dep-2022-6-696x696.jpg',
  });

  const [lastTimeUpdate, setLastTimeUpdate] = useState(
    'Bạn chưa cập nhật thông tin'
  );

  const [footerColor, setFooterColor] = useState(colors[0]);

  const handleUpdateInfo = useCallback((_user: UserType) => {
    setUser(_user);
  }, []);

  const handleRandomColor = useCallback(() => {
    const numberRan = Math.floor(Math.random() * colors.length);
    setFooterColor(colors[numberRan]);
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate =
      currentDate.getDate() +
      '/' +
      (currentDate.getMonth() + 1) +
      '/' +
      currentDate.getFullYear() +
      ' ' +
      currentDate.getHours() +
      ':' +
      currentDate.getMinutes() +
      ':' +
      currentDate.getSeconds();

    setLastTimeUpdate(formattedDate);
  }, [user]);

  return (
    <View style={styles.container}>
      <Header user={user} />
      <Body style={styles.containe}
        onUpdateInfo={handleUpdateInfo}
        onClickChangeBgFooter={handleRandomColor}
      />
      <Footer  timeUpdate={lastTimeUpdate} backgroundColor={footerColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top :0,
    padding:50,
    flex: 1,
  },
  containe:{
    marginBottom :50,

  }
});
