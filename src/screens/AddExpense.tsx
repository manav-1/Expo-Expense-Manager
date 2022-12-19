import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {observer} from 'mobx-react';
import {SelectList} from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-neat-date-picker';
import moment from 'moment';
import * as yup from 'yup';
import Animated, {EasingNode as Easing} from 'react-native-reanimated';
import {App, ExpenseIF} from '../state/store';
import {snackbar} from '../state/snackbar';

const AddExpense = observer(
  ({expanded, expenseVal}: {expanded: boolean; expenseVal: ExpenseIF}) => {
    const height = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      if (expanded) {
        Animated.timing(height, {
          duration: 600,
          toValue: 425,
          easing: Easing.bounce,
        }).start();
      } else {
        Animated.timing(height, {
          duration: 600,
          toValue: 0,
          easing: Easing.ease,
        }).start();
      }
    }, [expanded]);
    const [open, setOpen] = React.useState<boolean>(false);
    const defaultOptions = {
      expenseType: App.user.expenseTypes.map((item, index) => ({
        key: index,
        value: item,
      })),
      expenseWay: App.user.expenseWays.map((item, index) => ({
        key: index,
        value: item,
      })),
      accountId: App.accounts.map(item => ({
        key: item.accountId,
        value: item.accountLabel,
      })),
    };
    const [expense, setExpense] = React.useState<ExpenseIF>(expenseVal);
    React.useEffect(() => setExpense(expenseVal), [expenseVal]);
    const saveExpense = () => {
      const validationSchema = yup.object().shape({
        description: yup.string().required(),
        value: yup.number().required(),
        date: yup.string().required(),
        accountId: yup.string().required('Please Select an Account'),
        expenseType: yup.string().required('Please Select an Expense Type'),
        expenseWay: yup.string().required('Please Select a Way'),
      });
      console.log(expense);
      delete expense.account;
      validationSchema
        .validate(expense)
        .then(async expense => {
          if (expenseVal.expenseId)
            await App.updateExpense(expense, expenseVal.expenseId);
          else await App.addExpense(expense);
        })
        .catch(err => snackbar.openSnackBar(err.errors.join(',')));
    };

    const styles = StyleSheet.create({
      addExpenseContainer: {
        backgroundColor: App.theme.accent,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'space-around',
        // @ts-ignore
        height: height,
        overflow: 'hidden',
      },
      expensesInput: {
        borderWidth: 1,
        borderColor: App.theme.secondary,
        borderRadius: 5,
        paddingLeft: 20,
        height: 50,
        fontSize: 14,
        color: App.theme.secondary,
        fontFamily: App.theme.primaryFont.MEDIUM,
        marginVertical: 5,
      },
      expensesInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      expensesHeadingStyles: {
        fontFamily: App.theme.primaryFont.MEDIUM,
        color: App.theme.primary,
      },
      expenseButton: {
        backgroundColor: App.theme.secondary + 'dd',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
      },
      expensesButtonText: {
        fontFamily: App.theme.primaryFont.MEDIUM,
        color: App.theme.primary,
        textAlign: 'center',
      },
      heading: {
        fontSize: 30,
        fontFamily: App.theme.primaryFont.MEDIUM,
      },
      boxStyles: {
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: App.theme.secondary,
        marginVertical: 5,
      },
      inputStyles: {
        height: 20,
        color: App.theme.secondary,
      },
      dateStyles: {
        fontSize: 14,
        fontFamily: App.theme.primaryFont.MEDIUM,
        color: App.theme.secondary,
      },
      addExpHeading: {
        fontFamily: App.theme.primaryFont.MEDIUM,
        fontSize: 25,
        color: App.theme.secondary,
      },
      addExpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
      },
      modalColorOptions: {
        backgroundColor: App.theme.primary,
        // @ts-ignore (styles not applicable in stylesheet)
        selectedDateBackgroundColor: App.theme.accent,
        headerColor: App.theme.secondary,
        headerTextColor: App.theme.primary,
        confirmButtonColor: App.theme.secondary,
        weekDaysColor: App.theme.accent,
        dateTextColor: App.theme.secondary,
      },
    });
    return (
      <Animated.View style={styles.addExpenseContainer}>
        <View style={styles.addExpContainer}>
          <Text style={styles.addExpHeading}>
            {expenseVal.expenseId ? 'Update' : 'Add'} Expense
          </Text>
          <TouchableOpacity style={styles.expenseButton} onPress={saveExpense}>
            <Text style={styles.expensesButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.expensesInput}
          multiline
          placeholder="Description"
          value={expense.description}
          onChangeText={value => setExpense({...expense, description: value})}
        />
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={[styles.expensesInput, {flex: 1, marginRight: 10}]}
            multiline
            placeholder="Value"
            keyboardType={'numeric'}
            value={`${expense.value}`}
            onChangeText={value =>
              setExpense({...expense, value: Number(value)})
            }
          />
          <TouchableOpacity
            style={[
              styles.expensesInput,
              {flexDirection: 'row', alignItems: 'center', flex: 1},
            ]}
            onPress={() => setOpen(!open)}>
            <Text style={[styles.expensesHeadingStyles, styles.dateStyles]}>
              {moment(expense.date).format('ddd DD MM, YYYY')}
            </Text>
          </TouchableOpacity>
        </View>
        <SelectList
          fontFamily={App.theme.primaryFont.MEDIUM}
          boxStyles={styles.boxStyles}
          search={false}
          inputStyles={styles.inputStyles}
          setSelected={(value: string) =>
            setExpense({...expense, expenseType: value})
          }
          defaultOption={
            defaultOptions.expenseType.find(
              option => option.value === expenseVal.expenseType,
            )!
          }
          data={defaultOptions.expenseType}
          save={'value'}
        />
        <SelectList
          fontFamily={App.theme.primaryFont.MEDIUM}
          boxStyles={styles.boxStyles}
          search={false}
          inputStyles={styles.inputStyles}
          setSelected={(value: string) =>
            setExpense({...expense, expenseWay: value})
          }
          defaultOption={
            defaultOptions.expenseWay.find(
              option => option.value === expenseVal.expenseWay,
            )!
          }
          data={defaultOptions.expenseWay}
          save={'value'}
        />
        <SelectList
          fontFamily={App.theme.primaryFont.MEDIUM}
          boxStyles={styles.boxStyles}
          search={false}
          inputStyles={styles.inputStyles}
          setSelected={(value: string) =>
            setExpense({...expense, accountId: value})
          }
          defaultOption={
            defaultOptions.accountId.find(
              option => option.key === expenseVal.accountId,
            )!
          }
          data={defaultOptions.accountId}
          save={'key'}
        />

        <DatePicker
          isVisible={open}
          mode={'single'}
          onConfirm={(date: any) => {
            setOpen(false);
            setExpense({...expense, date: date.date});
          }}
          modalStyles={{height: '100%'}}
          colorOptions={styles.modalColorOptions}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </Animated.View>
    );
  },
);

export default AddExpense;
