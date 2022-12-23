/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, StyleSheet, Image, Button} from 'react-native';
import {Headline} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {App} from '../state/store';
import {observer} from 'mobx-react';

const Logo1 = require('../../assets/logo1.png');
const Logo2 = require('../../assets/logo2.png');
const Logo3 = require('../../assets/logo3.png');
const Logo4 = require('../../assets/logo4.png');

const HomeScreen = observer(({navigation}: {navigation: any}) => {
  const logo = [Logo1, Logo2, Logo3, Logo4];
  const Logo = logo[Math.floor(Math.random() * logo.length)];
  const colors = App.theme;

  React.useEffect(() => {
    (async () => {
      // await App.loadUser();
      // await App.loadAccounts();
      // await App.loadExpenses({take: 10});
      // await App.loadNotes();

      if (await AsyncStorage.getItem('expense_user')) {
        navigation.push('HomeNav');
      } else {
        navigation.push('Login');
      }
    })();
  }, [navigation]);
  // No advert ready to show yet

  const styles = StyleSheet.create({
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.secondary,
    },
    view: {
      position: 'absolute',
      bottom: 0,
      display: 'flex',
      flexDirection: 'row',
    },
    text: {
      fontSize: 40,
      fontFamily: App.theme.secondaryFont.BOLD,
      lineHeight: 45,
      color: colors.primary,
      textAlign: 'center',
    },
    dollar: {
      alignSelf: 'flex-end',
      fontSize: 30,
      fontFamily: App.theme.secondaryFont.BOLD,
      lineHeight: 48,
      color: colors.primary,
      textAlign: 'center',
    },
    heading: {
      position: 'absolute',
      top: 400,
      fontFamily: App.theme.secondaryFont.MEDIUM,
      padding: 10,
      width: '100%',
      textAlign: 'center',
      color: colors.primary,
      backgroundColor: colors.accent,
      fontSize: 26,
    },
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.textContainer]}>
      <Image
        source={Logo}
        style={{
          width: '100%',
          height: 250,
          position: 'absolute',
          top: 100,
        }}
      />
      <Headline style={styles.heading}>Expense Manager</Headline>
      <View style={styles.view}>
        <Text style={styles.text}>Take hold{'\n'}of your finance</Text>
        <Text style={styles.dollar}>$</Text>
      </View>
    </View>
  );
});

export default HomeScreen;
