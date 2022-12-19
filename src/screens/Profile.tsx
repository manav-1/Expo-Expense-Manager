import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {launchImageLibraryAsync} from 'expo-image-picker';
import {App} from '../state/store';
import {observer} from 'mobx-react';
import {MainContainer} from '../customComponents/styledComponents';
import moment from 'moment';
import {snackbar} from '../state/snackbar';

const tempImage = require('../../assets/programmer.png');

const Profile = observer(() => {
  const [userName, setUserName] = React.useState<string>();
  const [userEmail, setUserEmail] = React.useState<string>();
  const [image, setImage] = React.useState<string | null>();
  const [isLoading, setIsLoading] = React.useState<Boolean>(false);

  React.useEffect(() => {
    (async () => {
      setUserName(App.user.userName!);
      setUserEmail(App.user.userEmail!);
      setImage(App.user.userProfilePic);
    })();
  }, []);
  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaType: 'photo',
      quality: 1,
      base64: true,
    });
    console.log(result);

    if (!result.cancelled) if (result.uri) setImage(result.base64);

    // uploadImage(result.uri);
  };
  const updateProfile = async () => {
    try {
      setIsLoading(true);
      await App.updateUser({userName, userEmail}, String(App.user?.userId));
      snackbar.openSnackBar('Profile updated successfully');
      setIsLoading(false);
    } catch (err) {}
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 20,
      fontFamily: App.theme.primaryFont.MEDIUM,
      color: App.theme.secondary,
    },
    expenseInput: {
      width: 200,
      borderBottomWidth: 1,
      borderBottomColor: App.theme.background,
      color: App.theme.secondary,
      borderRadius: 1,
      marginBottom: 15,
    },
    saveButton: {
      backgroundColor: App.theme.secondary,
      width: 160,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 10,
      marginVertical: 10,
      paddingVertical: 10,
    },
    saveText: {
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.REGULAR,
      fontSize: 16,
      marginRight: 5,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    editProfileButton: {
      position: 'absolute',
      right: -10,
      bottom: -10,
      backgroundColor: App.theme.secondary + 'dd',
      padding: 10,
      paddingLeft: 12,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraText: {fontSize: 16, textAlign: 'right', marginTop: 2},
    editImageContainer: {position: 'absolute', right: 10, top: 10},
    tabBarTitle: {
      fontSize: 25,
      paddingVertical: 10,
      marginVertical: 5,
      color: App.theme.secondary,
      fontFamily: App.theme.primaryFont.MEDIUM,
    },
    tabStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: App.theme.primary,
    },
  });

  return (
    <MainContainer>
      <View style={styles.tabStyles}>
        <Text style={styles.tabBarTitle}>Profile</Text>
      </View>
      <View style={styles.editImageContainer}>
        <Image
          source={
            image
              ? {
                  uri: `data:image/jpeg;base64,${image}`,
                }
              : tempImage
          }
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={pickImage} style={styles.editProfileButton}>
          <FontAwesome5 name="edit" size={18} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.text}>Name</Text>
        <TextInput
          value={userName}
          onChangeText={(val: string) => setUserName(val)}
          style={styles.expenseInput}
        />
        <Text style={styles.text}>Email</Text>
        <TextInput
          value={userEmail}
          editable={false}
          style={styles.expenseInput}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() =>
              App.updateTheme(App.themeType === 'dark' ? 'light' : 'dark')
            }
            activeOpacity={0.5}
            style={styles.saveButton}>
            <Text style={styles.saveText}>Change Theme</Text>
            <Ionicons
              name="color-palette-outline"
              color={App.theme.primary}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={updateProfile}
            activeOpacity={0.5}
            style={styles.saveButton}>
            <Text style={styles.saveText}>Save Profile</Text>
            <Ionicons
              name="bookmark-outline"
              color={App.theme.primary}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.text, styles.extraText]}>
            Account Created on
          </Text>
          <Text style={[styles.text, styles.extraText]}>
            {App.user
              ? moment(App.user.createdAt).format('ddd DD MMM, YYYY')
              : null}
          </Text>
        </View>
      </View>
    </MainContainer>
  );
});

export default Profile;
