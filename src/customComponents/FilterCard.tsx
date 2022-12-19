import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment/moment';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
import {App} from '../state/store';
import React, {useState} from 'react';
import DatePicker from 'react-native-neat-date-picker';
import Animated, {EasingNode as Easing} from 'react-native-reanimated';

const FilterCard = ({filtersVisible}: {filtersVisible: boolean}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [ways, setWays] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [dateSet, setDateSet] = useState<boolean>(false);

  const {height: SCREEN_HEIGHT} = Dimensions.get('window');
  const height = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (filtersVisible) {
      Animated.timing(height, {
        duration: 600,
        toValue: SCREEN_HEIGHT - 120,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(height, {
        duration: 600,
        toValue: 0,
        easing: Easing.ease,
      }).start();
    }
  }, [filtersVisible]);

  const options = {
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
  const styles = StyleSheet.create({
    expenseFiltersContainer: {
      backgroundColor: App.theme.accent,
      borderRadius: 10,
      // @ts-ignore (these styles not applicable in stylesheet)
      maxHeight: height,
      overflow: 'hidden',
      justifyContent: 'space-around',
      position: 'absolute',
      top: 50,
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
      width: '60%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: App.theme.secondary + 'dd',
    },
    expensesSelectFilter: {
      minWidth: '60%',
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
    dateButton: {
      width: '80%',
      borderWidth: 1,
      alignItems: 'center',
      marginVertical: 5,
      borderColor: App.theme.primary,
      borderRadius: 5,
      padding: 10,
    },
    boxStyles: {
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 5,
      borderWidth: 1,
      borderColor: App.theme.primary,
    },
    datePickerStyles: {
      backgroundColor: App.theme.primary,
      // @ts-ignore (styles not applicable in stylesheet)
      selectedDateBackgroundColor: App.theme.accent,
      headerColor: App.theme.secondary,
      headerTextColor: App.theme.primary,
      confirmButtonColor: App.theme.secondary,
      weekDaysColor: App.theme.accent,
      dateTextColor: App.theme.secondary,
    },
    modalStyles: {
      height: '100%',
    },
  });

  React.useEffect(() => {
    (async () => {
      await App.loadExpenses({
        ways,
        types,
        accounts,
        startDate,
        endDate,
        dateSet,
      });
    })();
  }, [ways, types, accounts, startDate, endDate, dateSet]);

  return (
    <Animated.View style={styles.expenseFiltersContainer}>
      <View style={styles.expensesFilterRow}>
        <View style={styles.expensesFilter}>
          <Text style={styles.filterHeading}>Date Range</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setOpen(true);
            }}>
            <Text style={styles.dateInput}>
              {moment(startDate.toISOString()).format('DD MMM, YY')}
              &nbsp;-&nbsp;
              {moment(endDate.toISOString()).format('DD MMM, YY')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.expensesFilterRow}>
        <View style={styles.expensesSelectFilter}>
          <Text style={styles.filterHeading}>Expense Way</Text>
          <MultipleSelectList
            fontFamily={App.theme.primaryFont.MEDIUM}
            boxStyles={styles.boxStyles}
            setSelected={setWays}
            defaultOption={options.expenseWay[0]}
            data={options.expenseWay}
            save={'value'}
            label={'Selected Way/s'}
          />
        </View>
      </View>
      <View style={styles.expensesFilterRow}>
        <View style={styles.expensesSelectFilter}>
          <Text style={styles.filterHeading}>Expense Type</Text>
          <MultipleSelectList
            fontFamily={App.theme.primaryFont.MEDIUM}
            boxStyles={styles.boxStyles}
            setSelected={setTypes}
            defaultOption={options.expenseType[0]}
            data={options.expenseType}
            save={'value'}
            label={'Selected Type/s'}
          />
        </View>
      </View>
      <View style={styles.expensesFilterRow}>
        <View style={styles.expensesSelectFilter}>
          <Text style={styles.filterHeading}>Account</Text>
          <MultipleSelectList
            fontFamily={App.theme.primaryFont.MEDIUM}
            boxStyles={styles.boxStyles}
            setSelected={setAccounts}
            defaultOption={options.accountId[0]}
            data={options.accountId}
            save={'value'}
            label={'Selected Account/s'}
          />
        </View>
      </View>

      <DatePicker
        isVisible={open}
        mode={'range'}
        colorOptions={styles.datePickerStyles}
        modalStyles={styles.modalStyles}
        onConfirm={(date: any) => {
          setOpen(false);
          setDateSet(true);
          setStartDate(date.startDate);
          setEndDate(date.endDate);
        }}
        onCancel={() => {
          setDateSet(false);
          setOpen(false);
        }}
      />
    </Animated.View>
  );
};

export default FilterCard;
