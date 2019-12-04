import React from 'react';
import { StatusBar } from 'react-native';
import './config/ReactotronConfig';
import Routes from './routes';
import 'react-native-gesture-handler';
import * as theme from './styles/theme';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={theme.primaryBG} />
      <Routes />
    </>
  );
}
