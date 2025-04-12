// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { useState } from 'react';
// import { Button, Text, View } from 'react-native';

// export default function GoogleSignInComponent() {
//     const [userInfo, setUserInfo] = useState<any>(null);

//     const onGoogleSignIn = async () => {
//         try {
//             // Check if the user is already signed in
//             await GoogleSignin.hasPlayServices();
//             const user = await GoogleSignin.signIn();
//             setUserInfo(user);
//         } catch (error: any) {
//             if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//                 console.log('User cancelled the login flow');
//             } else if (error.code === statusCodes.IN_PROGRESS) {
//                 console.log('Sign in is in progress');
//             } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//                 console.log('Play Services not available');
//             } else {
//                 console.log('Some other error happened:', error);
//             }
//         }
//     };

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Button title="Đăng nhập với Google" onPress={onGoogleSignIn} color="#f4a261" />
//             {userInfo && (
//                 <View style={{ marginTop: 20 }}>
//                     <Text>Chào {userInfo.user.name}</Text>
//                     <Text>Nguyen Van A</Text>
//                     <Text>{userInfo.user.email}</Text>
//                     <Text>0987277233</Text>
//                 </View>
//             )}
//         </View>
//     );
// }