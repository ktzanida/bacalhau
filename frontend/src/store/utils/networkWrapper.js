import {
  getErrorMessage,
} from './api'

import networkActions from '../modules/network'
import snackbarActions from '../modules/snackbar'

const networkWrapper = ({

  // the prefix and name so we can set loading and error status
  // in the network reducer - this means containers can
  // ask "is this method loading" or "was there an error with this method"
  // to display loading spinners, error messages and disable buttons
  prefix,
  name,

  // the handler function for this method - is passed dispatch, getState
  handler,

  // a function to handle any errors that were caught - normally a snackbar messaage
  errorHandler,

  // function to run before anything else
  before,

  // function to run once the loading status has been set to false
  after,

  // whether to show a snackbar error if an error occurs
  snackbarError = true,

  // should we actually throw any error to the caller
  throwErrors = false,

}) => async (dispatch, getState) => {

  if(before) {
    await before(dispatch, getState)
  }

  const networkName = 
    [prefix, name]
    .filter(s => s)
    .join('/')

  dispatch(networkActions.clearError(networkName))
  dispatch(networkActions.startLoading(networkName))

  let result = null
  let errorToThrow = null

  try {
    result = await handler(dispatch, getState)
  } catch(error) {
    const errorMessage = getErrorMessage(error)
    console.error(`Network request failure`)
    console.error(error)
    console.error(errorMessage)
    dispatch(networkActions.setError({
      name: networkName,
      value: errorMessage,
    }))
    if(errorHandler) await errorHandler(dispatch, getState, errorMessage)
    if(snackbarError) dispatch(snackbarActions.setError(errorMessage))
    result = null
    errorToThrow = error
  }

  dispatch(networkActions.stopLoading(networkName))

  if(after) {
    await after(dispatch, getState)
  }

  if(throwErrors && errorToThrow) {
    throw errorToThrow
  }

  return result
}

networkWrapper.factory = (prefix, baseProps = {}) => (name, handler, props = {}) => {
  return networkWrapper({
    prefix,
    name,
    handler,
    ...baseProps,
    ...props
  })
}

export default networkWrapper