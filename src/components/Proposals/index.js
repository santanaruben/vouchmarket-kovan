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
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const axios = require("axios").default;

const notify = (msg, time) =>
  toast(msg, {
    position: "bottom-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

// const graphURL =
//   "https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet";
// const graphQuery =
//   '{submission(id: "0x5700f03f87db485fdb90e18b3100f00b235886f1") {requests(orderBy: creationTime orderDirection: desc first: 1) {evidence(orderBy: creationTime, first: 1) {URI}}}}';
// // let graphQuery = '{submission(id:"' + value + '")}';
// const ipfs = "https://ipfs.kleros.io";

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

    let graphDataTest = await axios
      .get(
        "https://api.poh.dev/profiles/0x5700f03f87db485fdb90e18b3100f00b235886f1"
      )
      .catch((err) => {
        console.log(err);
        notify(t("messages.SUBGRAPHERROR"), 30000);
      });

    if (graphDataTest) {
      completeList = await Promise.all(
        list.map(async function (row, i) {
          let graphData = await axios
            .get("https://api.poh.dev/profiles/" + row.user)
            .catch(() => {
              return { ...row, pic: null };
            });
          if (graphData.data) {
            let picture = graphData.data.photo;
            return { ...row, pic: picture };
          } else {
            return { ...row, pic: null };
          }
        })
      ).catch((err) => {
        console.log(err);
      });
    } else {
      completeList = list;
    }
    const proposalList = completeList.slice(0).reverse();
    setProposals(proposalList);
    currentProposals.current = proposalList;
    // console.log(proposalList);

    // let graphDataTest;
    // graphDataTest = await axios
    //   .post(graphURL, { query: graphQuery })
    //   .catch((err) => {
    //     console.log(err);
    //     notify(t("messages.SUBGRAPHERROR"), 30000);
    //   });

    // if (graphDataTest) {
    //   completeList = await Promise.all(
    //     list.map(async function (row, i) {
    //       let graphData = await axios.post(graphURL, { query: graphQuery });
    //       if (graphData.data) {
    //         let submission = await axios.get(
    //           ipfs + graphData.data.data.submission.requests[0].evidence[0].URI
    //         );
    //         let registrantFile = await axios.get(
    //           ipfs + submission.data.fileURI
    //         );
    //         let picture = ipfs.concat(registrantFile.data.photo);
    //         return { ...row, pic: picture };
    //       }
    //       // else {
    //       //   return { ...row, pic: null };
    //       // }
    //     })
    //   );
    // } else {
    //   completeList = list;
    // }
    // const proposalList = completeList.slice(0).reverse();
    // setProposals(proposalList);
    // currentProposals.current = proposalList;
    // console.log(proposalList);
  };

  useEffect(() => {
    if (thisChain === null) return;
    if (VM.VouchMarket === null) return;
    VM.VouchMarket.LogProposal({
      fromBlock: "latest",
    }).on("data", ev);
    return () => {
      window.removeEventListener("data", ev);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisChain]);

  async function ev(event) {
    let rowIndex = currentProposals.current.findIndex(
      (proposalRow) => proposalRow.id === event.args.idProposal.toNumber()
    );
    if (rowIndex !== -1) {
      await currentProposals.current.splice(rowIndex, 1);
    }

    let pict;
    let graphData = await axios
      .get("https://api.poh.dev/profiles/" + event.args.user)
      .catch(() => {
        pict = null;
      });
    if (graphData.data) {
      let picture = graphData.data.photo;
      pict = picture;
    } else {
      pict = null;
    }

    await currentProposals.current.unshift({
      id: event.args.idProposal.toNumber(),
      amount:
        Number(weiToEth2(event.args.amount)) -
        Number(weiToEth2(event.args.amount) / VM.feeDivisor),
      fee: Number(weiToEth2(event.args.amount) / VM.feeDivisor),
      timeLimit: event.args.timeLimit.toNumber(),
      user: event.args.user.toString(),
      voucher: event.args.voucher.toString(),
      state: 1,
      pic: pict,
    });
    setProposals([...currentProposals.current]);
  }

  useEffect(() => {
    if (thisChain === null) return;
    if (VM.VouchMarket === null) return;
    VM.VouchMarket.LogWithdrawn({
      fromBlock: "latest",
    }).on("data", ev2);
    return () => {
      window.removeEventListener("data", ev2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisChain]);

  async function ev2(event) {
    let rowIndex = await currentProposals.current.findIndex(
      (proposalRow) => proposalRow.id === event.args.idProposal.toNumber()
    );
    if (rowIndex !== -1) {
      const updatedObj = { ...currentProposals.current[rowIndex], state: 3 };
      await currentProposals.current.splice(rowIndex, 1, updatedObj);
      // await currentProposals.current.splice(rowIndex, 1);
      // await currentProposals.current.push(updatedObj);
      setProposals([...currentProposals.current]);
    }
  }

  useEffect(() => {
    if (thisChain === null) return;
    if (VM.VouchMarket === null) return;
    VM.VouchMarket.LogProposalLocked({
      fromBlock: "latest",
    }).on("data", ev3);
    return () => {
      window.removeEventListener("data", ev3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisChain]);

  async function ev3(event) {
    let rowIndex = await currentProposals.current.findIndex(
      (proposalRow) => proposalRow.id === event.args.idProposal.toNumber()
    );
    if (rowIndex !== -1) {
      const updatedObj = {
        ...currentProposals.current[rowIndex],
        state: 2,
        voucher: event.args.voucher,
      };
      await currentProposals.current.splice(rowIndex, 1, updatedObj);
      setProposals([...currentProposals.current]);
    }
  }

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
