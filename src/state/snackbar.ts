import {types} from 'mobx-state-tree';
import {InterstitialAd} from 'react-native-google-mobile-ads';

const INTERSTITIAL_AD_ID = 'ca-app-pub-3483658732327025/8677275257';

const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_ID, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['finance', 'expense', 'stocks'],
});

const SnackBar = types
  .model('SnackBar', {
    open: types.boolean,
    text: types.string,
  })
  .views(self => ({
    get isOpen() {
      return self.open;
    },
  }))
  .actions(self => ({
    openSnackBar(message: string) {
      self.open = true;
      self.text = message;
      interstitial.load();
    },
    closeSnackBar() {
      try {
        self.open = false;
        interstitial.show();
      } catch (err) {}
    },
  }));

export const snackbar = SnackBar.create({open: false, text: ''});

export default SnackBar;
