import React, { useState } from "react";
import Totem from "./Totem";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import FaceDialogComponent from "./FaceDialogComponent";
import UpdateDialogComponent from "./UpdateDialogComponent";
import moment from "moment";
import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // width: "88vw",
    // width: theme.mixins.toolbar.width,
    // width: `calc(95vw - ${theme.spacing(7) + 1}px)`,
    // [theme.breakpoints.up("sm")]: {
    //   width: `calc(95vw - ${theme.spacing(9) + 1}px)`,
    // },
    // paddingLeft: "inherit",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  paginator: {
    justifyContent: "center",
    padding: "10px",
    flexGrow: 1,
  },
}));

export default function ProposalsContainer(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [filteredList, setFilteredList] = useState(props.list);
  const [filterType, setFilterType] = useState(4);

  const changeFilter = async (_content) => {
    setFilterType(_content);
    let now = await moment().unix();
    let datos;
    // eslint-disable-next-line default-case
    switch (Number(_content)) {
      case 0:
        datos = props.list.filter(
          (item) => item.state === 1 && item.timeLimit - 86400 <= now
        );
        break;
      case 1:
        datos = props.list.filter(
          (item) => item.state === 1 && item.timeLimit - 86400 > now
        );
        break;
      case 2:
        datos = props.list.filter((item) => item.state === 2);
        break;
      case 3:
        datos = props.list.filter((item) => item.state === 3);
        break;
      case 4:
        datos = props.list;
        break;
      // default:
      //   datos = props.list.filter(
      //     (item) =>
      //       item.state === Number(_content) && item.timeLimit - 86400 >= now
      //   );
      //   break;
    }
    setFilteredList(datos);
    setNoOfPages(Math.ceil(datos.length / itemsPerPage));
    setPage(1);
  };

  const itemsPerPage = 12;
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(filteredList.length / itemsPerPage)
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Grid container className={classes.root}>
        <Tooltip title={t("dashboard.other.filter")} placement="top">
          <div
            value={filterType}
            onChange={(e) => changeFilter(e.target.value)}
          >
            <select id="filterType">
              <option value={4}>{t("dashboard.totem.all")}</option>
              <option value={1}>{t("dashboard.totem.open")}</option>
              <option value={2}>{t("dashboard.totem.locked")}</option>
              <option value={3}>{t("dashboard.totem.claimed")}</option>
              <option value={0}>{t("dashboard.totem.finished")}</option>
            </select>
          </div>
        </Tooltip>
      </Grid>
      <Box component="span">
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handleChange}
          defaultPage={1}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          classes={{ ul: classes.paginator }}
        />
      </Box>
      <Grid container className={classes.content}>
        {filteredList
          // .slice(0)
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          // .reverse()
          .map(function (row) {
            return <Totem row={row} key={row.id} />;
          })}
      </Grid>
      <div style={{ height: 0 }}>
        <FaceDialogComponent />
        <UpdateDialogComponent />
      </div>
      <Box component="span">
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handleChange}
          defaultPage={1}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          classes={{ ul: classes.paginator }}
        />
      </Box>
    </>
  );
}
