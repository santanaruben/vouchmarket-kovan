import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FaceIcon from "@material-ui/icons/Face";
import LockIcon from "@material-ui/icons/Lock";
import AttachMoney from "@material-ui/icons/AttachMoney";
import ProposalsContainer from "../Proposals/ProposalsContainer";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  connectButton: {
    width: "130px",
  },
  topbarLogo: {
    height: "30px",
    verticalAlign: "middle",
  },
  centered: {
    textAlign: "center",
  },
  form: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
  },
}));

const timeL = moment().unix() + 400000;
const dataProposal = [
  {
    id: "-1",
    amount: 0.0075,
    fee: 0.0025,
    timeLimit: timeL,
    user: "0x5700F03F87db485fdb90e18b3100F00b235886f1",
    voucher: "0x0000000000000000000000000000000000000000",
    state: 1,
    pic: "https://ipfs.kleros.io/ipfs/QmbXNt6GxcANY4x7qRZqf9Ew26woJYb5V5eWEEtE1mER6N/img-20210312-154343.jpg",
  },
];

export default function Guide2() {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      {t("tutorial.guide2Body1")}
      <br />
      <br />
      <div className={classes.centered}>
        <Button className={classes.connectButton} variant="outlined">
          <img
            alt="logo"
            className={classes.topbarLogo}
            src="/img/otros/meta.svg"
            style={{ marginRight: "5px", maxHeight: "24px" }}
          />
          {t("dashboard.menu.connect")}
        </Button>
      </div>
      <br />
      {t("tutorial.guide2Body2")}
      <br />
      <div className={classes.centered}>
        <br />
        <ProposalsContainer list={dataProposal} />
      </div>
      {t("tutorial.guide2Body3")}
      <br />
      <div className={classes.centered}>
        <IconButton color="primary" aria-label="faceIcon">
          <FaceIcon style={{ fontSize: 35 }} />
        </IconButton>
      </div>
      {t("tutorial.guide2Body4")}
      <br />
      <div className={classes.centered}>
        <IconButton color="primary" aria-label="lockIcon">
          <LockIcon style={{ fontSize: 35 }} />
        </IconButton>
      </div>
      {t("tutorial.guide2Body5")}
      <br />
      <br />
      {t("tutorial.guide2Body6")}
      <br />
      <Grid item xs={12}>
        <div className={classes.centered}>
          <Button
            style={{
              backgroundImage:
                "linear-gradient(90deg ,var(--theme-ui-colors-primary,#007cff) 0%,var(--theme-ui-colors-secondary,#00b7ff) 100%)",
              color: "white",
              borderRadius: "300px",
              fontSize: "15.6699px",
              padding: "8px 16px",
              border: "0px",
              width: "212px",
              height: "43px",
              margin: "16px 0px 0px",
              textTransform: "none",
            }}
          >
            Gasless Vouch
          </Button>
          <br />
          <Button
            style={{
              backgroundImage:
                "linear-gradient(90deg ,var(--theme-ui-colors-primary,#ff9900) 0%,var(--theme-ui-colors-secondary,#ffc700) 100%)",
              color: "white",
              borderRadius: "300px",
              fontSize: "15.6699px",
              padding: "8px 16px",
              border: "0px",
              width: "212px",
              height: "43px",
              margin: "16px 0px 0px",
              textTransform: "none",
            }}
          >
            Vouch
          </Button>
        </div>
      </Grid>
      <br />
      {t("tutorial.guide2Body7")}
      <br />
      <br />
      {t("tutorial.guide2Body8")}
      <div className={classes.centered}>
        <IconButton color="primary" aria-label="attachMoneyIcon">
          <AttachMoney style={{ fontSize: 35 }} />
        </IconButton>
        <br />
      </div>
      {t("tutorial.guide2Body9")}
    </>
  );
}
