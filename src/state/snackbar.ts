import {types} from 'mobx-state-tree';

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
    },
    closeSnackBar() {
      self.open = false;
    },
  }));

export const snackbar = SnackBar.create({open: false, text: ''});

export default SnackBar;
