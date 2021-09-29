import { createSlice } from "@reduxjs/toolkit";

export const faceDialogSlice = createSlice({
  name: "openFaceDialog",
  initialState: {
    openFaceDialog: false,
  },
  reducers: {
    setFaceDialog: (state, action) => {
      state.openFaceDialog = action.payload;
    },
  },
});

export const { setFaceDialog } = faceDialogSlice.actions;

export const faceDialog = (state) => state.openFaceDialog.openFaceDialog;

export default faceDialogSlice.reducer;
