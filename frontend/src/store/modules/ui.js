import Promise from 'bluebird'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import uiSelectors from '../selectors/ui'

const prefix = 'ui'

const initialState = {
  confirmDialog: null,
}

const reducers = {
  setConfirmDialog: (state, action) => {
    state.confirmDialog = action.payload
  },
}

const sideEffects = {

  openConfirmDialog: (config) => async (dispatch, getState) => {

    let open = true

    dispatch(actions.setConfirmDialog({
      open,
      config,
      result: null,
    }))

    while(open) {
      await Promise.delay(100)
      open = uiSelectors.confirmDialogOpen(getState())
    }

    const dialogState = uiSelectors.confirmDialog(getState())
    const returnValue = dialogState.result

    dispatch(actions.setConfirmDialog(null))

    return returnValue
  },

  closeConfirmDialog: (result = false) => async (dispatch, getState) => {
    const dialogState = uiSelectors.confirmDialog(getState())
    dispatch(actions.setConfirmDialog(Object.assign({}, dialogState, {
      result,
      open: false,
    })))
  },
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  sideEffects,
  prefix,
})

export { actions, reducer }
export default actions
