import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import Window from '../dialog/Window'
import uiActions from 'store/modules/ui'
import uiSelectors from 'store/selectors/ui'

const ConfirmDialog = ({
  
}) => {

  const dispatch = useDispatch()
  const confirmDialogConfig = useSelector(uiSelectors.confirmDialogConfig)

  const onCancel = useCallback(() => {
    dispatch(uiActions.closeConfirmDialog(false))
  })

  const onAccept = useCallback(() => {
    dispatch(uiActions.closeConfirmDialog(true))
  })

  if(!confirmDialogConfig) return null

  let {
    action = `delete`,
    itemTitle = `this item`,
    confirmTitle = `Confirm`,
    message,
    ...windowProps
  } = confirmDialogConfig

  message = message || `Are you sure you want to ${action} ${itemTitle}?`

  return (
    <Window
      { ...windowProps }
      open
      withCancel
      onCancel={ onCancel }
      onSubmit={ onAccept }
      submitTitle={ confirmTitle }
    >
      <Typography variant="body1">
        { message }
      </Typography>
    </Window>
  )
}

export default ConfirmDialog