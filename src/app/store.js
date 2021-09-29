import { configureStore } from "@reduxjs/toolkit";
import chainReducer from "./features/chainSlice";
import accountReducer from "./features/accountSlice";
import dialogReducer from "./features/faceDialogSlice";
import updateDialogReducer from "./features/updateDialogSlice";
import proposalReducer from "./features/proposalSlice";

export default configureStore({
  reducer: {
    chain: chainReducer,
    account: accountReducer,
    openFaceDialog: dialogReducer,
    openUpdateDialog: updateDialogReducer,
    proposal: proposalReducer,
  },
});
