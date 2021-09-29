import { createSlice } from "@reduxjs/toolkit";

export const proposalSlice = createSlice({
  name: "proposal",
  initialState: {
    proposal: {},
  },
  reducers: {
    setProposal: (state, action) => {
      state.proposal = action.payload;
    },
  },
});

export const { setProposal } = proposalSlice.actions;

export const proposal = (state) => state.proposal.proposal;

export default proposalSlice.reducer;
