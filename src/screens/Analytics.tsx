import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContainer} from '../customComponents/styledComponents';
import {App, ExpenseIF} from '../state/store';
import {observer} from 'mobx-react';
import {BarChart, LineChart} from 'react-native-chart-kit';
import Ionicons from '@expo/vector-icons/Ionicons';
import FilterCard from '../customComponents/FilterCard';
import {get, groupBy} from 'lodash';

const AnalyticsScreen = observer(() => {
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  const {width: SCREEN_WIDTH} = Dimensions.get('window');
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
    filterButtonText: {
      color: App.theme.primary,
      fontFamily: App.theme.primaryFont.MEDIUM,
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
    chartsContainer: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      height: 250,
    },
    chartContainer: {
      backgroundColor: App.theme.graphColorSecondary,
      borderRadius: 10,
      paddingTop: 5,
      marginVertical: 5,
      marginRight: 10,
      marginLeft: 0,
      height: 230,
    },
    chartHeading: {
      fontFamily: App.theme.primaryFont.MEDIUM,
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 5,
      color: App.theme.primary,
    },
    lineChart: {width: '100%', height: 280},
    chartStyle: {marginLeft: -10, marginRight: 10},
  });
  const barChartConfig = {
    color: (opacity = 1) =>
      `${App.theme.primary}${Math.ceil(opacity * 255).toString(16)}`,
    backgroundGradientFrom: App.theme.graphColorSecondary,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: App.theme.graphColorSecondary,
    backgroundGradientToOpacity: 0.5,
  };

  /*
   * numberOfShades: total number of shades required
   *
   * color: hex string for color to generate shades
   *  */
  const generateShadesOfAColor = (numberOfShades: number, color: string) => {
    const shades: {r: number; g: number; b: number}[] = [];
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    for (let i = 1; i <= numberOfShades; i++) {
      shades.push({
        r: Math.floor((i * r) / numberOfShades),
        g: Math.floor((i * g) / numberOfShades),
        b: Math.floor((b * i) / numberOfShades),
      });
    }
    return shades;
  };
  const getExpensesTransactionsData = (
    expenses: ExpenseIF[],
    valueSelector: string,
    labelSelector: string,
  ) => {
    const expensesGroupedByType = groupBy(expenses, valueSelector);
    const labels: string[] = [];
    const data: number[] = [];
    Object.keys(expensesGroupedByType).forEach(key => {
      labels.push(get(expensesGroupedByType[key][0], labelSelector));
      data.push(expensesGroupedByType[key].length);
    });
    return {
      labels,
      datasets: [{data}],
    };
  };

  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const lineChartExpensesData = (expenses: ExpenseIF[]) => {
    const groupedExpenses = groupBy(
      expenses.filter(expense => expense.expenseType === 'Debit'),
      'accountId',
    );
    const legends: string[] = [];
    const shades = generateShadesOfAColor(
      Object.keys(groupedExpenses).length,
      App.theme.debitBorder,
    );
    const datasets = Object.keys(groupedExpenses).map((key, index) => {
      const accountExpenses = groupedExpenses[key].map(item => ({
        ...item,
        month: MONTHS[new Date(item.date).getMonth()],
      }));
      const groupedMonthlyExpenses = groupBy(accountExpenses, 'month');
      const debitValArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      Object.keys(groupedMonthlyExpenses).forEach(key => {
        debitValArray[MONTHS.indexOf(key)] = groupedMonthlyExpenses[key].reduce(
          (previousValue, currentValue) => previousValue + currentValue.value,
          0,
        );
      });
      legends.push(String(accountExpenses?.[0].account?.accountLabel));
      const color = shades[index];
      return {
        data: debitValArray,
        strokeWidth: index + 2,
        color: (opacity = 1) =>
          `rgba(${color.r},${color.g},${color.b},${opacity})`,
      };
    });
    const data = {
      labels: MONTHS,
      datasets,
      legends,
    };
    return data;
  };
  const chartLabelValueSelector = [
    {
      value: 'accountId',
      label: 'account.accountLabel',
      heading: 'Transactions per account',
    },
    {
      value: 'expenseType',
      label: 'expenseType',
      heading: 'Expenses by type',
    },
    {
      value: 'expenseWay',
      label: 'expenseWay',
      heading: 'Expenses by way',
    },
  ];

  return (
    <MainContainer>
      <View style={styles.tabStyles}>
        <Text style={styles.tabBarTitle}>Analytics</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltersVisible(!filtersVisible)}>
          <Text style={styles.filterButtonText}>Filters</Text>
          <Ionicons name={filtersVisible ? 'chevron-up' : 'chevron-down'} />
        </TouchableOpacity>
      </View>
      <FilterCard filtersVisible={filtersVisible} />
      {App.expenses.filter(item => item.expenseType === 'Debit').length > 0 ? (
        <View style={[styles.chartContainer, styles.lineChart]}>
          <Text style={styles.chartHeading}>Debit Value by Account</Text>
          <LineChart
            bezier
            data={lineChartExpensesData(App.expenses)}
            width={SCREEN_WIDTH - 20}
            height={250}
            chartConfig={barChartConfig}
            verticalLabelRotation={45}
          />
        </View>
      ) : (
        <></>
      )}
      <View>
        <ScrollView horizontal contentContainerStyle={styles.chartsContainer}>
          {chartLabelValueSelector.map(item => (
            <View key={item.value} style={styles.chartContainer}>
              <Text style={styles.chartHeading}>{item.heading}</Text>
              <BarChart
                data={getExpensesTransactionsData(
                  App.expenses,
                  item.value,
                  item.label,
                )}
                style={styles.chartStyle}
                width={SCREEN_WIDTH - 80}
                height={200}
                chartConfig={barChartConfig}
                yAxisLabel={''}
                yAxisSuffix={''}
                fromZero
                showBarTops
                showValuesOnTopOfBars
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </MainContainer>
  );
});
export default AnalyticsScreen;
