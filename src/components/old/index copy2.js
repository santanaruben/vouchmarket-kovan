import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import NewProposal from "./NewProposal.tsx";
import { VM, weiToEth2, getProposalCounter, getProposal } from "../../vm";
import ChainContext from "../../Context/ChainContext";
import ProposalsContainer from "./ProposalsContainer";
import ProposalsSkeleton from "./ProposalsSkeleton";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default function Proposals() {
  const chain = useContext(ChainContext);
  const classes = useStyles();
  const [proposals, setProposals] = useState();

  useEffect(() => {
    if (!chain) return;
    if (VM.VouchMarket === null) return;
    let proposalCounter;
    async function fetchData() {
      proposalCounter = (await getProposalCounter()).toNumber();
      if (proposalCounter > 0) formatProposals(proposalCounter);
    }
    fetchData();
  }, [chain]);

  const formatProposals = async (proposalCounter) => {
    console.log(proposalCounter);
    let i = 0;
    let proposal = {};
    let allProposals = [];
    for (i === 0; i < proposalCounter; i++) {
      proposal = await getProposal(i);
      allProposals.push(proposal);
    }
    const list = allProposals.map(function (row, i) {
      return {
        id: i,
        amount:
          Number(weiToEth2(row.amount)) -
          Number(weiToEth2(row.amount) / VM.feeDivisor),
        timeLimit: row.timeLimit.toNumber(),
        user: row.user.toString(),
        voucher: row.voucher.toString(),
      };
    });
    setProposals(list);
    console.log(list);
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {proposals ? (
        <ProposalsContainer list={proposals} />
      ) : (
        <ProposalsSkeleton />
      )}
      <NewProposal />
    </main>
  );
}
