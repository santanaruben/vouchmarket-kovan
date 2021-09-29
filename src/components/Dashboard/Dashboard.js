/* eslint-disable no-dupe-keys */
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Tutorial from "../Tutorial";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp,
  Dashboard as DashboardIcon,
  BarChart,
} from "@material-ui/icons";
import SwitchLanguage from "../../helpers/SwitchLanguage";
import withStyles from "@material-ui/core/styles/withStyles";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../ConfirmationDialog";
import { VM, toChecksum } from "../../vm";
import { useSelector, useDispatch } from "react-redux";
import { setChain } from "../../app/features/chainSlice";
import { account, setAccount } from "../../app/features/accountSlice";
// import { toast } from "react-toastify";
import i18next from "i18next";
import moment from "moment";
moment.locale("es-us");
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

const drawerWidth = 210;

const styles = (theme) => ({
  raiz: {
    width: "fill-available",
  },
  root: {
    display: "flex",
  },
  appBar: {
    background: "white",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  // buttonHelp: {
  //   borderRadius: "50px",
  //   // padding: 0,
  //   minWidth: "unset",
  // },
  buttonFlag: {
    borderRadius: 0,
    padding: 0,
    minWidth: "unset",
    marginLeft: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listItem: {
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(1),
    },
  },
  avatar: {
    flexShrink: 0,
    flexGrow: 0,
    transition: "0.3s",
  },
  uiprogress: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "45%",
    top: "35%",
  },
  topbarLogo: {
    height: "30px",
    verticalAlign: "middle",
  },
  toolbarTitle: {
    flexGrow: 1,
    margin: theme.spacing(0, 2),
  },
  connectButton: {
    marginLeft: theme.spacing(2),
    width: "130px",
  },
  unsetText: {
    textTransform: "none",
  },
});

function Dashboard(props) {
  const dispatch = useDispatch();
  const thisAccount = useSelector(account);
  const { classes } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tooltips, setTooltips] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    moment.locale(i18next.language);
  }, []);

  useEffect(() => {
    if (!thisAccount) return;
    changeProfilePicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisAccount]);

  const openDialog = () => {
    setIsOpen(true);
    setContent(t("dialog.wantLogout"));
  };

  const handleModalClose = async (willProceed) => {
    try {
      setIsOpen(false);
      if (willProceed) {
        VM.account = null;
        // setAccount();
        dispatch(setAccount());
        navigate("/");
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const [open, setOpen] = useState(false);
  const [avatarSize, setSize] = useState({
    height: 50,
    width: 50,
  });
  const [displayName, setDisplayName] = useState({
    display: "none",
  });

  const handleDrawerOpen = () => {
    setOpen(true);
    setSize({ height: 100, width: 100 });
    setDisplayName({ display: true, paddingBottom: 0, marginBottom: 0 });
    setTooltips(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setSize({ height: 50, width: 50 });
    setDisplayName({ display: "none" });
    setTooltips(true);
  };

  useEffect(() => {
    VM.initWeb3().then(() => {
      if (VM.web3) {
        dispatch(setChain(VM.web3.currentProvider.networkVersion));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      async function listenMMAccount() {
        window.ethereum.on("accountsChanged", async function (accounts) {
          dispatch(setAccount(toChecksum(accounts[0])));
        });
      }
      listenMMAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    VM.initWeb3().then(() => {
      if (VM.web3) {
        VM.actualAccount().then(() => {
          dispatch(setAccount(VM.account));
          // changeProfilePicture();
        });
      }
    });
  };

  const [profilePicture, setProfilePicture] = useState();

  const changeProfilePicture = async () => {
    let profile = await axios
      .get("https://api.poh.dev/profiles/" + thisAccount)
      .catch((err) => {
        console.log(err);
        // notify(t("messages.SUBGRAPHERROR"), 30000);
        setProfilePicture(null);
      });
    if (profile) {
      if (profile.data) setProfilePicture(profile.data.photo);
    } else {
      setProfilePicture(null);
    }
  };

  // const changeProfilePicture = async () => {
  //   const graphURL =
  //     "https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet";
  //   const graphQuery =
  //     '{submission(id: "0x5700f03f87db485fdb90e18b3100f00b235886f1") {requests(orderBy: creationTime orderDirection: desc first: 1) {evidence(orderBy: creationTime, first: 1) {URI}}}}';
  //   const ipfs_kleros = "https://ipfs.kleros.io";

  //   let graphData = await axios
  //     .post(graphURL, { query: graphQuery })
  //     .catch((err) => {
  //       console.log(err);
  //       notify(t("messages.SUBGRAPHERROR"), 30000);
  //     });
  //   if (graphData) {
  //     let submission = await axios.get(
  //       ipfs_kleros + graphData.data.data.submission.requests[0].evidence[0].URI
  //     );
  //     let registrantFile = await axios.get(
  //       ipfs_kleros + submission.data.fileURI
  //     );
  //     let picture = ipfs_kleros.concat(registrantFile.data.photo);
  //     setProfilePicture(picture);
  //   } else {
  //     setProfilePicture();
  //   }
  // };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Grid item>
            <img
              alt="logo"
              className={classes.topbarLogo}
              src="/img/logo/logo.png"
            />
          </Grid>
          <span className={classes.toolbarTitle}></span>
          <Tutorial />
          <Button variant="text" className={classes.buttonFlag}>
            <SwitchLanguage />
          </Button>
          <Grid>
            {thisAccount !== null && thisAccount !== undefined ? (
              <Tooltip title={thisAccount} placement="bottom">
                <Button
                  className={clsx(classes.connectButton, classes.unsetText)}
                  variant="outlined"
                >
                  {/* 🟢 {thisAccount.substring(0, 5)}... */}
                  💧 {thisAccount.substring(0, 5)}...
                  {thisAccount.substring(thisAccount.length - 2)}
                </Button>
              </Tooltip>
            ) : (
              <Button
                className={classes.connectButton}
                variant="outlined"
                onClick={() => connect()}
              >
                <img
                  alt="logo"
                  className={classes.topbarLogo}
                  src="/img/otros/meta.svg"
                  style={{ marginRight: "5px", maxHeight: "24px" }}
                />
                {t("dashboard.menu.connect")}
              </Button>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {thisAccount && (
          <>
            <center>
              <Tooltip
                title={t("dashboard.user.userProposals")}
                placement="right"
              >
                <IconButton
                  onClick={() => navigate("/user")}
                  style={{ margin: 0, padding: 0, marginTop: 20 }}
                >
                  <Avatar
                    src={profilePicture}
                    className={classes.avatar}
                    style={avatarSize}
                  />
                </IconButton>
              </Tooltip>
              <p style={displayName}> {""}</p>
            </center>
            <Divider
              style={{
                marginTop: 20,
              }}
            />
          </>
        )}

        <List>
          <Tooltip
            title={tooltips ? t("dashboard.menu.proposals") : ""}
            placement="right"
          >
            <ListItem button key="Proposals" onClick={() => navigate("/")}>
              <ListItemIcon className={classes.listItem}>
                {" "}
                <DashboardIcon />{" "}
              </ListItemIcon>
              <ListItemText primary={t("dashboard.menu.proposals")} />
            </ListItem>
          </Tooltip>

          <Tooltip
            title={tooltips ? t("dashboard.menu.data") : ""}
            placement="right"
          >
            <ListItem button key="Todo" onClick={() => navigate("/data")}>
              <ListItemIcon className={classes.listItem}>
                {" "}
                <BarChart />{" "}
              </ListItemIcon>
              <ListItemText primary={t("dashboard.menu.data")} />
            </ListItem>
          </Tooltip>

          {thisAccount && (
            <Tooltip
              title={tooltips ? t("dashboard.menu.logout") : ""}
              placement="right"
            >
              <ListItem button key="Logout" onClick={openDialog}>
                <ListItemIcon className={classes.listItem}>
                  {" "}
                  <ExitToApp />{" "}
                </ListItemIcon>
                <ListItemText primary={t("dashboard.menu.logout")} />
              </ListItem>
            </Tooltip>
          )}
        </List>
      </Drawer>
      <div
        className={classes.raiz}
        style={{
          width: "-moz-available",
        }}
      >
        <Outlet />
      </div>
      <ConfirmationDialog
        open={isOpen}
        onClose={handleModalClose}
        content={content}
      />
    </div>
  );
}

export default withStyles(styles)(Dashboard);
