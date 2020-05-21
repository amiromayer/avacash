import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing
} from 'react-native'
import Button from '../components/Button'

import { firestore as db } from '../config/firebase'
import { CLIENT_ID, API_KEY } from 'react-native-dotenv'
import { ethers } from 'ethers'

import {
  loginFailure,
  loginSuccess,
  setAccessToken,
  logout,
  firebaseSignInSuccess,
  firebaseSignInFailure,
  googleSignInSuccess,
  googleSignInFailure,
  logoutSuccess,
  logoutFailure,
  signInWithGoogle,
  signOut
} from '../redux/authReducer'

import {
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  createWalletSuccess,
  createWalletFailure,
  getWalletSuccess,
  getWalletFailure,
  getWalletFromDrive
} from '../redux/userReducer'

import { useSelector, useDispatch, useStore } from 'react-redux'
import { throwError } from '../redux/errorReducer'

import AnimatedLoader from 'react-native-animated-loader'

const SignInScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const isSignedIn = useSelector(state => state.auth.isSignedIn)
  const accessToken = useSelector(state => state.auth.accessToken)
  const isLoading = useSelector(state => state.isLoading)

  const [fadeValue, setOpacityValue] = useState(new Animated.Value(0))

  const checkIfSignedIn = () => {
    if (isSignedIn) {
      navigation.navigate('Home')
    } else {
      navigation.navigate('SignIn')
    }
  }

  useEffect(() => {
    checkIfSignedIn()
  })

  useEffect(() => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800
    }).start()
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <AnimatedLoader
        visible={isLoading}
        source={require('../../assets/loader_gray400.json')}
        overlayColor='rgba(255,255,255,0.7)'
        overlayColor='rgba(0,0,0,0.42)'
        animationStyle={{ width: 60, height: 60 }}
        speed={1}
      />

      <Animated.View
        style={{
          opacity: fadeValue,
          transform: [
            {
              translateY: fadeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            }
          ]
        }}
      >
        <Button
          title='Sign in with Google'
          onPress={() => dispatch(signInWithGoogle())}
        ></Button>
      </Animated.View>
    </SafeAreaView>
  )
}

export default SignInScreen
