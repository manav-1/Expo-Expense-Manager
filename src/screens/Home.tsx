import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import CustomExpense from '../customComponents/CustomExpense';
import {
  MainContainer,
  MinorHeading,
} from '../customComponents/styledComponents';
import Ionicons from '@expo/vector-icons/Ionicons';
import {App} from '../state/store';
import {observer} from 'mobx-react';
import AccountCard from '../customComponents/AccountCard';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import Animated, {EasingNode as Easing} from 'react-native-reanimated';

const HomeScreen = observer(
  ({navigation}: {navigation: StackNavigationHelpers}) => {
    const [addAccountButtonState, setAddAccountButtonState] =
      useState<boolean>(false);
    const [account, setAccount] = useState({
      accountLabel: '',
      credit: '',
      debit: 0,
      userId: App.user.userId,
    });

    const height = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      if (addAccountButtonState) {
        Animated.timing(height, {
          duration: 200,
          toValue: 80,
          easing: Easing.ease,
        }).start();
      } else {
        Animated.timing(height, {
          duration: 200,
          toValue: 0,
          easing: Easing.ease,
        }).start();
      }
    }, [addAccountButtonState]);

    const styles = StyleSheet.create({
      addAccountButton: {
        backgroundColor: App.theme.accent,
        width: 40,
        height: RFPercentage(25),
        borderRadius: 50,
        margin: 0,
        padding: 0,
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: App.theme.secondary,
        alignItems: 'center',
      },
      addAccountText: {
        fontFamily: App.theme.primaryFont.MEDIUM,
        color: App.theme.secondary,
        transform: [{rotate: '-90deg'}],
        position: 'absolute',
        width: 200,
        textAlign: 'center',
      },
      accountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
      },
      expensesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      seeAllButton: {
        opacity: 0.5,
        fontSize: 18,
      },
      userContainer: {
        padding: 5,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      userHeading: {
        fontSize: 22,
        fontFamily: App.theme.secondaryFont.MEDIUM,
        color: App.theme.secondary,
      },
      userHeadingBottom: {
        fontSize: 16,
        fontFamily: App.theme.primaryFont.MEDIUM,
        color: App.theme.secondary,
      },
      userContainerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      userButton: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
        backgroundColor: App.theme.secondary + 'dd',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inputText: {
        paddingVertical: 5,
        color: App.theme.secondary,
        flex: 2,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: App.theme.primary,
        borderRadius: 5,
        paddingLeft: 10,
        fontFamily: App.theme.primaryFont.MEDIUM,
      },
      addAccountContainer: {
        borderRadius: 5,
        paddingHorizontal: 5,
        marginBottom: 10,
        // @ts-ignore animated height not supported style
        height: height,
        justifyContent: 'space-around',
        backgroundColor: App.theme.secondary + 'dd',
        overflow: 'hidden',
      },
      addAccountHeading: {
        fontFamily: App.theme.primaryFont.MEDIUM,
        fontSize: 18,
      },
      containerOne: {flexDirection: 'row', justifyContent: 'space-between'},
      containerTwo: {flexDirection: 'row'},
    });
    const userLogout = async () => {
      await AsyncStorage.removeItem('expense_user');
      navigation.navigate('Login');
    };
    return (
      <MainContainer>
        <View style={styles.userContainer}>
          <View>
            <Text style={styles.userHeading}>Hello {App.user.userName}</Text>
            <Text style={styles.userHeadingBottom}>Welcome Back</Text>
          </View>
          <View style={styles.userContainerButtons}>
            <TouchableOpacity style={styles.userButton} onPress={userLogout}>
              <FontAwesome5
                name={'sign-out-alt'}
                size={20}
                color={App.theme.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.accountContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addAccountButton}
              onPress={() => {
                setAddAccountButtonState(!addAccountButtonState);
                setAccount({
                  credit: '',
                  debit: 0,
                  userId: App.user.userId,
                  accountLabel: '',
                });
              }}>
              <Text style={styles.addAccountText}>
                Add Account/ Card <Ionicons name={'add'} size={15} />
              </Text>
            </TouchableOpacity>
            {App.accounts &&
              App.accounts.map(account => (
                <AccountCard key={account.accountId} account={account} />
              ))}
          </ScrollView>
        </View>

        <Animated.View style={styles.addAccountContainer}>
          <View style={styles.containerOne}>
            <Text style={styles.addAccountHeading}>Add Account</Text>
            <TouchableOpacity
              onPress={async () => {
                await App.addAccount({
                  ...account,
                  credit: account.credit,
                  debit: '0',
                  userId: account.userId,
                });
                setAccount({
                  credit: '',
                  debit: 0,
                  userId: App.user.userId,
                  accountLabel: '',
                });
                setAddAccountButtonState(!addAccountButtonState);
              }}
              activeOpacity={0.5}>
              <Ionicons
                name={'save-outline'}
                color={App.theme.primary}
                size={18}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.containerTwo}>
            <TextInput
              style={[styles.inputText, {marginRight: 5}]}
              placeholder={'Account Label'}
              value={account.accountLabel}
              onChangeText={label =>
                setAccount({...account, accountLabel: label})
              }
            />
            <TextInput
              style={[styles.inputText, {flex: 1}]}
              keyboardType={'numeric'}
              placeholder={'Initial Balance'}
              value={account.credit}
              onChangeText={credit => setAccount({...account, credit})}
            />
          </View>
        </Animated.View>

        <View style={styles.expensesContainer}>
          <MinorHeading>Transactions History</MinorHeading>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Expenses')}>
            <MinorHeading style={styles.seeAllButton}>
              See All <Ionicons name={'arrow-forward'} size={18} />
            </MinorHeading>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {App.expenses.map(expense => (
            <CustomExpense
              key={expense.expenseId}
              expense={expense}
              setExpenseToBeEdited={null}
            />
          ))}
        </ScrollView>
      </MainContainer>
    );
  },
);

export default HomeScreen;
