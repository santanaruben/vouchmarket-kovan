import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
// import Button from "@material-ui/core/Button";
import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import "./totem.css";
import { VM, zeroAddress, checkChainId, lockProposal } from "../../vm";
import PoHLogo from "../../helpers/PoHLogo";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import { IconButton } from "@material-ui/core";
import ConfirmationDialog from "../ConfirmationDialog";
import moment from "moment";
// import "moment/locale/es-us";
// moment.locale("es-us");

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
  const { t } = useTranslation();
  const [finished, setFinished] = useState(false);
  const [changingClass, setChangingClass] = useState("showfront");

  const handleLockProposal = async () => {
    const go = await checkChainId();
    if (go)
      VM.account ? openDialog() : notify(t("messages.CONNECTFIRST"), 30000);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const openDialog = () => {
    setIsOpen(true);
    setContent(t("dialog.wantLockProposal"));
  };
  const handleModalClose = async (willProceed) => {
    try {
      setIsOpen(false);
      if (willProceed) {
        // window.alert("True");
        lockProposal(props.row.id);
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const Completionist = () => <span>{t("dashboard.totem.timeIsUp")}</span>;

  // const proposalState = () => {
  //   if (props.row.amount === 0) return "Finished";
  //   //Proposal Already Claimed
  //   else {
  //     //Proposal not claimed yet
  //     if (moment().unix() >= props.row.timeLimit - 86400) {
  //       //Time limit less 1 day (protect vouchers of lock proposals w/o enough time)
  //       if (props.row.voucher === zeroAddress) return "Finished";
  //       //Nobody locked
  //       else return "Finished (claimable only)"; //Time finished, proposal is locked
  //     } else {
  //       //There is still time
  //       if (props.row.voucher === zeroAddress) return "Open";
  //       //Time and open proposal
  //       else return "Locked"; //There is Time but the proposal is locked
  //     }
  //   }
  // };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className="scene scene--cube"
      style={{ margin: "20px" }}
    >
      <div className={"cube cube--rotate is-spinning " + changingClass}>
        <div className="cube__face cube__face--front">
          <div
            className="align-items-center"
            style={{ height: "40px" }}
            onClick={() => setChangingClass("showright")}
          >
            {/*State*/}
            {/* {proposalState()} */}
            {finished || moment().unix() >= props.row.timeLimit - 86400 ? (
              <div className="fieldValue">{t("dashboard.totem.finished")}</div>
            ) : props.row.voucher === zeroAddress ? (
              <div className="fieldValue">{t("dashboard.totem.open")}</div>
            ) : (
              <div className="fieldValue">{t("dashboard.totem.locked")}</div>
            )}
          </div>
          <hr />
          <div
            className="align-items-center"
            style={{ height: "110px" }}
            onClick={() => setChangingClass("showright")}
          >
            {/* Imagen */}
            <PoHLogo size={90} />
          </div>
          <div className="align-items-center-flex" style={{ height: "40px" }}>
            {finished ||
            moment().unix() >= props.row.timeLimit - 86400 ? null : props.row
                .voucher === zeroAddress ? (
              <Tooltip
                title={t("dashboard.totem.lockProposal")}
                placement="bottom"
              >
                <IconButton
                  color="primary"
                  aria-label="Lock Proposal"
                  onClick={() => handleLockProposal()}
                >
                  <LockIcon style={{ fontSize: 25 }} />
                </IconButton>
              </Tooltip>
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
