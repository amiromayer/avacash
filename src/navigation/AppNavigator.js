import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Dimensions,
  Platform,
  Vibration
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

import Constants from 'expo-constants'

import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/colors'
import HomeScreen from '../screens/HomeScreen'
import TransactionScreen from '../screens/TransactionScreen'

import ScannerModalScreen from '../screens/ScannerModalScreen'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSearchBar } from '../redux/screenReducer'

import PaymentScreen from '../screens/PaymentScreen'
import BackupScreen from '../screens/BackupScreen'
import ConfirmPaymentModal from '../screens/ConfirmPaymentModal'
import ChoosePaymentReceiverScreen from '../screens/ChoosePaymentReceiverScreen'
import ChooseRequestReceiverScreen from '../screens/ChooseRequestReceiverScreen'
import PayToScannedScreen from '../screens/PayToScannedScreen'
import OverlayMessageScreen from '../screens/OverlayMessageScreen'

import ModalHeader from '../components/ModalHeader'

import HomeStackNavigator from './HomeStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'
import PaymentStackNavigator from './PaymentStackNavigator'
import TabNavigator from './TabNavigator'
import useScreenDimensions from '../hooks/useScreenDimensions'
import { updateUser } from '../redux/userReducer'

const Stack = createStackNavigator()

const AppNavigator = ({ route, navigation }) => {
  const dispatch = useDispatch()

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      )
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      const pushToken = await Notifications.getExpoPushTokenAsync()

      dispatch(updateUser({ pushToken }))
    } else {
      alert('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250]
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      registerForPushNotificationsAsync()
    }, [])
  )

  const screen = useScreenDimensions()

  return (
    <Stack.Navigator
      mode='modal'
      // headerMode='none'
      // screenOptions={({ route, navigation }) => ({ headerShown: false })}
    >
      <Stack.Screen
        name='HomeStack'
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='ScannerModal'
        component={ScannerModalScreen}
        options={({ route, navigation }) => ({
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          gestureResponseDistance: {
            vertical: Dimensions.get('screen').height
          }
          // cardOverlayEnabled: true,
          // headerStatusBarHeight:
          //   navigation.dangerouslyGetState().routes.indexOf(route) > 0
          //     ? 0
          //     : undefined,
          // ...TransitionPresets.ModalPresentationIOS,
        })}
      />

      <Stack.Screen
        name='Backup'
        component={BackupScreen}
        options={({ route, navigation }) => ({
          cardStyle: {
            flex: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: screen.height / 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'transparent',
            justifyContent: 'flex-end'
          },
          header: () => <ModalHeader />,
          // headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          gestureResponseDistance: {
            vertical: screen.height
          },
          headerStatusBarHeight:
            navigation.dangerouslyGetState().routes.indexOf(route) > 0
              ? 0
              : undefined,
          ...TransitionPresets.ModalPresentationIOS
        })}
      />

      <Stack.Screen
        name='ConfirmPayment'
        component={ConfirmPaymentModal}
        options={({ route, navigation }) => ({
          cardStyle: {
            flex: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: screen.height / (screen.height > 800 ? 3 : 4),
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'transparent',
            justifyContent: 'flex-end'
          },
          header: () => <ModalHeader />,
          // headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          gestureResponseDistance: {
            vertical: screen.height
          },
          headerStatusBarHeight:
            navigation.dangerouslyGetState().routes.indexOf(route) > 0
              ? 0
              : undefined,
          ...TransitionPresets.ModalPresentationIOS
        })}
      />

      <Stack.Screen
        name='ChoosePaymentReceiver'
        component={ChoosePaymentReceiverScreen}
        options={({ route, navigation }) => ({
          headerTitle: `$${route.params.amount}`,
          headerTitleStyle: { fontSize: screen.height > 800 ? 21 : 18 },
          headerStyle: { shadowColor: 'transparent' },
          gestureEnabled: true,
          gestureResponseDistance: {
            vertical: Dimensions.get('screen').height
          },
          headerLeft: props => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
              style={{ marginLeft: 16 }}
            >
              <Feather name='x' size={screen.height > 800 ? 28 : 24}></Feather>
            </TouchableOpacity>
          )
        })}
      />

      <Stack.Screen
        name='ChooseRequestReceiver'
        component={ChooseRequestReceiverScreen}
        options={({ route, navigation }) => ({
          headerTitle: `$${route.params.amount}`,
          headerTitleStyle: { fontSize: screen.height > 800 ? 21 : 18 },
          headerStyle: { shadowColor: 'transparent' },
          gestureEnabled: true,
          gestureResponseDistance: {
            vertical: Dimensions.get('screen').height
          },
          headerLeft: props => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
              style={{ marginLeft: 16 }}
            >
              <Feather name='x' size={screen.height > 800 ? 28 : 24}></Feather>
            </TouchableOpacity>
          )
        })}
      />

      <Stack.Screen
        name='OverlayMessage'
        component={OverlayMessageScreen}
        options={({ route, navigation }) => ({
          headerTitle: null,
          headerShown: false
        })}
      />

      <Stack.Screen
        name='PayToScanned'
        component={PayToScannedScreen}
        options={({ route, navigation }) => ({
          // headerShown: false,
          headerTitle: null,
          headerStyle: { shadowOpacity: 0 },
          gestureEnabled: true,
          gestureResponseDistance: {
            vertical: Dimensions.get('screen').height
          },
          headerLeft: props => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Payment')
              }}
              style={{ marginLeft: 16 }}
            >
              <Feather name='x' size={screen.height > 800 ? 28 : 24}></Feather>
            </TouchableOpacity>
          )
        })}
      />
    </Stack.Navigator>
  )
}

export default AppNavigator
