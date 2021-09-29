import React, { useState } from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setFaceDialog } from "../../app/features/faceDialogSlice";
import { proposal } from "../../app/features/proposalSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: 0,
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  progress: {
    position: "absolute",
  },
}));

export interface DialogProps {
  open: boolean;
}

export default function CheckFace({ open }: DialogProps) {
  const dispatch = useDispatch();
  const thisProposal = useSelector(proposal);
  const theme = useTheme<Theme>();
  const classes = useStyles(theme);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [copied, setCopied] = useState(false);

  const copy = () => {
    setCopied(true);
    navigator.clipboard.writeText(thisProposal.user);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        maxWidth="md"
        open={open || false}
        TransitionComponent={Transition}
        onClose={() => {
          setCopied(false);
          dispatch(setFaceDialog(false));
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setCopied(false);
                dispatch(setFaceDialog(false));
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {t("dashboard.totem.checkFace")}
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.root}>
          <Grid container className={classes.content}>
            <Grid container justify="center" alignItems="center">
              {loading && (
                <CircularProgress size={30} style={{ position: "absolute" }} />
              )}
              <p style={{ overflowWrap: "break-word", maxWidth: "80vw" }}>
                {t("dashboard.totem.checkFaceAddress")}
                <br />
                <b>{thisProposal?.user}</b>{" "}
                <Button
                  color="primary"
                  aria-label="Copy"
                  onClick={() => copy()}
                >
                  <>
                    <FileCopyIcon style={{ fontSize: 15 }} />{" "}
                    {copied
                      ? t("dashboard.other.copied")
                      : t("dashboard.other.copy")}
                  </>
                </Button>
              </p>
              <iframe
                src={
                  "http://faces.humanity.tools/?address=" + thisProposal.user
                }
                title={"Visit http://faces.humanity.tools"}
                // id={proposal?.id || "undefined"}
                // name={proposal?.id || "undefined"}
                style={{
                  margin: "0px",
                  padding: "0px",
                  height: "60vh",
                  width: "100%",
                  border: "none",
                }}
                onLoad={() => setLoading(false)}
              ></iframe>
              <p style={{ margin: "0px", padding: "0px", fontSize: "small" }}>
                author <b>Isaac</b>{" "}
                <a href="http://faces.humanity.tools">Source</a>{" "}
                <a href="https://github.com/isaac-art/">Repo</a>
              </p>
            </Grid>
          </Grid>
        </main>
      </Dialog>
    </>
  );
}
