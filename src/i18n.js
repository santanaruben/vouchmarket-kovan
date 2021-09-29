import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// import moment from "moment";
// import "moment/locale/es-us";
// import "moment/locale/en-ca";

const fallbackLng = ["en"];
const availableLanguages = ["en", "es"];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // react: {
    //   useSuspense: false,
    // },
    fallbackLng,
    detection: {
      checkWhitelist: true,
    },
    debug: false,
    whitelist: availableLanguages,
    interpolation: {
      escapeValue: false, // no need for react. it escapes by default
    },
  });
// .then(() => {
//   moment.locale(i18n.language);
// });

// if (i18n.language === "es") {
//   moment.locale("es-us");
// }
// else {
//   moment.locale("en-ca");
// }

export default i18n;
