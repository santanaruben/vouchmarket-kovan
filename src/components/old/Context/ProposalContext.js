import { createContext } from "react";

// const proposal = {};

// export default createContext(proposal);

const ProposalContext = createContext({
  proposal: {
    id: null,
    user: "0x",
    voucher: null,
    amount: null,
    timeLimit: null,
  },
  setProposal: () => {},
});

export default ProposalContext;
