import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  GestureResponderEvent,
  KeyboardTypeOptions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {observer} from 'mobx-react';
import Animated, {EasingNode as Easing} from 'react-native-reanimated';
import {LoginSignupContainer} from '../customComponents/styledComponents';
import {App} from '../state/store';
import {snackbar} from '../state/snackbar';

const source = {
  uri: 'https://images.unsplash.com/photo-1583412015884-d996c38c7378?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=796&q=80',
};

const LoginScreen = observer(({navigation}: {navigation: any}) => {
  const [loginInfo, setLoginInfo] = React.useState({
    userEmail: '',
    userPassword: '',
  });
  const [signupInfo, setSignupInfo] = React.useState({
    userEmail: '',
    userPassword: '',
    userName: '',
  });

  const [loginSignupVisibility, setLoginSignupVisibility] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    (() => {
      navigation.addListener('beforeRemove', (e: {preventDefault: () => any}) =>
        e.preventDefault(),
      );
    })();
    const checkLoggedIn = async () => {
      if (await AsyncStorage.getItem('expense_user')) {
        navigation.push('HomeNav');
      }
    };
    checkLoggedIn();
  }, [navigation]);

  const loginHeight = React.useRef(new Animated.Value(0)).current;
  const signupHeight = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (loginSignupVisibility) {
      Animated.timing(loginHeight, {
        duration: 300,
        toValue: 300,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(loginHeight, {
        duration: 300,
        toValue: 0,
        easing: Easing.ease,
      }).start();
    }
  }, [loginSignupVisibility]);
  React.useEffect(() => {
    if (loginSignupVisibility) {
      Animated.timing(signupHeight, {
        duration: 300,
        toValue: 0,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(signupHeight, {
        duration: 300,
        toValue: 300,
        easing: Easing.ease,
      }).start();
    }
  }, [loginSignupVisibility]);

  const handleGoogleLogin = async () => {
    snackbar.openSnackBar("Google Login isn't supported yet");
  };

  const handleFacebookLogin = async () => {
    snackbar.openSnackBar("Facebook login isn't supported yet");
  };

  const styles = StyleSheet.create({
    basicContainerStyle: {
      borderRadius: 5,
      alignItems: 'center',
    },
    loginContainer: {
      // @ts-ignore animated height styles
      maxHeight: loginHeight,
      overflow: 'hidden',
      backgroundColor: App.theme.primary + 'dd',
      width: 350,
    },
    signupContainer: {
      // @ts-ignore animated height styles
      maxHeight: signupHeight,
      overflow: 'hidden',
      backgroundColor: App.theme.primary + 'dd',
      width: 350,
    },
    changeButtonStyle: {
      backgroundColor: App.theme.primary,
      width: 350,
      padding: 5,
      paddingVertical: 10,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    changeButtonText: {
      color: App.theme.secondary,
      fontFamily: App.theme.primaryFont.MEDIUM,
      fontSize: 16,
    },
    loginSignupButtonText: {
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.BOLD,
      fontSize: 16,
    },
    loginSignupButton: {
      backgroundColor: App.theme.secondary,
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    heading: {
      fontFamily: App.theme.primaryFont.BOLD,
      fontSize: 22,
      color: App.theme.secondary,
    },
    containerPadding: {
      paddingVertical: 5,
      // height: '100%',
      width: '100%',
      // justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    inputContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      height: 50,
      backgroundColor: App.theme.primary + 'dd',
      justifyContent: 'space-between',
      margin: 10,
      borderRadius: 5,
    },
    inputContainerHeading: {
      fontFamily: App.theme.primaryFont.MEDIUM,
      fontSize: 16,
    },
    input: {
      width: '75%',
      borderBottomWidth: 1,
      borderBottomColor: App.theme.primary,
      marginLeft: 10,
      paddingVertical: 5,
      paddingLeft: 5,
    },
    loginButton: {
      alignSelf: 'flex-end',
      backgroundColor: App.theme.primary,
      borderRadius: 5,
    },
    buttonText: {
      color: App.theme.secondary,
      marginHorizontal: 25,
      marginVertical: 8,
      fontFamily: App.theme.primaryFont.MEDIUM,
    },
  });
  const loginInputs: {
    heading: string;
    placeholder: string;
    secret: boolean;
    variableSelector: keyof typeof loginInfo;
  }[] = [
    {
      heading: 'Email',
      placeholder: 'Enter your email',
      secret: false,
      variableSelector: 'userEmail',
    },
    {
      heading: 'Password',
      placeholder: 'Enter your password',
      secret: true,
      variableSelector: 'userPassword',
    },
  ];
  const signUpInputs: {
    heading: string;
    placeholder: string;
    secret: boolean;
    variableSelector: keyof typeof signupInfo;
  }[] = [
    {
      heading: 'Username',
      placeholder: 'Enter your username',
      secret: false,
      variableSelector: 'userName',
    },
    {
      heading: 'Email',
      placeholder: 'Enter your email',
      secret: false,
      variableSelector: 'userEmail',
    },
    {
      heading: 'Password',
      placeholder: 'Enter your password',
      secret: true,
      variableSelector: 'userPassword',
    },
  ];

  const inputs: {
    heading: string;
    styles: keyof typeof styles;
    onPress: (event: GestureResponderEvent) => void;
    textInputs: typeof signUpInputs | typeof loginInputs;
    variables: typeof signupInfo | typeof loginInfo;
    onChangeFunction: Function;
  }[] = [
    {
      heading: 'Login',
      onPress: async () => {
        await App.login(loginInfo, navigation);
      },
      textInputs: loginInputs,
      styles: 'loginContainer',
      variables: loginInfo,
      onChangeFunction: (value: string, selector: string) =>
        setLoginInfo({...loginInfo, [selector]: value}),
    },
    {
      heading: 'Signup',
      onPress: async () => {
        await App.signup(signupInfo, navigation);
      },
      textInputs: signUpInputs,
      styles: 'signupContainer',
      variables: signupInfo,
      onChangeFunction: (value: string, selector: string) =>
        setSignupInfo({...signupInfo, [selector]: value}),
    },
  ];

  return (
    <LoginSignupContainer source={source}>
      <View style={{alignSelf: 'flex-end', marginBottom: 40}}>
        {inputs.map(input => (
          <Animated.View
            style={[styles.basicContainerStyle, styles[input.styles]]}
            key={input.heading}>
            <View style={styles.containerPadding}>
              <Text style={styles.heading}>{input.heading}</Text>

              {input.textInputs.map(textInput => (
                <View style={styles.inputContainer} key={textInput.heading}>
                  <Text style={styles.inputContainerHeading}>
                    {textInput.heading}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={textInput.placeholder}
                    secureTextEntry={textInput.secret}
                    value={input.variables[textInput.variableSelector]}
                    onChangeText={val =>
                      input.onChangeFunction(val, textInput.variableSelector)
                    }
                  />
                </View>
              ))}
              <TouchableOpacity
                onPress={input.onPress}
                style={styles.loginButton}>
                <Text style={styles.buttonText}>{input.heading}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
        <View style={styles.changeButtonStyle}>
          <Text style={styles.changeButtonText}>
            {loginSignupVisibility
              ? "Don't have an account?"
              : 'Already have an account?'}
            &nbsp;&nbsp;
          </Text>
          <TouchableOpacity
            style={styles.loginSignupButton}
            onPress={() => setLoginSignupVisibility(!loginSignupVisibility)}>
            <Text style={styles.loginSignupButtonText}>
              {loginSignupVisibility ? 'Signup' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LoginSignupContainer>
  );
});

export default LoginScreen;
