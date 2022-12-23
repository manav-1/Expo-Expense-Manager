import {SnapshotIn, types} from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import {ExpenseClient} from '../axios/client';
import {snackbar} from './snackbar';
import {themeDark, themeLight} from './theme';

const Expense = types.model('Expense', {
  expenseId: types.optional(types.identifier, '0'),
  createdAt: types.optional(types.string, new Date(Date.now()).toISOString()),
  updatedAt: types.optional(types.string, new Date(Date.now()).toISOString()),
  accountId: types.optional(types.string, '0'),
  account: types.maybeNull(
    types.model('ExpenseAccount', {
      debit: types.string,
      credit: types.string,
      accountLabel: types.string,
      userId: types.string,
      accountId: types.string,
    }),
  ),
  expenseType: types.string,
  value: types.number,
  date: types.string,
  description: types.string,
  expenseWay: types.string,
});

const Note = types.model('Note', {
  noteId: types.optional(types.identifier, '0'),
  noteText: types.string,
  date: types.string,
  createdAt: types.optional(types.string, new Date(Date.now()).toISOString()),
  updatedAt: types.optional(types.string, new Date(Date.now()).toISOString()),
  userId: types.optional(types.string, '0'),
});

const User = types.model('User', {
  userId: types.optional(types.identifier, '0'),
  userName: types.maybeNull(types.string),
  userEmail: types.maybeNull(types.string),
  userProfilePic: types.maybeNull(types.string),
  createdAt: types.optional(types.string, new Date(Date.now()).toISOString()),
  updatedAt: types.optional(types.string, new Date(Date.now()).toISOString()),
  expenseTypes: types.array(types.string),
  expenseWays: types.array(types.string),
});

const Account = types.model('Account', {
  accountId: types.optional(types.identifier, '0'),
  userId: types.string,
  debit: types.string,
  credit: types.string,
  accountLabel: types.string,
  expenses: types.optional(types.array(Expense), []),
});

const primaryFont = types.model('primaryFont', {
  LIGHT: types.string,
  REGULAR: types.string,
  MEDIUM: types.string,
  BOLD: types.string,
  SEMIBOLD: types.string,
  EXTRABOLD: types.string,
  BLACK: types.string,
});

const secondaryFont = types.model('secondaryFont', {
  LIGHT: types.string,
  REGULAR: types.string,
  MEDIUM: types.string,
  BOLD: types.string,
  SEMIBOLD: types.string,
});

const Theme = types.model('Theme', {
  secondary: types.string,
  primary: types.string,
  primary2: types.string,
  accent: types.string,
  background: types.string,
  background2: types.string,
  primaryFont: primaryFont,
  secondaryFont: secondaryFont,
  graphColorPrimary: types.optional(types.string, ''),
  graphColorSecondary: types.optional(types.string, ''),
  creditBackground: types.optional(types.string, ''),
  creditBorder: types.optional(types.string, ''),
  debitBackground: types.optional(types.string, ''),
  debitBorder: types.optional(types.string, ''),
  chipBackground: types.optional(types.string, ''),
  chipText: types.optional(types.string, ''),
});

interface ExpenseIF extends SnapshotIn<typeof Expense> {}
interface NoteIF extends SnapshotIn<typeof Note> {}
interface UserIF extends SnapshotIn<typeof User> {}
interface AccountIF extends SnapshotIn<typeof Account> {}
interface ThemeIF extends SnapshotIn<typeof Theme> {}

const AppStore = types
  .model('Expenses', {
    expenses: types.array(Expense),
    notes: types.array(Note),
    user: User,
    accounts: types.array(Account),
    theme: Theme,
    themeType: types.string,
  })

  .actions(self => ({
    setExpenses(expenses: any) {
      self.expenses = expenses;
    },
    setNotes(notes: any) {
      self.notes = notes;
    },
    setUser(user: any) {
      self.user = user;
    },
    setAccounts(accounts: any) {
      self.accounts = accounts;
    },
    setThemeType(themeType: string) {
      self.themeType = themeType;
      this.setTheme(themeType === 'dark' ? themeLight : themeDark);
    },
    setTheme(theme: any) {
      self.theme = theme;
    },
  }))
  .actions(self => ({
    async loadUser() {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.get('user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        self.setUser(data);
      } catch (err) {
        snackbar.openSnackBar('Error loading user');
      }
    },
  }))
  .actions(self => ({
    async loadExpenses(
      options: {
        ways?: string[];
        types?: string[];
        accounts?: string[];
        startDate?: Date;
        endDate?: Date;
        dateSet?: boolean;
        take?: number;
      } | null = {dateSet: false},
    ) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.get('expense/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: options,
        });
        self.setExpenses(data.expenses);
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
  }))
  .actions(self => ({
    async loadAccounts() {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.get('account/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        self.setAccounts(data.accounts);
      } catch (err) {
        console.log('err', err);
        snackbar.openSnackBar('Something went wrong');
      }
    },
  }))
  .actions(self => ({
    async loadNotes({limit = 10, page = 1} = {}) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.get('note/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit,
            page,
          },
        });
        self.setNotes(data.notes);
      } catch (err) {
        console.log(err);
        snackbar.openSnackBar('Something went wrong');
      }
    },
  }))
  .actions(self => ({
    async addExpense(expense: ExpenseIF) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.post('expense/', expense, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) snackbar.openSnackBar('Added successfully');
        self.loadExpenses();
        self.loadAccounts();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
    async updateExpense(expense: ExpenseIF, expenseId: string) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        delete expense.account;
        const {data} = await ExpenseClient.patch(
          `expense/${expenseId}`,
          expense,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (data) snackbar.openSnackBar('Updated successfully');
        self.loadExpenses();
        self.loadAccounts();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
    async deleteExpense(expenseId: string) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.delete(`expense/${expenseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) snackbar.openSnackBar('Deleted successfully');
        self.loadExpenses();
        self.loadAccounts();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
  }))
  .actions(self => ({
    async addAccount(account: AccountIF) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.post('account/', account, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) snackbar.openSnackBar('Added successfully');
        self.loadAccounts();
      } catch (err) {
        console.log('err', err);
        snackbar.openSnackBar('Something went wrong');
      }
    },
    async updateAccount(account: AccountIF, accountId: string) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.patch(
          `accounts/${accountId}`,
          account,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (data) snackbar.openSnackBar('Updated successfully');
        self.loadAccounts();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
    async deleteAccount(accountId: string) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.delete(`account/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) snackbar.openSnackBar('Deleted successfully');
        self.loadAccounts();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
  }))
  .actions(self => ({
    async addNote(note: any) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.post('note/', note, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(data);
        if (data.success) snackbar.openSnackBar('Added successfully');
        self.loadNotes();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
    async updateNote(note: any, noteId: number) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.patch(`note/${noteId}`, note, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) snackbar.openSnackBar('Updated successfully');
        self.loadNotes();
      } catch (err) {
        snackbar.openSnackBar('Something went wrong');
      }
    },
    async deleteNote(noteId: number) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        const {data} = await ExpenseClient.delete(`note/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.message) snackbar.openSnackBar('Deleted successfully');
        self.loadNotes();
      } catch (err) {
        console.log(err);
        snackbar.openSnackBar('Something went wrong');
      }
    },
  }))
  .actions(self => ({
    async updateUser(user: any) {
      try {
        const token = await AsyncStorage.getItem('expense_user');
        await ExpenseClient.patch(`user/profile/`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await App.loadUser();
      } catch (err) {
        snackbar.openSnackBar('Error updating user');
      }
    },
    async login({
      userEmail,
      userPassword,
    }: {
      userEmail: string;
      userPassword: string;
    }) {
      console.log('login called');

      const validationSchema = yup.object().shape({
        userEmail: yup.string().email('Must be a valid email').required(),
        userPassword: yup
          .string()
          .min(8, 'At least 8 characters required')
          .required(),
      });
      validationSchema
        .validate({userEmail, userPassword})
        .then(async () => {
          try {
            const {data} = await ExpenseClient.post('/auth/login', {
              userEmail,
              userPassword,
            });
            console.log(data);
            if (data.token) {
              console.log('Token', data.token);
              await AsyncStorage.setItem('expense_user', data.token);
              await self.loadUser();
              await self.loadAccounts();
              await self.loadExpenses();
              await self.loadNotes();
              snackbar.openSnackBar("You're Logged in");
            }
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
          snackbar.openSnackBar(err.errors.join(', '));
        });
    },
    async signup({
      userName,
      userEmail,
      userPassword,
    }: {
      userName: string;
      userEmail: string;
      userPassword: string;
    }) {
      console.log('signup called');
      const validationSchema = yup.object().shape({
        userEmail: yup.string().email('Must be a valid email').required(),
        userPassword: yup
          .string()
          .min(8, 'At least 8 characters required')
          .required(),
        userName: yup.string().required(),
      });
      validationSchema
        .validate({userEmail, userPassword, userName})
        .then(async () => {
          try {
            const {data} = await ExpenseClient.post('/auth/signup', {
              userEmail,
              userPassword,
              userName,
            });
            await AsyncStorage.setItem('expense_user', data.token);
            await self.loadUser();
            await self.loadAccounts();
            await self.loadExpenses();
            await self.loadNotes();
            snackbar.openSnackBar("You're signed up");
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
          snackbar.openSnackBar(err.errors.join(', '));
        });
    },
  }))
  .actions(self => ({
    updateTheme: (theme: string) => self.setThemeType(theme),
  }));

export const App = AppStore.create({
  theme: themeLight,
  themeType: 'light',
  expenses: [
    {
      expenseId: '4',
      createdAt: '2022-12-20T15:16:16.501Z',
      updatedAt: '2022-12-20T15:16:16.501Z',
      accountId: '1',
      account: {
        debit: '200',
        credit: '3700',
        accountLabel: 'manav1',
        userId: '1',
        accountId: '1',
      },
      expenseType: 'Credit',
      value: 1200,
      date: '2022-12-11T18:30:00.000Z',
      description: 'trial',
      expenseWay: 'Bank Transfer',
    },
    {
      expenseId: '3',
      createdAt: '2022-12-20T15:12:48.861Z',
      updatedAt: '2022-12-20T15:12:48.861Z',
      accountId: '1',
      account: {
        debit: '200',
        credit: '3700',
        accountLabel: 'manav1',
        userId: '1',
        accountId: '1',
      },
      expenseType: 'Debit',
      value: 200,
      date: '2022-12-20T15:12:29.592Z',
      description: 'Expense 20',
      expenseWay: 'UPI',
    },
    {
      expenseId: '2',
      createdAt: '2022-12-20T15:12:15.401Z',
      updatedAt: '2022-12-20T15:12:15.401Z',
      accountId: '2',
      account: {
        debit: '100',
        credit: '90000',
        accountLabel: 'SBI Account',
        userId: '1',
        accountId: '2',
      },
      expenseType: 'Debit',
      value: 100,
      date: '2022-12-20T15:11:55.318Z',
      description: 'Expense',
      expenseWay: 'Bank Transfer',
    },
    {
      expenseId: '1',
      createdAt: '2022-12-20T15:01:11.379Z',
      updatedAt: '2022-12-20T15:01:11.379Z',
      accountId: '1',
      account: {
        debit: '200',
        credit: '3700',
        accountLabel: 'manav1',
        userId: '1',
        accountId: '1',
      },
      expenseType: 'Credit',
      value: 2500,
      date: '2022-12-19T18:30:00.000Z',
      description: 'Expense 1',
      expenseWay: 'Debit Card',
    },
  ],
  notes: [
    {
      noteId: '1',
      noteText: 'New Note',
      date: '2022-12-20T18:30:00.000Z',
      createdAt: '2022-12-20T15:48:35.578Z',
      updatedAt: '2022-12-20T15:48:35.578Z',
      userId: '1',
    },
  ],
  accounts: [
    {
      accountId: '1',
      userId: '1',
      debit: '200',
      credit: '3700',
      accountLabel: 'manav1',
      expenses: [
        {
          expenseId: '1',
          createdAt: '2022-12-20T15:01:11.379Z',
          updatedAt: '2022-12-20T15:01:11.379Z',
          accountId: '1',
          account: null,
          expenseType: 'Credit',
          value: 2500,
          date: '2022-12-19T18:30:00.000Z',
          description: 'Expense 1',
          expenseWay: 'Debit Card',
        },
        {
          expenseId: '3',
          createdAt: '2022-12-20T15:12:48.861Z',
          updatedAt: '2022-12-20T15:12:48.861Z',
          accountId: '1',
          account: null,
          expenseType: 'Debit',
          value: 200,
          date: '2022-12-20T15:12:29.592Z',
          description: 'Expense 20',
          expenseWay: 'UPI',
        },
        {
          expenseId: '4',
          createdAt: '2022-12-20T15:16:16.501Z',
          updatedAt: '2022-12-20T15:16:16.501Z',
          accountId: '1',
          account: null,
          expenseType: 'Credit',
          value: 1200,
          date: '2022-12-11T18:30:00.000Z',
          description: 'trial',
          expenseWay: 'Bank Transfer',
        },
      ],
    },
    {
      accountId: '2',
      userId: '1',
      debit: '100',
      credit: '90000',
      accountLabel: 'SBI Account',
      expenses: [
        {
          expenseId: '2',
          createdAt: '2022-12-20T15:12:15.401Z',
          updatedAt: '2022-12-20T15:12:15.401Z',
          accountId: '2',
          account: null,
          expenseType: 'Debit',
          value: 100,
          date: '2022-12-20T15:11:55.318Z',
          description: 'Expense',
          expenseWay: 'Bank Transfer',
        },
      ],
    },
  ],
  user: {
    userId: '1',
    userName: 'manav1',
    userEmail: 'manav81101@gmail.com',
    userProfilePic: null,
    createdAt: '2022-12-20T14:57:46.603Z',
    updatedAt: '2022-12-20T14:57:46.603Z',
    expenseTypes: ['Credit', 'Debit'],
    expenseWays: ['Cash', 'Bank Transfer', 'UPI', 'Debit Card', 'Credit Card'],
  },
});

export default AppStore;

export type {UserIF, ExpenseIF, NoteIF, AccountIF, ThemeIF};

const TOP_BANNER_ID = 'ca-app-pub-3483658732327025/3423867009';
const BOTTOM_BANNER_ID = 'ca-app-pub-3483658732327025/9033015392';

export {TOP_BANNER_ID, BOTTOM_BANNER_ID};
