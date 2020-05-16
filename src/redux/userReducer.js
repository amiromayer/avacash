import GoogleDriveUtils from '../helpers/GoogleDriveUtils'
import { ethers } from 'ethers'
import { throwError, clearError } from './errorReducer'

export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE'

export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS'
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE'

export const CREATE_WALLET_SUCCESS = 'CREATE_WALLET_SUCCESS'
export const CREATE_WALLET_FAILURE = 'CREATE_WALLET_FAILURE'

export const GET_WALLET_SUCCESS = 'GET_WALLET_SUCCESS'
export const GET_WALLET_FAILURE = 'GET_WALLET_FAILURE'

const initialState = {
  user: null,
  error: null,
  wallet: null
}

export const updateUserSuccess = user => {
  return { type: UPDATE_USER_SUCCESS, payload: user }
}

export const updateUserFailure = error => dispatch => {
  dispatch(throwError(error, 'Update user failed'))
  dispatch({
    type: UPDATE_USER_FAILURE,
    payload: error
  })
}

export const createUserSuccess = user => {
  return { type: CREATE_USER_SUCCESS, payload: user }
}

export const createUserFailure = error => dispatch => {
  dispatch(throwError(error, 'Create user failed'))
  dispatch({
    type: CREATE_USER_FAILURE,
    payload: error
  })
}

export const createWalletSuccess = wallet => {
  return { type: CREATE_WALLET_SUCCESS, payload: wallet }
}

export const createWalletFailure = error => dispatch => {
  dispatch(throwError(error, 'Create wallet failed'))
  dispatch({
    type: CREATE_WALLET_FAILURE,
    payload: error
  })
}

export const getWalletSuccess = wallet => {
  return { type: GET_WALLET_SUCCESS, payload: wallet }
}

export const getWalletFailure = error => dispatch => {
  dispatch(throwError(error, 'Get wallet failed'))
  dispatch({
    type: GET_WALLET_FAILURE,
    payload: error
  })
}

export const getWalletFromDrive = accessToken => async dispatch => {
  let wallet

  try {
    const googleDrive = new GoogleDriveUtils(accessToken)

    wallet = await googleDrive.getFile()

    if (wallet) {
      wallet = await googleDrive.downloadFile(wallet.id)
      dispatch(getWalletSuccess(wallet))
    } else {
      try {
        wallet = ethers.Wallet.createRandom()

        await googleDrive.uploadFile({
          address: wallet.address,
          privateKey: wallet.privateKey,
          mnemonic: wallet.mnemonic
        })
        dispatch(createWalletSuccess(wallet))
      } catch (error) {
        dispatch(createWalletFailure(error))
        throw new Error(error)
      }
    }
  } catch (error) {
    dispatch(getWalletFailure(error))
    throw new Error(error)
  }
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_SUCCESS:
      return { ...state, user: action.payload }
    case CREATE_USER_FAILURE:
      return { ...state, user: null, error: action.payload }
    case UPDATE_USER_SUCCESS:
      return { ...state, user: action.payload }
    case UPDATE_USER_FAILURE:
      return { ...state, user: null, error: action.payload }

    case CREATE_WALLET_SUCCESS:
      return { ...state, wallet: action.payload }
    case CREATE_WALLET_FAILURE:
      return { ...state, wallet: null, error: action.payload }
    case GET_WALLET_SUCCESS:
      return { ...state, wallet: action.payload }
    case GET_WALLET_FAILURE:
      return { ...state, wallet: null, error: action.payload }

    default:
      return state
  }
}

export default userReducer
