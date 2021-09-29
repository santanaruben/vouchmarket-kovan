import React, { useState, useEffect, useRef } from "react";
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

export default function Proposals() {
  const thisChain = useSelector(chain);
  const classes = useStyles();
  const { t } = useTranslation();
  const [proposals, setProposals] = useState();
  const currentProposals = useRef();
  const [noProposals, setNoProposals] = useState(false);
  // const emitter = useRef();

  // async function logP() {
  //   await VM.VouchMarket.LogProposal(
  //     {
  //       // filter: {
  //       //   myOtherIndexedParam: VM.account,
  //       // },
  //       fromBlock: "latest",
  //     },
  //     function (error, event) {
  //       console.log(event);
  //     }
  //   );
  //   // .on("data", ev)
  //   // .on("changed", function (event) {
  //   //   console.log(event);
  //   //   // remove event from local database
  //   // })
  //   // .on("error", console.error);
  // }

  // const [, updateState] = React.useState();
  // const forceUpdate = React.useCallback(() => updateState({}), []);

  function ev(event) {
    // console.log(event);
    let list = currentProposals.current;

    let rowIndex = list.findIndex(
      (proposalRow) => proposalRow.id === event.args.idProposal.toNumber()
    );
    if (rowIndex !== -1) {
      // console.log(list[rowIndex].amount);
      // const updatedObj = { ...list[rowIndex], amount: 1 };
      // list = [
      //   ...list.slice(0, rowIndex),
      //   updatedObj,
      //   ...list.slice(rowIndex + 1),
      // ];
      // console.log(list);

      list.splice(rowIndex, 1);
      console.log(list);

      // list[rowIndex].amount =
      //   Number(weiToEth2(event.args.amount)) -
      //   Number(weiToEth2(event.args.amount) / VM.feeDivisor);
      // list[rowIndex].fee = Number(weiToEth2(event.args.amount) / VM.feeDivisor);
      // list[rowIndex].timeLimit = event.args.timeLimit.toNumber();
      // list[rowIndex].voucher = event.args.voucher.toString();
      // list[rowIndex].state = 1;
    }
    list.unshift({
      id: event.args.idProposal.toNumber(),
      amount:
        Number(weiToEth2(event.args.amount)) -
        Number(weiToEth2(event.args.amount) / VM.feeDivisor),
      fee: Number(weiToEth2(event.args.amount) / VM.feeDivisor),
      timeLimit: event.args.timeLimit.toNumber(),
      user: event.args.user.toString(),
      voucher: event.args.voucher.toString(),
      state: 1,
      pic: null,
    });
    currentProposals.current = [...list];
    setProposals([...currentProposals.current]);
  }

  // const useIsMount = () => {
  //   const isMountRef = useRef(true);
  //   useEffect(() => {
  //     isMountRef.current = false;
  //   }, []);
  //   return isMountRef.current;
  // };

  // const isMount = useIsMount();

  useEffect(() => {
    // window.removeEventListener("data", ev);
    if (thisChain === null) return;
    if (VM.VouchMarket === null) return;

    // if (isMount) return;
    // const eventEmitter =
    // emitter.current =
    VM.VouchMarket.LogProposal(
      {
        // filter: {
        //   myOtherIndexedParam: VM.account,
        // },
        fromBlock: "latest",
      }
      // ,
      // function (error, event) {
      //   console.log(event);
      //   ev(event);
      // }
    ).on("data", ev);
    // logP();

    console.log("1");

    return async () => {
      // console.log(await emitter.current);
      console.log(window);
      window.removeEventListener("data", ev);
      console.log(window);
      console.log("aqui");
      // console.log(await eventEmitter);
      // await eventEmitter.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisChain]);

  useEffect(() => {
    if (thisChain === null) return;
    if (VM.VouchMarket === null) return;
    let allProposals;
    async function fetchData() {
      allProposals = await LogProposal();
      if (allProposals.length > 0) formatProposals(allProposals);
      else if (allProposals.length === 0) setNoProposals(true);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisChain]);

  const formatProposals = async (_proposals) => {
    let completeList;
    const listA = _proposals.map(function (row) {
      return {
        id: row.args.idProposal.toNumber(),
        amount:
          Number(weiToEth2(row.args.amount)) -
          Number(weiToEth2(row.args.amount) / VM.feeDivisor),
        fee: Number(weiToEth2(row.args.amount) / VM.feeDivisor),
        timeLimit: row.args.timeLimit.toNumber(),
        user: row.args.user.toString(),
        voucher: row.args.voucher.toString(),
        state: 1,
        pic: null,
      };
    });

    let list = listA
      .slice()
      .reverse()
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      .reverse();

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
    currentProposals.current = proposalList;
    console.log(proposalList);
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
