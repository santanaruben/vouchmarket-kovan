import React from "react";
import {
  ThemeProvider,
  useTheme,
  createMuiTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  skeleton: {
    width: "200px",
    height: "200px",
    margin: "20px",
  },
  filter: {
    justifyContent: "center",
    // flexGrow: 1,
    width: "151.6px",
    height: "18.8px",
  },
  paginator: {
    justifyContent: "center",
    padding: "10px",
    flexGrow: 1,
  },
}));

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || "xs"
  );
}

function FilterSkeleton() {
  const classes = useStyles();
  return (
    <Grid container className={classes.content}>
      <Skeleton variant="rect" animation="wave" className={classes.filter} />
    </Grid>
  );
}

function PaginationSkeleton() {
  const classes = useStyles();
  return (
    <Box component="span">
      <Pagination
        count={1}
        page={1}
        defaultPage={1}
        color="standard"
        size="large"
        showFirstButton
        showLastButton
        classes={{ ul: classes.paginator }}
      />
    </Box>
  );
}

function TotemSkeleton() {
  const classes = useStyles();
  const width = useWidth();

  const SkeletonsCube = (times) => {
    return (
      <div className={classes.root}>
        <Grid container className={classes.content}>
          {[...Array(times)].map((e, i) => (
            <Skeleton
              variant="rect"
              animation="wave"
              className={classes.skeleton}
              key={i}
            />
          ))}
        </Grid>
      </div>
    );
  };

  switch (width) {
    case "sm":
      return SkeletonsCube(3);
    case "md":
      return SkeletonsCube(8);
    case "lg":
      return SkeletonsCube(10);
    case "xl":
      return SkeletonsCube(14);
    default:
      return SkeletonsCube(2);
  }
}

const theme = createMuiTheme();

export default function ProposalsSkeleton() {
  return (
    <ThemeProvider theme={theme}>
      <FilterSkeleton />
      <PaginationSkeleton />
      <TotemSkeleton />
      <PaginationSkeleton />
    </ThemeProvider>
  );
}
