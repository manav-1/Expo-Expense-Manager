import {StatusBar, Text, StyleSheet} from 'react-native';
import * as React from 'react';
import {Provider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import {observer} from 'mobx-react';
import {loadAsync, unloadAllAsync} from 'expo-font';
import StackNavigation from './src/navigation/HomeStack';
import {App as AppStore} from './src/state/store';
import {snackbar} from './src/state/snackbar';

const App = observer(() => {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      await loadAsync({
        'Karla-Bold': require('./assets/fonts/Karla-Bold.ttf'),
        'Karla-Medium': require('./assets/fonts/Karla-Medium.ttf'),
        'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
        'NotoSansMono-Regular': require('./assets/fonts/NotoSansMono-Regular.ttf'),
        'NotoSansMono-Bold': require('./assets/fonts/NotoSansMono-Bold.ttf'),
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
        'ReadexPro-Regular': require('./assets/fonts/ReadexPro-Regular.ttf'),
        'Figtree-Medium': require('./assets/fonts/Figtree/Figtree-Medium.ttf'),
        'Figtree-Bold': require('./assets/fonts/Figtree/Figtree-Bold.ttf'),
        'Figtree-ExtraBold': require('./assets/fonts/Figtree/Figtree-ExtraBold.ttf'),
        'Figtree-Black': require('./assets/fonts/Figtree/Figtree-Black.ttf'),
        'Figtree-Light': require('./assets/fonts/Figtree/Figtree-Light.ttf'),
        'Figtree-Regular': require('./assets/fonts/Figtree/Figtree-Regular.ttf'),
        'SpaceGrotesk-Medium': require('./assets/fonts/spaceGrotesk/SpaceGrotesk-Medium.ttf'),
        'SpaceGrotesk-Bold': require('./assets/fonts/spaceGrotesk/SpaceGrotesk-Bold.ttf'),
        'SpaceGrotesk-SemiBold': require('./assets/fonts/spaceGrotesk/SpaceGrotesk-SemiBold.ttf'),
        'SpaceGrotesk-Light': require('./assets/fonts/spaceGrotesk/SpaceGrotesk-Light.ttf'),
        'SpaceGrotesk-Regular': require('./assets/fonts/spaceGrotesk/SpaceGrotesk-Regular.ttf'),
      });
      setLoaded(true);
    })();
    return () => {
      // (async () => {
      //   await unloadAllAsync();
      // })();
    };
  }, []);

  if (!loaded) return null;

  const styles = StyleSheet.create({
    snackBarStyle: {backgroundColor: AppStore.theme.secondary},
    snackBarTextStyle: {
      color: AppStore.theme.primary,
      fontFamily: AppStore.theme.primaryFont.MEDIUM,
    },
  });

  return (
    <Provider>
      <NavigationContainer>
        <StackNavigation />
        <StatusBar hidden />
        <Snackbar
          visible={snackbar.open}
          duration={1500}
          style={styles.snackBarStyle}
          onDismiss={() => snackbar.closeSnackBar()}>
          <Text style={styles.snackBarTextStyle}>{snackbar.text}</Text>
        </Snackbar>
      </NavigationContainer>
    </Provider>
  );
});

export default App;
