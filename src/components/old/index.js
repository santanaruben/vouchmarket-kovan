import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import NewProposal from "./NewProposal.tsx";
import {
  VM,
  LogProposal,
  LogProposalLocked,
  LogWithdrawn,
  weiToEth2,
} from "../../vm";
import { useSelector } from "react-redux";
import { chain } from "../../app/features/chainSlice";
import { account } from "../../app/features/accountSlice";
import ProposalsContainer from "./ProposalsContainer";
import ProposalsSkeleton from "./ProposalsSkeleton";
// import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const axios = require("axios").default;

// const notify = (msg, time) =>
//   toast(msg, {
//     position: "bottom-right",
//     autoClose: time,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//   });

const graphURL =
  "https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet";
const graphQuery =
  '{submission(id: "0x5700f03f87db485fdb90e18b3100f00b235886f1") {requests(orderBy: creationTime orderDirection: desc first: 1) {evidence(orderBy: creationTime, first: 1) {URI}}}}';
// let graphQuery = '{submission(id:"' + value + '")}';
const ipfs_kleros = "https://ipfs.kleros.io";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default function UserProposals() {
  const thisChain = useSelector(chain);
  const thisAccount = useSelector(account);
  const classes = useStyles();
  const { t } = useTranslation();
  const [proposals, setProposals] = useState();
  const [noProposals, setNoProposals] = useState(false);
  // setProposals([...a]); //Para re-renderizar

  useEffect(() => {
    if (thisChain === null) return;
    if (VM.VouchMarket === null) return;
    setProposals();
    let allProposals, userProposals, lockProposals, userLockProposals;
    async function fetchData() {
      lockProposals = await LogProposalLocked(null, thisAccount);
      console.log(lockProposals);
      let idUserLockProposals = await Promise.all(
        lockProposals.map(async (row) => {
          return row.args.idProposal.toString();
        })
      );
      userLockProposals = await LogProposal(idUserLockProposals, null);
      userProposals = await LogProposal(null, thisAccount);
      allProposals = userProposals.concat(userLockProposals);
      // console.log(userProposals);
      // userLockProposals = await Promise.all(
      //   lockProposals.map(async (row) => {
      //     let proposal = await LogProposal(
      //       row.args.idProposal.toString(),
      //       null
      //     );
      //     return proposal;
      //   })
      // );
      // const locks = userLockProposals[0];
      // if (locks !== undefined)
      // allProposals = userProposals.concat(userLockProposals[0]);
      // else allProposals = userProposals;
      console.log(allProposals);
      if (allProposals.length > 0) formatProposals(allProposals);
      else if (allProposals.length === 0) setNoProposals(true);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisChain, thisAccount]);

  const formatProposals = async (_proposals) => {
    let completeList;
    const list = _proposals.map(function (row) {
      return {
        id: row.args.idProposal.toNumber(),
        amount:
          Number(weiToEth2(row.args.amount)) -
          Number(weiToEth2(row.args.amount) / VM.feeDivisor),
        timeLimit: row.args.timeLimit.toNumber(),
        user: row.args.user.toString(),
        voucher: row.args.voucher.toString(),
        state: 1,
        pic: null,
      };
    });

    // let list = [];
    // for (let i = 0; i < _proposals.length; i++) {
    //   if (i === quantity) {
    //     break;
    //   }
    //   list[i] = {
    //     id: _proposals[i].args.idProposal.toNumber(),
    //     amount:
    //       Number(weiToEth2(_proposals[i].args.amount)) -
    //       Number(weiToEth2(_proposals[i].args.amount) / VM.feeDivisor),
    //     timeLimit: _proposals[i].args.timeLimit.toNumber(),
    //     user: _proposals[i].args.user.toString(),
    //     voucher: _proposals[i].args.voucher.toString(),
    //     state: 1,
    //     pic: null,
    //   };
    // }
    // console.log(list);

    const proposalsLocked = await LogProposalLocked();
    const listLocked = proposalsLocked.map(function (row) {
      return {
        id: row.args.idProposal.toNumber(),
        voucher: row.args.voucher.toString(),
        state: 2,
      };
    });

    // eslint-disable-next-line array-callback-return
    listLocked.map(function (lockedRow) {
      let rowIndex = list.findIndex(
        (proposalRow) => proposalRow.id === lockedRow.id
      );
      if (rowIndex !== -1) {
        list[rowIndex].voucher = lockedRow.voucher;
        list[rowIndex].state = lockedRow.state;
      }
    });

    const proposalsWithdrawn = await LogWithdrawn();
    const listWithdrawn = proposalsWithdrawn.map(function (row) {
      return {
        id: row.args.idProposal.toNumber(),
        amount: Number(weiToEth2(row.args.fund)),
        withdrawer: row.args.withdrawer.toString(), //cambiar voucher por withdrawer
        state: 3,
      };
    });

    // eslint-disable-next-line array-callback-return
    listWithdrawn.map(function (withdrawnRow) {
      let rowIndex = list.findIndex(
        (proposalRow) => proposalRow.id === withdrawnRow.id
      );
      if (rowIndex !== -1) {
        list[rowIndex].amount = withdrawnRow.amount;
        list[rowIndex].state = withdrawnRow.state;
      }
    });

    let graphDataTest;
    // graphDataTest = await axios
    //   .post(graphURL, { query: graphQuery })
    //   .catch((err) => {
    //     console.log(err);
    //     notify(t("messages.SUBGRAPHERROR"), 30000);
    //   });

    if (graphDataTest) {
      completeList = await Promise.all(
        list.map(async function (row, i) {
          let graphData = await axios.post(graphURL, { query: graphQuery });
          if (graphData.data) {
            let submission = await axios.get(
              ipfs_kleros +
                graphData.data.data.submission.requests[0].evidence[0].URI
            );
            let registrantFile = await axios.get(
              ipfs_kleros + submission.data.fileURI
            );
            let picture = ipfs_kleros.concat(registrantFile.data.photo);
            return { ...row, pic: picture };
          }
          // else {
          //   return { ...row, pic: null };
          // }
        })
      );
    } else {
      completeList = list;
    }
    const proposalList = completeList.slice(0).reverse();
    setProposals(proposalList);
    // console.log(proposalList);
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {proposals ? (
        <ProposalsContainer list={proposals} />
      ) : noProposals ? (
        <div>{t("messages.NOPROPOSALS")}</div>
      ) : (
        <ProposalsSkeleton />
      )}
      <NewProposal />
    </main>
  );
}
