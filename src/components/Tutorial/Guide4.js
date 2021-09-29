import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: "center",
  },
}));

export default function Guide4() {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      {t("tutorial.guide4Body1")}
      <br />
      <div className={classes.centered}>
        <IconButton color="primary" aria-label="DeleteIcon">
          <Delete style={{ fontSize: 35 }} />
        </IconButton>
      </div>
      {t("tutorial.guide4Body2")}
    </>
  );
}
