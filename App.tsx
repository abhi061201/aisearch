import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AdvisorScreen from './src/Screens/Home/index'

const App = () => {
  return (
    <View style={styles.container}>
      <AdvisorScreen/>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})


