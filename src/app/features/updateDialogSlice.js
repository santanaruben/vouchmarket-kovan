import { createSlice } from "@reduxjs/toolkit";

export const updateDialogSlice = createSlice({
  name: "openUpdateDialog",
  initialState: {
    openUpdateDialog: false,
  },
  reducers: {
    setUpdateDialog: (state, action) => {
      state.openUpdateDialog = action.payload;
    },
  },
});

export const { setUpdateDialog } = updateDialogSlice.actions;

export const updateDialog = (state) => state.openUpdateDialog.openUpdateDialog;

export default updateDialogSlice.reducer;
