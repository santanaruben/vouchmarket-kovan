import "./i18n";
import "./scss/index.scss";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./app/store";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);
reportWebVitals();

// import ProposalsContainer from "./components/Proposals/ProposalsContainer";
// ReactDOM.render(<ProposalsContainer />, document.getElementById("root"));
