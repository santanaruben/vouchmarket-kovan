import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
// import PoHLogo from "./PoHLogo.js";

function Spinner() {
  return (
    <Grid
      container
      spacing={0}
      justify="center"
      alignItems="center"
      style={{ minHeight: "100vh", display: "flex", maxWidth: "100%" }}
    >
      <Grid item xs={3} align="center">
        <Grid container justify="center" alignItems="center">
          <CircularProgress size={125} style={{ position: "absolute" }} />
          {/* <PoHLogo /> */}
          <img alt="logo" height="30px" src="/img/logo/logo.png" />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Spinner;
