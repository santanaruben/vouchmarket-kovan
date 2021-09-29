import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import NewProposal from "./NewProposal.tsx";
import { VM, LogProposal, weiToEth2 } from "../../vm";
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
    let allProposals;
    async function fetchData() {
      allProposals = await LogProposal();
      if (allProposals.length > 0) formatProposals(allProposals);
    }
    fetchData();
  }, [chain]);

  const formatProposals = async (_proposals) => {
    console.log(_proposals);
    // const list = _proposals.map((row) => row.args.amount.toString());
    // const list = _proposals.map((item, i) => ({ registro: i+1, ...item }))
    const list = _proposals.map(function (row) {
      return {
        id: row.args.idProposal.toNumber(),
        amount: Number(weiToEth2(row.args.amount)),
        timeLimit: row.args.timeLimit.toNumber(),
        user: row.args.user.toString(),
        voucher: row.args.voucher.toString(),
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
