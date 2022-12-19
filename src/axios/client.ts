import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ExpenseClient = axios.create({
  baseURL: 'https://expense-manager-nest-js-production.up.railway.app/',
  timeout: 1000,
});

export {ExpenseClient};
