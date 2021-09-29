import { createSlice } from "@reduxjs/toolkit";

export const chainSlice = createSlice({
  name: "chain",
  initialState: {
    chain: null,
  },
  reducers: {
    setChain: (state, action) => {
      state.chain = action.payload;
    },
  },
});

export const { setChain } = chainSlice.actions;

export const chain = (state) => state.chain.chain;

export default chainSlice.reducer;
