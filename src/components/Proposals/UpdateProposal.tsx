import React, { useState } from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import Switch from "@material-ui/core/Switch";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import { VM, isAddress, updateProposal, checkChainId } from "../../vm";
import { proposal } from "../../app/features/proposalSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUpdateDialog } from "../../app/features/updateDialogSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progress: {
    position: "absolute",
  },
}));

export interface DialogProps {
  open: boolean;
}

export default function UpdateProposal({ open }: DialogProps) {
  const thisProposal = useSelector(proposal);
  const dispatch = useDispatch();
  const theme = useTheme<Theme>();
  const classes = useStyles(theme);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [useVoucher, setUseVoucher] = useState(false);

  const handleChangeVoucher = () => {
    formik.setFieldValue("withVoucher", !useVoucher);
    setUseVoucher(!useVoucher);
  };

  const resetValues = () => {
    formik.values.amount = "";
    formik.values.addedTime = "";
    formik.values.voucher = "";
    setUseVoucher(false);
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      addedTime: "",
      withVoucher: false,
      voucher: "",
    },
    validationSchema: yup.object({
      amount: yup
        .number()
        .typeError(t("dashboard.proposal.numberValid"))
        .min(
          Number(VM.minDeposit),
          t("dashboard.proposal.amountValid", { value: VM.minDeposit })
        )
        .required(t("dashboard.proposal.amountRequired")),
      addedTime: yup
        .number()
        .typeError(t("dashboard.proposal.numberValid"))
        .min(
          Number(VM.minTimeLimit),
          t("dashboard.proposal.addedTimeValid", { value: VM.minTimeLimit })
        )
        .required(t("dashboard.proposal.addedTimeRequired")),
      withVoucher: yup.boolean(),
      voucher: yup.string().when("withVoucher", {
        is: true,
        then: yup
          .string()
          .required(t("dashboard.proposal.addressRequired"))
          .test(
            "eth-address-validation",
            t("dashboard.proposal.addressValid"),
            (value) => isAddress(value)
          ),
        otherwise: yup.string(),
      }),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const go = await checkChainId();
      if (go) {
        let { amount, addedTime, withVoucher, voucher } = values;
        voucher = withVoucher ? voucher : "";
        await updateProposal(amount, thisProposal.id, addedTime, voucher)
          .then((obj) => {
            console.log(obj);
            if (obj) {
              resetValues();
              dispatch(setUpdateDialog(false));
            }
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
    },
  });

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        maxWidth="sm"
        open={open || false}
        TransitionComponent={Transition}
        onClose={() => dispatch(setUpdateDialog(false))}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => dispatch(setUpdateDialog(false))}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {t("dashboard.totem.updateProposal")}
            </Typography>
          </Toolbar>
        </AppBar>

        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="amount"
                label={t("dashboard.proposal.newAmount", {
                  value: VM.minDeposit,
                })}
                name="amount"
                autoComplete="amount"
                autoFocus
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="deposit"
                name="deposit"
                label={t("dashboard.proposal.previousDeposit")}
                value={String(
                  Number(thisProposal.amount) +
                    (Number(formik.values.amount) -
                      Number(formik.values.amount) / Number(VM.feeDivisor))
                )}
                disabled
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="feeToBurnUBI"
                name="feeToBurnUBI"
                label={t("dashboard.proposal.previousBurnFee")}
                value={String(
                  (Number(thisProposal.fee) / 5) * 4 +
                    (Number(formik.values.amount) / Number(VM.feeDivisor) / 5) *
                      4
                )}
                disabled
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="previousMaintainerFee"
                name="previousMaintainerFee"
                label={t("dashboard.proposal.previousMaintainerFee")}
                value={String(
                  Number(thisProposal.fee) / 5 +
                    Number(formik.values.amount) / Number(VM.feeDivisor) / 5
                )}
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
                  value: VM.minTimeLimit,
                })}
                name="addedTime"
                autoComplete="addedTime"
                value={formik.values.addedTime}
                onChange={formik.handleChange}
                error={
                  formik.touched.addedTime && Boolean(formik.errors.addedTime)
                }
                helperText={formik.touched.addedTime && formik.errors.addedTime}
              />
            </Grid>

            <Grid item xs={12}>
              {t("dashboard.proposal.withVoucher")}{" "}
              <Switch
                checked={useVoucher}
                onChange={handleChangeVoucher}
                id="withVoucher"
                name="withVoucher"
                value={useVoucher}
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </Grid>

            {useVoucher && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="voucher"
                  label={t("dashboard.proposal.voucher")}
                  name="voucher"
                  autoComplete="voucher"
                  value={formik.values.voucher}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.voucher && Boolean(formik.errors.voucher)
                  }
                  helperText={formik.touched.voucher && formik.errors.voucher}
                />
              </Grid>
            )}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={
              loading ||
              !formik.values.amount ||
              !formik.values.addedTime ||
              (formik.touched.amount && Boolean(formik.errors.amount)) ||
              (formik.touched.addedTime && Boolean(formik.errors.addedTime)) ||
              (useVoucher && Boolean(formik.errors.voucher))
            }
          >
            {t("auth.submit")}
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
