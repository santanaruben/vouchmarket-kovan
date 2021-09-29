import { toast } from "react-toastify";
import i18n from "./i18n";
const Web3 = require("web3");
const Contract = require("@truffle/contract");

// Block of deployed contract
const CONTRACTBLOCK = 13294121;

// Compiled contract
var VMjson = require("./contracts/VouchMarket.json");

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

export const VM = {
  web3: null, //API
  account: null, //User actual account
  contract: null, //Contract
  VouchMarket: null, //Contract instance
  // chainId: 1337, // local
  // chainId: 42, //Ethereum kovan chain id
  chainId: 1, //Ethereum mainnet chain id
  minDeposit: 0.013,
  minTimeLimit: 5,
  // minTimeLimit: 0,
  feeDivisor: null,

  /*--------------------------------------------------
   *   Initial Functions
   *-------------------------------------------------*/

  initWeb3: async function () {
    try {
      if (typeof window.ethereum !== "undefined") {
        // VM.web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        VM.web3 = new Web3(Web3.givenProvider);
        return VM.initContract();
      } else {
        // VM.web3 = new Web3(infuraProvider);
        notify(i18n.t("messages.INSTALLMETAMASK"), 30000);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  initContract: async function () {
    try {
      VM.contract = await Contract({ abi: VMjson });
      await VM.contract.setNetwork(VM.chainId);
      await VM.contract.setProvider(VM.web3.currentProvider);
      // VM.VouchMarket = await VM.contract.deployed();
      VM.VouchMarket = await VM.contract.at(
        // "0x96f92dCBBf48a63Aac79DFff7De3eE5FAC0a8AC4" //kovan
        "0xF77902D93FBAe39Bb969bB9E7391526de4619a3E" //mainnet
      );
      await checkChainId();
      await VM.stateVariables();
      return true;
    } catch (error) {
      console.log(error);
      notify(i18n.t("messages.WRONGCHAIN"), 30000);
      return false;
    }
  },

  stateVariables: async function () {
    try {
      const _feeDivisor = await VM.VouchMarket.feeDivisor();
      VM.feeDivisor = _feeDivisor.words[0];
    } catch (error) {
      console.log(error);
    }
  },

  actualAccount: async function () {
    // const accounts = await VM.web3.eth.getAccounts();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    VM.account = toChecksum(accounts[0]);
    window.ethereum.on("accountsChanged", async function (accounts) {
      VM.account = toChecksum(accounts[0]);
    });
    window.ethereum.on("chainChanged", (chainId) => {
      checkChainId();
    });
  },
};

/*--------------------------------------------------
 *   Help Functions
 *-------------------------------------------------*/

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export function weiToEth(amount) {
  return VM.web3.utils.fromWei(amount, "ether") + " ETH";
}

export function weiToEth2(amount) {
  return VM.web3.utils.fromWei(amount, "ether");
}

export function toBytes32(value) {
  return VM.web3.utils.fromAscii(value);
}

export function fromBytes32(value) {
  // return VM.web3.utils.toAscii(value);
  // eslint-disable-next-line no-control-regex
  return VM.web3.utils.toAscii(value).replace(/\u0000/g, "");
}

export function isAddress(value) {
  return VM.web3.utils.isAddress(value);
}

export function toChecksum(value) {
  return VM.web3.utils.toChecksumAddress(value);
}

export function BN(value) {
  return VM.web3.utils.BN(value);
}

export async function checkChainId() {
  const chainId = await VM.web3.eth.getChainId();
  if (chainId !== VM.chainId) {
    notify(i18n.t("messages.WRONGCHAIN"), 30000);
    return false;
  }
  return true;
}

export async function getGasPrice() {
  await VM.web3.eth.getGasPrice(async function (e, r) {
    let a = await VM.web3.utils.fromWei(r, "gwei");
    return a;
  });
}

/*--------------------------------------------------
 *   Internal Functions
 *-------------------------------------------------*/

function txSent() {
  notify(i18n.t("messages.TXSENT"), 30000);
  return true;
}

function catchError(error) {
  console.log(error);
  switch (error.code) {
    case -32603:
      notify(i18n.t("messages.ERROR32603"), 30000);
      break;
    case 4001:
      notify(i18n.t("messages.ERROR4001"), 30000);
      break;
    default:
      notify(i18n.t("messages.ERRORDEFAULT"), 30000);
  }
  return false;
}

/*--------------------------------------------------
 *   Proposal Functions
 *-------------------------------------------------*/

export async function submitProposal(amount, addedTime, voucher) {
  try {
    const account = VM.account;
    if (!voucher) voucher = zeroAddress;
    addedTime = addedTime * 86400;
    await VM.VouchMarket.submitProposal(addedTime, toChecksum(voucher), {
      from: account,
      value: VM.web3.utils.toWei(amount, "ether"),
    }).on("transactionHash", function () {
      return txSent();
    });
    return true;
  } catch (error) {
    return catchError(error);
  }
}

export async function lockProposal(idProposal) {
  try {
    const account = VM.account;
    // const success = await VM.VouchMarket.lockProposal.call(idProposal, {
    //   from: account,
    // });
    // if (!success) {
    //   notify(i18n.t("messages.TRANSACTIONWILLFAIL"), 30000);
    //   return false;
    // }
    await VM.VouchMarket.lockProposal(idProposal, {
      from: account,
    }).on("transactionHash", function () {
      return txSent();
    });
  } catch (error) {
    return catchError(error);
  }
}

export async function updateProposal(amount, idProposal, addedTime, voucher) {
  try {
    const account = VM.account;
    if (!voucher) voucher = zeroAddress;
    addedTime = addedTime * 86400;
    await VM.VouchMarket.updateProposal(
      idProposal,
      addedTime,
      toChecksum(voucher),
      {
        from: account,
        value: VM.web3.utils.toWei(amount, "ether"),
      }
    ).on("transactionHash", function () {
      return txSent();
    });
    return true;
  } catch (error) {
    return catchError(error);
  }
}

export async function claimRewardForVouching(idProposal) {
  try {
    const account = VM.account;
    await VM.VouchMarket.claimRewardForVouching(idProposal, {
      from: account,
    }).on("transactionHash", function () {
      return txSent();
    });
  } catch (error) {
    return catchError(error);
  }
}

export async function claimVouchNotPerformed(idProposal) {
  try {
    const account = VM.account;
    await VM.VouchMarket.claimVouchNotPerformed(idProposal, {
      from: account,
    }).on("transactionHash", function () {
      return txSent();
    });
  } catch (error) {
    return catchError(error);
  }
}

/*--------------------------------------------------
 *   Getters
 *-------------------------------------------------*/

export async function getProposal(idProposal) {
  try {
    let proposal = await VM.VouchMarket.proposalMap(idProposal);
    return proposal;
  } catch (error) {
    console.log(error);
  }
}

export async function getProposalCounter() {
  try {
    let quantity = await VM.VouchMarket.proposalCounter();
    return quantity;
  } catch (error) {
    console.log(error);
  }
}

/*--------------------------------------------------
 *   Logs
 *-------------------------------------------------*/

export async function LogProposal(idProposal, user) {
  var log = VM.VouchMarket.getPastEvents("LogProposal", {
    filter: {
      idProposal: idProposal,
      user: user,
    },
    fromBlock: CONTRACTBLOCK,
    toBlock: "latest",
  });
  return log;
}

export async function LogProposalLocked(idProposal, voucher) {
  var log = VM.VouchMarket.getPastEvents("LogProposalLocked", {
    filter: {
      idProposal: idProposal,
      voucher: voucher,
    },
    fromBlock: CONTRACTBLOCK,
    toBlock: "latest",
  });
  return log;
}

export async function LogWithdrawn(idProposal, withdrawer) {
  var log = VM.VouchMarket.getPastEvents("LogWithdrawn", {
    filter: {
      idProposal: idProposal,
      withdrawer: withdrawer,
    },
    fromBlock: CONTRACTBLOCK,
    toBlock: "latest",
  });
  return log;
}

export async function LogClaimVouchNotPerformed(idProposal) {
  var log = VM.VouchMarket.getPastEvents("LogClaimVouchNotPerformed", {
    filter: {
      idProposal: idProposal,
    },
    fromBlock: CONTRACTBLOCK,
    toBlock: "latest",
  });
  return log;
}
