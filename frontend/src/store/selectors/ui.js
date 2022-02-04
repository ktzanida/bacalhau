import { createSelector } from 'reselect'

const confirmDialog = state => state.ui.confirmDialog
const confirmDialogOpen = createSelector(
  confirmDialog,
  confirmDialog => confirmDialog ? confirmDialog.open : false,
)
const confirmDialogConfig = createSelector(
  confirmDialog,
  confirmDialog => confirmDialog ? confirmDialog.config : undefined,
)

const selectors = {
  confirmDialog,
  confirmDialogOpen,
  confirmDialogConfig,
}

export default selectors
