import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {observer} from 'mobx-react';
import {MainContainer} from '../customComponents/styledComponents';
import CustomExpense from '../customComponents/CustomExpense';
import {App, ExpenseIF} from '../state/store';
import FilterCard from '../customComponents/FilterCard';
import AddExpense from './AddExpense';

const Expenses = observer(() => {
  const [filtersVisible, setFiltersVisible] = React.useState<boolean>(false);
  const [addExpenseVisible, setAddExpenseVisible] =
    React.useState<boolean>(false);
  const [expenseToBeEdited, setExpenseToBeEdited] = React.useState<ExpenseIF>({
    date: new Date().toISOString(),
    expenseWay: 'Cash',
    expenseType: 'Credit',
    description: '',
    value: 0,
    accountId: App.accounts[0].accountId,
  });
  const styles = StyleSheet.create({
    tabBarTitle: {
      fontSize: 25,
      paddingVertical: 10,
      marginVertical: 5,
      color: App.theme.secondary,
      fontFamily: App.theme.primaryFont.MEDIUM,
    },
    tabStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: App.theme.primary,
    },
    filterButton: {
      width: 100,
      padding: 5,
      flexDirection: 'row',
      borderRadius: 5,
      backgroundColor: App.theme.secondary + 'dd',
      justifyContent: 'center',
      alignItems: 'center',
    },
    expenseFiltersContainer: {
      backgroundColor: App.theme.accent,
      borderRadius: 10,
      height: filtersVisible ? 'auto' : 0,
      overflow: 'hidden',
      justifyContent: 'space-around',
      position: 'absolute',
      top: 60,
      width: '100%',
      alignSelf: 'center',
      zIndex: 2,
    },
    expensesFilterRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      marginVertical: 10,
    },
    expensesFilter: {
      width: '45%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: App.theme.secondary + 'dd',
    },
    expensesSelectFilter: {
      minWidth: 200,
      borderRadius: 10,
      paddingHorizontal: 5,
      justifyContent: 'center',
      backgroundColor: App.theme.secondary + 'dd',
    },
    filterHeading: {
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.BOLD,
      fontSize: 16,
      textAlign: 'center',
    },
    dateInput: {
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.MEDIUM,
      paddingVertical: 3,
    },
    boxStyles: {
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 5,
      borderWidth: 1,
      borderColor: App.theme.primary,
    },
    dateButton: {
      width: '80%',
      borderWidth: 1,
      alignItems: 'center',
      marginVertical: 5,
      borderColor: App.theme.primary,
      borderRadius: 5,
      padding: 10,
    },
    addExpenseButton: {
      position: 'absolute',
      bottom: 70,
      right: 10,
      zIndex: 2,
    },
    filterButtonText: {
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.MEDIUM,
    },
    expensesContainer: {},
  });

  return (
    <MainContainer>
      <View style={styles.tabStyles}>
        <Text style={styles.tabBarTitle}>Expenses</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltersVisible(!filtersVisible)}>
          <Text style={styles.filterButtonText}>Filters</Text>
          <Ionicons name={!filtersVisible ? 'chevron-down' : 'chevron-up'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.addExpenseButton}
        onPress={() => {
          setExpenseToBeEdited({
            date: new Date().toISOString(),
            expenseWay: 'Cash',
            expenseType: 'Debit',
            description: '',
            value: 0,
            accountId: App.accounts[0].accountId,
          });
          setAddExpenseVisible(!addExpenseVisible);
        }}>
        <Ionicons
          name={
            !addExpenseVisible ? 'add-circle-outline' : 'close-circle-outline'
          }
          color={App.theme.secondary}
          size={45}
        />
      </TouchableOpacity>
      <FilterCard filtersVisible={filtersVisible} />
      <AddExpense
        expanded={addExpenseVisible}
        expenseVal={expenseToBeEdited}
        setExpanded={setAddExpenseVisible}
      />
      <ScrollView style={styles.expensesContainer}>
        {App.expenses.map(expense => (
          <CustomExpense
            key={expense.expenseId}
            expense={expense}
            setExpenseToBeEdited={val => {
              setAddExpenseVisible(true);
              setExpenseToBeEdited(val);
            }}
          />
        ))}
      </ScrollView>
    </MainContainer>
  );
});

export default Expenses;
