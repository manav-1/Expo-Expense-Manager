import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ExpenseClient = axios.create({
  baseURL: 'https://backend.loca.lt',
  timeout: 1000,
});

export {ExpenseClient};
