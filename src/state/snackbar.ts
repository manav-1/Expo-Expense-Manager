import {types} from 'mobx-state-tree';
import {InterstitialAd} from 'react-native-google-mobile-ads';

const INTERSTITIAL_AD_ID = 'xx-xxx-xxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

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
        // Random Chance to show an add, on closing the snackbar
        if (Math.random() <= 0.5)
          interstitial
            .show()
            .then(() => console.log('Ad shown'))
            .catch(() => console.log('Ad not Shown'));
      } catch (err) {}
    },
  }));

export const snackbar = SnackBar.create({open: false, text: ''});

export default SnackBar;
