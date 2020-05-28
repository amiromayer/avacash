import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { View, Text, SafeAreaView, Clipboard, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SearchBar from '../components/SearchBar'
import Colors from '../constants/colors'
import { firestore } from '../config/firebase'
import UserCell from '../components/UserCell'
import AddressCell from '../components/AddressCell'
import { isEthereumAddress } from '../helpers'

import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'

const ChoosePaymentRecipientScreen = props => {
  const { amount } = props.route.params

  const [queryStr, setQueryStr] = useState('')
  const [foundUsers, setFoundUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigation()

  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerTitle: `$${amount}`,
  //     //   headerTitleStyle: { fontSize: screen.height > 800 ? 21 : 18 }
  //     })
  //   }, [navigation])

  //   {isEthereumAddress(queryStr) || foundUsers.length > 0 ? (
  //     <Text style={styles.sectionHeader}>Suggested</Text>
  //   ) : null}

  useEffect(() => {
    setIsLoading(true)
    setFoundUsers([])
    ;(async () => {
      const users = await search(queryStr)
      setFoundUsers(users)
      setIsLoading(false)
    })()
  }, [queryStr])

  const search = async queryStr => {
    let docs = []

    if (queryStr) {
      const emails = await firestore
        .collection('users')
        .where('email', '>=', queryStr)
        .where('email', '<=', queryStr + '\uf8ff')
        .get()

      emails.docs.forEach(doc => {
        docs.push(doc.data())
      })

      if (isEthereumAddress(queryStr)) {
        const addresses = await firestore
          .collection('users')
          .where('address', '>=', queryStr)
          .where('address', '<=', queryStr + '\uf8ff')
          .get()

        addresses.docs.forEach(doc => {
          docs.push(doc.data())
        })
      }
    }

    return docs
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <SearchBar
        leftTitle='To'
        placeholder='Email, address'
        value={queryStr}
        onChangeText={text => setQueryStr(text)}
        rightButtonTitle={queryStr ? 'Clear' : 'Paste'}
        onHandleRightButton={
          queryStr
            ? () => {
                setQueryStr('')
              }
            : async () => {
                const textFromClipboard = await Clipboard.getString()
                setQueryStr(textFromClipboard.trim())
              }
        }
      ></SearchBar>

      {!isLoading ? (
        isEthereumAddress(queryStr) && foundUsers.length === 0 ? (
          <AddressCell address={queryStr}></AddressCell>
        ) : foundUsers.length > 0 ? (
          foundUsers.map(user => <UserCell user={user}></UserCell>)
        ) : null
      ) : null}

      {!isLoading &&
      queryStr &&
      foundUsers.length === 0 &&
      !isEthereumAddress(queryStr) ? (
        <Animatable.View
          animation='fadeIn'
          iterationCount={1}
          direction='alternate'
          duration={240}
          delay={240}
          style={{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20
          }}
        >
          <Text
            style={{ fontWeight: '600', fontSize: 18, textAlign: 'center' }}
          >
            No results
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: Colors.Gray600,
              textAlign: 'center'
            }}
          >
            Try searching for another email or AVA address
          </Text>
        </Animatable.View>
      ) : null}
    </SafeAreaView>
  )
}

export default ChoosePaymentRecipientScreen

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Colors.Gray100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
})
