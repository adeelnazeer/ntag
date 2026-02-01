import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/global.scss";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "./i18n.js"; // ✅ just import it once

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

if (!recaptchaSiteKey) {
  console.warn("VITE_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not load. Add it to .env and restart the dev server.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <GoogleReCaptchaProvider
          reCaptchaKey={recaptchaSiteKey}
          scriptProps={{ async: true, defer: true }}
          useRecaptchaNet={true}
        >
          <App />
        </GoogleReCaptchaProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
