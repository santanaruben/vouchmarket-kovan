import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import AttachMoney from "@material-ui/icons/AttachMoney";
import Delete from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import Tooltip from "@material-ui/core/Tooltip";
import "./totem.css";
import {
  zeroAddress,
  checkChainId,
  lockProposal,
  claimRewardForVouching,
  claimVouchNotPerformed,
} from "../../vm";
import PoHLogo from "../../helpers/PoHLogo";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import IconButton from "@material-ui/core/IconButton";
import ConfirmationDialog from "../ConfirmationDialog";
import moment from "moment";
// import moment from "moment/min/moment-with-locales";
// import Moment from "react-moment";
// import "moment/locale/es-us";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { setFaceDialog } from "../../app/features/faceDialogSlice";
import { setUpdateDialog } from "../../app/features/updateDialogSlice";
import { setProposal } from "../../app/features/proposalSlice";
import { account } from "../../app/features/accountSlice";
// import i18next from "i18next";
// Moment.globalLocale = "es-us";
// moment.locale("es-us");
// const axios = require("axios").default;

// const graphURL =
//   "https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet";
// const graphQuery =
//   '{submission(id: "0x5700f03f87db485fdb90e18b3100f00b235886f1") {requests(orderBy: creationTime orderDirection: desc first: 1) {evidence(orderBy: creationTime, first: 1) {URI}}}}';
// // let graphQuery = '{submission(id:"' + value + '")}';
// const ipfs_kleros = "https://ipfs.kleros.io";

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

export default function Totem(props) {
  const dispatch = useDispatch();
  const thisAccount = useSelector(account);
  const { t } = useTranslation();
  const [finished, setFinished] = useState(false);
  const [changingClass, setChangingClass] = useState("showfront");
  // const [profilePic, setProfilePic] = useState();

  const checkFace = async () => {
    dispatch(setProposal(props.row));
    dispatch(setFaceDialog(true));
  };

  // const loadGraphData = async () => {
  //   let graphData = await axios.post(graphURL, { query: graphQuery });
  //   // console.log(graphData.data.submission.requests[0].evidence[0].URI);
  //   let res = await axios.get(
  //     ipfs_kleros + graphData.data.data.submission.requests[0].evidence[0].URI
  //   );
  //   let res2 = await axios.get(ipfs_kleros + res.data.fileURI);
  //   setProfilePic(ipfs_kleros + res2.data.photo);
  // };

  // useEffect(() => {
  //   loadGraphData();
  // }, []);

  const handleProposal = async (opt) => {
    const go = await checkChainId();
    if (go)
      thisAccount ? openDialog(opt) : notify(t("messages.CONNECTFIRST"), 30000);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState("");
  const [content, setContent] = useState("");
  const openDialog = (opt) => {
    setOption(opt);
    setIsOpen(true);
    // eslint-disable-next-line default-case
    switch (opt) {
      case "lock":
        return setContent(t("dialog.wantLockProposal"));
      case "voucherClaim":
        return setContent(t("dialog.wantVoucherClaimProposal"));
      case "userClaim":
        return setContent(t("dialog.wantUserClaimProposal"));
    }
  };
  const handleModalClose = async (willProceed) => {
    try {
      setIsOpen(false);
      // eslint-disable-next-line default-case
      switch (option) {
        case "lock":
          if (willProceed) lockProposal(props.row.id);
          break;
        case "voucherClaim":
          if (willProceed) return claimRewardForVouching(props.row.id);
          break;
        case "userClaim":
          if (willProceed) return claimVouchNotPerformed(props.row.id);
          break;
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const handleUpdateProposal = () => {
    dispatch(setProposal(props.row));
    dispatch(setUpdateDialog(true));
  };

  const Completionist = () => <span>{t("dashboard.totem.timeIsUp")}</span>;

  const state = (value) => {
    switch (value) {
      case 0:
        return (
          <div className="fieldValue">{t("dashboard.totem.finished")}</div>
        );
      case 1:
        return <div className="fieldValue">{t("dashboard.totem.open")}</div>;
      case 2:
        return <div className="fieldValue">{t("dashboard.totem.locked")}</div>;
      case 3:
        if (props.row.voucher === zeroAddress)
          return (
            <div className="fieldValue">{t("dashboard.totem.userClaimed")}</div>
          );
        else
          return (
            <div className="fieldValue">
              {t("dashboard.totem.voucherClaimed")}
            </div>
          );
      default:
        return <div className="fieldValue">{t("dashboard.totem.unknow")}</div>;
    }
  };

  // const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className="scene scene--cube"
      style={{ margin: "20px" }}
    >
      <div className={"cube cube--rotate is-spinning " + changingClass}>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{
              position: "absolute",
            }}
          >
            <PoHLogo size={180} />
          </Grid>
        </div>
        <div className="cube__face cube__face--front">
          <div
            className="align-items-center"
            style={{ height: "40px" }}
            onClick={() => setChangingClass("showright")}
          >
            {props.row.state === 1
              ? finished || moment().unix() >= props.row.timeLimit - 86400
                ? state(0)
                : state(props.row.state)
              : state(props.row.state)}
          </div>
          <hr />
          <div
            className="align-items-center"
            style={{ height: "110px" }}
            onClick={() => setChangingClass("showright")}
          >
            {/* Imagen */}
            {props.row.pic !== null ? (
              <img
                // src={profilePic}
                src={props.row.pic}
                alt="profilePic"
                width="100"
                height="100"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <PoHLogo size={90} />
            )}
          </div>
          <hr />
          <div className="align-items-center-flex" style={{ height: "40px" }}>
            <Tooltip
              title={
                <React.Fragment>
                  {t("dashboard.totem.checkFace")}
                </React.Fragment>
              }
              placement="bottom"
            >
              <IconButton
                color="primary"
                aria-label="Check Face"
                onClick={() => checkFace()}
              >
                <FaceIcon style={{ fontSize: 25 }} />
              </IconButton>
            </Tooltip>

            {finished ||
            moment().unix() >=
              props.row.timeLimit - 86400 ? null : thisAccount &&
              thisAccount !== props.row.user &&
              props.row.voucher === zeroAddress ? (
              <Tooltip
                title={t("dashboard.totem.lockProposal")}
                placement="bottom"
              >
                <IconButton
                  color="primary"
                  aria-label="Lock Proposal"
                  onClick={() => handleProposal("lock")}
                >
                  <LockIcon style={{ fontSize: 25 }} />
                </IconButton>
              </Tooltip>
            ) : null}
            {props.row.voucher === thisAccount && props.row.state === 2 ? (
              <Tooltip
                title={t("dashboard.totem.claimVoucherProposal")}
                placement="bottom"
              >
                <IconButton
                  color="primary"
                  aria-label="Claim Proposal"
                  onClick={() => handleProposal("voucherClaim")}
                >
                  <AttachMoney style={{ fontSize: 25 }} />
                </IconButton>
              </Tooltip>
            ) : null}
            {props.row.user === thisAccount &&
            props.row.state !== 3 &&
            (moment().unix() >= props.row.timeLimit ||
              props.row.voucher === zeroAddress) ? (
              <>
                <Tooltip
                  title={t("dashboard.totem.updateProposal")}
                  placement="bottom"
                >
                  <IconButton
                    color="primary"
                    aria-label="Update Proposal"
                    onClick={() => handleUpdateProposal()}
                  >
                    <UpdateIcon style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={t("dashboard.totem.claimUserProposal")}
                  placement="bottom"
                >
                  <IconButton
                    color="primary"
                    aria-label="Delete Proposal"
                    onClick={() => handleProposal("userClaim")}
                  >
                    <Delete style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </div>
        </div>
        <div
          className="cube__face cube__face--right"
          onClick={() => setChangingClass("showback")}
        >
          <div
            className="align-items-center"
            style={{
              height: "190px",
            }}
          >
            <div className="subtitle">{t("dashboard.totem.reward")}</div>
            <br />
            <div className="fieldValue">{props.row.amount + " ETH"}</div>
          </div>
        </div>

        <div
          className="cube__face cube__face--back"
          onClick={() => setChangingClass("showleft")}
        >
          <div className="align-items-center" style={{ height: "95px" }}>
            <div className="subtitle">{t("dashboard.totem.timeLimit")}</div>
            <br />
            <div className="fieldValue" style={{ maxWidth: "140px" }}>
              {moment.unix(props.row.timeLimit - 86400).format("LLL")}
              {/* <Moment locale="es-us" format={`LLL`} unix>
                {props.row.timeLimit - 86400}
              </Moment> */}
            </div>
          </div>
          <hr />
          <div className="align-items-center" style={{ height: "95px" }}>
            <div className="subtitle">{t("dashboard.totem.countdown")}</div>
            <br />
            <div className="fieldValue">
              <Countdown
                date={props.row.timeLimit * 1000 - 86400000}
                onComplete={() => setFinished(true)}
              >
                <Completionist />
              </Countdown>
            </div>
          </div>
        </div>

        <div className="cube__face cube__face--left">
          <div className="align-items-center" style={{ height: "95px" }}>
            <a
              target="blank"
              href={
                "https://app.proofofhumanity.id/profile/" +
                props.row.user +
                "?network=mainnet"
              }
            >
              {"https://app.proofofhumanity.id/profile/" +
                props.row.user +
                "?network=mainnet"}
            </a>
          </div>
          <hr />
          <div
            className="align-items-center"
            style={{ height: "95px" }}
            onClick={() => setChangingClass("showfront")}
          >
            <div className="subtitle">{t("dashboard.totem.voucher")}</div>
            <br />
            <div className="fieldValue" style={{ maxWidth: "140px" }}>
              {props.row.voucher === zeroAddress
                ? t("dashboard.totem.none")
                : props.row.voucher}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        open={isOpen}
        onClose={handleModalClose}
        content={content}
      />
    </Grid>
  );
}

// https://thegraph.com/explorer/subgraph/kleros/proof-of-humanity-mainnet?query=Example%20query
// {
//     submissions(first:2){
//         id
//         requests{evidence{sender URI}}
//     }
// }

// {
// submission(id: "0x5700f03f87db485fdb90e18b3100f00b235886f1") {
//       requests(
//         orderBy: creationTime
//         orderDirection: desc
//         first: 1
//         where: { registration: true }
//       ) {
//         evidence(orderBy: creationTime, first: 1) {
//           URI
//         }
//       }
//     }
// }

// {
//     submission(id: "0x5700f03f87db485fdb90e18b3100f00b235886f1"){
//         requests(orderBy: creationTime orderDirection: desc first: 1){evidence{URI}}
//     }
// }
