import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Switch from "@material-ui/core/Switch";
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

export default function Guide1() {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      {t("tutorial.guide1Body1")}
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
      {t("tutorial.guide1Body2")}
      <br />
      <div className={classes.centered}>
        <IconButton color="primary" aria-label="AddCircleIcon">
          <AddCircleIcon style={{ fontSize: 60 }} />
        </IconButton>
      </div>
      {t("tutorial.guide1Body3")}

      <form className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="amountTutorial"
              label={t("dashboard.proposal.amount", {
                value: 0.01,
              })}
              name="amountTutorial"
              autoComplete="amountTutorial"
              autoFocus
              value={0.01}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              id="depositTutorial"
              name="depositTutorial"
              label={t("dashboard.proposal.deposit")}
              value={0.0075}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              id="feeToBurnUBITutorial"
              name="feeToBurnUBITutorial"
              label={t("dashboard.proposal.feeToBurnUBI")}
              value={0.002}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              id="feeToMaintainerTutorial"
              name="feeToMaintainerTutorial"
              label={t("dashboard.proposal.feeToMaintainer")}
              value={0.0005}
              disabled
            />
          </Grid>
        </Grid>
      </form>
      <br />
      {t("tutorial.guide1Body4")}
      <br />
      <br />
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
      <br />
      {t("tutorial.guide1Body5")}
      <br />
      <Grid item xs={12}>
        <Switch
          checked={true}
          id="withVoucherTutorial"
          name="withVoucherTutorial"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          fullWidth
          id="voucherTutorial"
          label={t("dashboard.proposal.voucher")}
          name="voucherTutorial"
          value={"0xc1363ab3f2190e3859049db156288781f70e89cf"}
        />
      </Grid>
      <br />
      {t("tutorial.guide1Body6")}
    </>
  );
}
