import Tooltip from "@material-ui/core/Tooltip";
import delay from "delay";
import i18next from "i18next";
import React, { useState } from "react";
import { PuffLoader as Spinner } from "react-spinners";
import moment from "moment";
import "moment/locale/es-us";
import "moment/locale/en-ca";

export default function SwitchLanguage() {
  const [lang, setLang] = useState(i18next.language);

  async function changeLang() {
    if (lang === "es") {
      moment.locale("en-ca");
      await i18next.changeLanguage("en");
    } else {
      moment.locale("es-us");
      await i18next.changeLanguage("es");
    }
    setLang(i18next.language);
  }

  function toggleLang() {
    if (lang === "en") return "es";
    else return "en";
  }

  async function run() {
    await delay(1000);
    setLang(i18next.language);
  }

  if (!lang) {
    run();
    return <Spinner loading={true} size={50} />;
  }
  return (
    <Tooltip title={toggleLang().toUpperCase()} placement="bottom">
      <img
        height="20px"
        // title={toggleLang().toUpperCase()}
        src={`/img/flags/${toggleLang()}.png`}
        alt="Language Flag"
        onClick={() => changeLang()}
      />
    </Tooltip>
  );
}
