import React, { useRef, useState } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTranslation } from "react-i18next";
import Guide1 from "./Guide1";
import Guide2 from "./Guide2";
import Guide3 from "./Guide3";
import Guide4 from "./Guide4";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    buttonHelp: {
      borderRadius: "4px",
      // padding: 0,
      minWidth: "unset",
    },

    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    details: {
      textAlign: "justify",
      whiteSpace: "pre-line",
    },
    link: {
      textDecoration: "none",
      color: "darkblue",
    },
  })
);

export default function Tutorial() {
  const theme = useTheme<Theme>();
  const classes = useStyles(theme);
  const [expanded, setExpanded] = useState<string | false>(false);
  const bodyDialog = useRef<null | HTMLDivElement>(null);

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      bodyDialog.current!.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      setExpanded(isExpanded ? panel : false);
    };

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const newProposal = async () => {
    setOpen(true);
  };

  return (
    <>
      <Tooltip title="FAQs" placement="bottom">
        <Button
          variant="outlined"
          // color="default"
          className={classes.buttonHelp}
          onClick={() => newProposal()}
        >
          ?
        </Button>
      </Tooltip>
      {/* <main className={classes.content}> */}
      <Dialog
        fullScreen={fullScreen}
        maxWidth="sm"
        open={open}
        TransitionComponent={Transition}
        onClose={() => setOpen(false)}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {t("tutorial.faq")}
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.content} id="bodyDialog" ref={bodyDialog}>
          <div className={classes.root}>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.info")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.infoTitle")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={classes.details}>
                  {t("tutorial.infoBody")}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.motivation")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.motivationTitle")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={classes.details}>
                  {t("tutorial.motivationBody")}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.rewards")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.rewardsTitle")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={classes.details}>
                  {t("tutorial.rewardsBody1")}
                  {"("}
                  <a
                    href="https://ubiburner.com"
                    className={classes.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ubiburner.com
                  </a>
                  {")."}
                  <br />
                  <br />
                  {t("tutorial.rewardsBody2")}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.guide1")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.guide1Title")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component={"span"} className={classes.details}>
                  <Guide1 />
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5bh-content"
                id="panel5bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.guide2")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.guide2Title")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component={"span"} className={classes.details}>
                  <Guide2 />
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel6"}
              onChange={handleChange("panel6")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel6bh-content"
                id="panel6bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.guide3")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.guide3Title")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component={"span"} className={classes.details}>
                  <Guide3 />
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel7"}
              onChange={handleChange("panel7")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel7bh-content"
                id="panel7bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.guide4")}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {t("tutorial.guide4Title")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component={"span"} className={classes.details}>
                  <Guide4 />
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel8"}
              onChange={handleChange("panel8")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel8bh-content"
                id="panel8bh-header"
              >
                <Typography className={classes.heading}>
                  {t("tutorial.about")}
                </Typography>
                <Typography className={classes.secondaryHeading}></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component={"span"} className={classes.details}>
                  {t("tutorial.aboutBody1")}
                  <a
                    href="https://proofofhumanity.id"
                    className={classes.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://proofofhumanity.id
                  </a>

                  <br />
                  <br />

                  <p style={{ textAlign: "center" }}>
                    <a
                      href={"https://github.com/santanaruben/vouchmarket"}
                      style={{ margin: "10px" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          "https://img.shields.io/badge/github-black?style=flat&logo=github"
                        }
                        alt="github"
                      />
                    </a>
                    <a
                      href={"https://t.me/vouchmarket"}
                      style={{ margin: "10px" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          "https://img.shields.io/badge/telegram-blue?style=flat&logo=telegram"
                        }
                        alt="telegram"
                      />
                    </a>
                    <a
                      href={"https://twitter.com/vouchmarket"}
                      style={{ margin: "10px" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          "https://img.shields.io/badge/twitter-lightblue?style=flat&logo=twitter"
                        }
                        alt="twitter"
                      />
                    </a>
                  </p>

                  <br />
                  <br />
                  <div style={{ textAlign: "center", fontSize: "smaller" }}>
                    {t("tutorial.aboutBody2")}
                    <a
                      href="https://ruben.to"
                      className={classes.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ruben Santana
                    </a>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </main>
      </Dialog>
      {/* </main> */}
    </>
  );
}
