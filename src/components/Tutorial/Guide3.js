import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import UpdateIcon from "@material-ui/icons/Update";
import TextField from "@material-ui/core/TextField";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

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

export default function Guide3() {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      {t("tutorial.guide3Body1")}
      <br />
      <div className={classes.centered}>
        <IconButton color="primary" aria-label="UpdateIcon">
          <UpdateIcon style={{ fontSize: 35 }} />
        </IconButton>
      </div>
      {t("tutorial.guide3Body2")}
      <form className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="newAmountTutorial"
              label={t("dashboard.proposal.newAmount", {
                value: 0.01,
              })}
              name="newAmountTutorial"
              autoComplete="newAmountTutorial"
              autoFocus
              value={0.01}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              id="previousDepositTutorial"
              name="previousDepositTutorial"
              label={t("dashboard.proposal.previousDeposit")}
              value={0.015}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              id="previousBurnFeeTutorial"
              name="previousBurnFeeTutorial"
              label={t("dashboard.proposal.previousBurnFee")}
              value={0.004}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              id="previousMaintainerFeeTutorial"
              name="previousMaintainerFeeTutorial"
              label={t("dashboard.proposal.previousMaintainerFee")}
              value={0.001}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="addedTime"
              label={t("dashboard.proposal.addedTime", {
                value: 5,
              })}
              name="addedTimeTutorial"
              autoComplete="addedTimeTutorial"
              value={5}
            />
          </Grid>
        </Grid>
      </form>
      <br />
      {t("tutorial.guide3Body3")}
    </>
  );
}
