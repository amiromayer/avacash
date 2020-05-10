import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native'
import Colors from '../constants/colors'
import moment from 'moment'

import useScreenDimensions from '../hooks/useScreenDimensions'

const ActivityCell = props => {
  const screen = useScreenDimensions()

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 100,
          width: screen.width,
          justifyContent: 'space-between',
          paddingVertical: 25
        },
        props.style
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{ marginLeft: 25, width: 50, height: 50, borderRadius: 25 }}
          source={{
            uri:
              props.imageUrl ||
              'https://randomuser.me/api/portraits/med/men/10.jpg'
          }}
        />
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 21, fontWeight: '500' }}>
            {props.title || 'Title'}
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 16,
              fontWeight: '400',
              color: Colors.Gray500
            }}
          >
            {moment.unix(props.timestamp).calendar() || 'Timestamp'}
          </Text>
        </View>
      </View>

      <Text style={{ marginRight: 25, fontSize: 21, fontWeight: '500' }}>
        {props.amount || 'Amount'}
      </Text>
    </View>
  )
}

export default ActivityCell
