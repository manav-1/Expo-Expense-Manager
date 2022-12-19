import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ExpandableText from './ExpandableText';
import {App, ExpenseIF} from '../state/store';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';

const ExpenseContainer = ({
  expense,
  setExpenseToBeEdited,
}: {
  expense: ExpenseIF;
  setExpenseToBeEdited: ((expense: ExpenseIF) => void) | null;
}) => {
  const getWayIcon = (way: String) => {
    const wayIcon = {
      Cash: 'money-bill-wave',
      Debit_Card: 'credit-card',
      Card: 'credit-card',
      Bank: 'building',
      UPI: 'funnel-dollar',
      Credit_Card: 'money-check-alt',
      Net_Banking: 'network-wired',
    };
    const iconName = wayIcon[way as keyof typeof wayIcon] || 'network-wired';
    return <FontAwesome5 name={iconName} size={10} color={App.theme.primary} />;
  };
  const getExpenseType = (type: String) => {
    const expenseTypeIcon = {
      Debit: 'minus',
      Credit: 'plus',
    };
    const iconName =
      expenseTypeIcon[type as keyof typeof expenseTypeIcon] || 'network-wired';
    return <FontAwesome5 name={iconName} size={10} color={App.theme.primary} />;
  };

  const styles = StyleSheet.create({
    expenseName: {
      fontWeight: '600',
      fontFamily: App.theme.primaryFont.MEDIUM,
      color: App.theme.secondary,
      marginVertical: 0,
      fontSize: 13,
      paddingLeft: 5,
    },
    chipStyle: {
      height: 30,
      paddingHorizontal: 15,
      marginVertical: 2,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      backgroundColor: App.theme.graphColorSecondary,
    },
    chipText: {
      fontSize: 12,
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.MEDIUM,
      paddingLeft: 5,
    },
    deleteButton: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
    expandableText: {
      paddingLeft: 5,
    },
    expenseContainer: {
      marginVertical: 5,
      paddingHorizontal: 5,
      paddingBottom: 5,
      width: '100%',
      borderRadius: 10,
      backgroundColor:
        expense.expenseType === 'Debit'
          ? App.theme.debitBackground
          : App.theme.creditBackground,
      borderWidth: 1,
      borderColor:
        expense.expenseType === 'Debit'
          ? App.theme.debitBorder
          : App.theme.creditBorder,
    },
    chipContainer: {
      flexDirection: 'row',
    },
    expenseStyleTop: {
      justifyContent: 'space-between',
      paddingHorizontal: 5,
    },
    expenseStyleBottom1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 30,
    },
    expenseStyleBottom2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.expenseContainer}>
      <View style={styles.expenseStyleTop}>
        <View style={styles.expenseStyleBottom1}>
          <ExpandableText
            customStyle={styles.expandableText}
            text={expense.description}
            value={`₹ ${expense.value}`}
          />
        </View>
        <View style={[styles.chipStyle, {position: 'absolute', top: 5}]}>
          <Text style={styles.chipText}>{expense.account?.accountLabel}</Text>
        </View>
        <View style={styles.expenseStyleBottom2}>
          <Text style={styles.expenseName}>
            {new Date(expense.date).toDateString()}
          </Text>

          <View style={styles.chipContainer}>
            <View style={styles.chipStyle}>
              {getExpenseType(expense.expenseType)}
              <Text style={styles.chipText}>{expense.expenseType}</Text>
            </View>
            <View style={styles.chipStyle}>
              {getWayIcon(expense.expenseWay)}
              <Text style={styles.chipText}>{expense.expenseWay}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => App.deleteExpense(String(expense.expenseId))}>
        <FontAwesome5 name="times-circle" size={15} color="#fff" />
      </TouchableOpacity>

      {setExpenseToBeEdited && (
        <TouchableOpacity
          style={[styles.deleteButton, {right: 30, top: 4}]}
          onPress={() => setExpenseToBeEdited(expense)}>
          <FontAwesome5 name="edit" size={15} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default ExpenseContainer;
