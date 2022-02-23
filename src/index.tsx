import ReactDOM from "react-dom";
import App from "./pages/App";
import { register } from "./registerServiceWorker";

import "./i18n";

ReactDOM.render(<App />, document.getElementById("root"));

// service worker
register({
  onError: (e) => console.error("show error state", e),
  onUpdateFound: (r) => console.log("show loading state", r),
  onUpdate: (r) => {
    const sw = r.waiting;
    if (sw) {
      sw.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
  onSuccess: (r) => console.log("onSuccess", r),
});
