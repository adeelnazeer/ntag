import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/global.scss";
import { HashRouter, BrowserRouter } from "react-router-dom";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "./i18n.js";

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

if (!recaptchaSiteKey) {
  console.warn("VITE_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not load. Add it to .env and restart the dev server.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* // use hash router for when we need to convert to mini app */}
          <BrowserRouter>
        {recaptchaSiteKey ? (
          <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaSiteKey}
            scriptProps={{ async: true, defer: true }}
            useRecaptchaNet={true}
          >
            <App />
          </GoogleReCaptchaProvider>
        ) : (
          <App />
        )}
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
