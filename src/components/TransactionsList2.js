import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SectionList, Dimensions } from 'react-native'
import Colors from '../constants/colors'
import TransactionCell from '../components/TransactionCell'
import moment from 'moment'
import _ from 'lodash'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { Feather } from '@expo/vector-icons'
const screen = Dimensions.get('screen')
import LoadingCellPlaceholder from '../components/LoadingCellPlaceholder'

import { createSelector } from 'reselect'

const getTransactions = createSelector(
  state => state.transactions.history,
  history => history
)

const arrFromApi = [
  {
    hash: 'hash1',
    timestamp: 1591360585
  },
  {
    hash: 'hash2',
    timestamp: 1591360580
  },
  {
    hash: 'hash3',
    timestamp: 1591320585
  }
]

const getAllTransactionsArray = createSelector(
  getTransactions,
  transactions => {
    console.log('transactions: ', transactions)
    const arr = []

    for (let [hash, transaction] of Object.entries(transactions.byHash)) {
      arr.push(transaction)
    }

    return arr
  }
)

const getTransactionByHash = hash =>
  createSelector(getTransactions, transactions => transactions.byHash[hash])

// const getTransactionsByDate = createSelector(
//   getAllTransactionsArray,
//   transactions => {
//     console.log('transactions: ', transactions)
//     // let sorted = _.orderBy(
//     //   transactions,
//     //   tx => moment.unix(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD'),
//     //   ['desc']
//     // )

//     // console.log('sorted: ', sorted)

//     // let transactionsByDate = _.groupBy(sorted, tx =>
//     //   moment.unix(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
//     // )

//     // console.log('transactionsByDate: ', transactionsByDate)
//   }
// )

const renderItem = ({ item }) => {
  // console.log('renderItem')
  return <Text key={item.hash}>{item.hash}</Text>
}

const extractKey = ({ hash }) => hash

const renderSectionHeader = ({ section }) => {
  return <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
}

const TransactionsList = props => {
  const isLoading = useSelector(state => state.transactions.isLoading)

  let transactions = useSelector(getTransactions, shallowEqual)
  console.log('transactions: ', transactions)

  // const txByHash1 = useSelector(getTransactionByHash('hash4'))
  // console.log('txByHash1: ', txByHash1)

  // let sorted = _.orderBy(
  //   transactions,
  //   tx => moment.unix(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD'),
  //   ['desc']
  // )

  // let transactionsByDate = _.groupBy(sorted, tx =>
  //   moment.unix(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
  // )

  let sections = []

  // for (let [hash, transaction] of Object.entries(transactions.byHash)) {
  //   sections.push({
  //     id: hash,
  //     title: hash.slice(0, 5),
  //     data: transaction
  //   })
  // }

  for (let i = 0; i < transactions.allHashes.length; i++) {
    sections.push({
      id: i,
      title: transactions.byHash[transactions.allHashes[i]].slice(0, 5),
      data: transactions.byHash[transactions.allHashes[i]]
    })
  }

  return (
    <>
      <Text>sfddf</Text>
      {true && (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          keyExtractor={extractKey}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={props.ListHeaderComponent}
          ListEmptyComponent={() => (
            <>
              {isLoading ? (
                <View style={{ marginTop: 30 }}>
                  <LoadingCellPlaceholder></LoadingCellPlaceholder>
                  <LoadingCellPlaceholder></LoadingCellPlaceholder>
                  <LoadingCellPlaceholder></LoadingCellPlaceholder>
                  <LoadingCellPlaceholder></LoadingCellPlaceholder>
                  <LoadingCellPlaceholder></LoadingCellPlaceholder>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: screen.height / 20
                  }}
                >
                  <Text
                    style={{
                      marginVertical: 5,
                      fontSize: 16,
                      color: Colors.Gray500
                    }}
                  >
                    Transactions will appear here
                  </Text>
                </View>
              )}
            </>
          )}
        ></SectionList>
      )}
    </>
  )
}

export default TransactionsList

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Colors.Gray100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600'
  }
})
