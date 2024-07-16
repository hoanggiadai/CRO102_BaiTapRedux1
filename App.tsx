import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import ThuChiScreen from './src/screens/ThuChiScreen'

const App = () => {
  return (
    <Provider store={store}>
      <ThuChiScreen/>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})