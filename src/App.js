import React, { Suspense, lazy } from "react";
// import "@fontsource-roboto";
import MyErrorBoundary from "./components/Errors/MyErrorBoundary";
import {
  BrowserRouter as Router,
  // Redirect,
  Route,
  Routes,
} from "react-router-dom";
import Spinner from "./helpers/Spinner";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./themes/theme";

const NotFound = lazy(() => import("./components/Errors/NotFound"));
const Dashboard = lazy(() => import("./components/Dashboard"));
// const Data = lazy(() => import("./components/Data"));
const Proposals = lazy(() => import("./components/Proposals"));
const User = lazy(() => import("./components/UserProposals"));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Spinner />}>
        <Router>
          <MyErrorBoundary>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/" element={<Dashboard />}>
                  <Route path="/user" element={<User />} />
                  <Route path="/" element={<Proposals />} />
                  {/* <Route path="/data" element={<Data />} /> */}
                  <Route path="*" element={<NotFound />} />
                </Route>
                {/* <Route element={() => <Redirect to="/" />} /> */}
              </Routes>
            </Suspense>
          </MyErrorBoundary>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
