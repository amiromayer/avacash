import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'

import { Feather } from '@expo/vector-icons'
import Colors from '../constants/colors'

const Stack = createStackNavigator()

const HomeStack = props => {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerStyle: {},
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 21 },
          headerRight: () => {
            return (
              <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {}}>
                <Feather name='search' size={22} />
              </TouchableOpacity>
            )
          }
        }}
      />
      <Stack.Screen
        name='Transaction'
        component={TransactionScreen}
        options={({ navigation, route }) => {
          return {
            headerTitle: null,
            headerLeft: props => {
              return (
                <TouchableOpacity
                  style={{ marginLeft: 14 }}
                  onPress={() => {
                    if (navigation.canGoBack()) {
                      navigation.popToTop()
                    }
                  }}
                >
                  <Feather name='arrow-left' size={24} />
                </TouchableOpacity>
              )
            }
          }
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeStack
