import {
  View,
  Text,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import {App} from '../state/store';
import {observer} from 'mobx-react';
import {ReactComponentElement} from 'react';
const MainContainer = observer(
  ({children}: {children: ReactComponentElement<typeof View>[]}) => (
    <View
      style={{
        backgroundColor: App.theme.primary,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 60,
        flex: 1,
        paddingHorizontal: 10,
      }}>
      {children}
    </View>
  ),
);
const MinorHeading = observer(
  ({children, style}: {children: any; style?: any}) => (
    <Text
      style={[
        {
          backgroundColor: App.theme.primary,
          color: App.theme.secondary,
          fontSize: 20,
          fontFamily: App.theme.primaryFont.REGULAR,
        },
        style ? {...style} : null,
      ]}>
      {children}
    </Text>
  ),
);

const LoginSignupContainer = observer(
  ({children, source}: {children: any; source: ImageSourcePropType}) => (
    <ImageBackground
      style={[
        StyleSheet.absoluteFill,
        {justifyContent: 'center', alignItems: 'center', flexDirection: 'row'},
      ]}
      source={source}>
      {children}
    </ImageBackground>
  ),
);

export {MainContainer, MinorHeading, LoginSignupContainer};
