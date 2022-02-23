import ReactDOM from "react-dom";
import App from "./pages/App";
import { register } from "./registerServiceWorker";

import "./i18n";

ReactDOM.render(<App />, document.getElementById("root"));

// service worker
register({
  onError: (e) => console.error("show error state", e),
  onUpdateFound: (r) => console.log("show loading state"),
  onUpdate: (r) => {
    console.log("onUpdate show choice to upgrade");
    const sw = r.waiting;
    if (sw) {
      console.log("skiped");
      // r.waiting?.postMessage({ type: "SKIP_WAITING" });
      // window.location.reload();
    }
  },
  onSuccess: (r) => console.log("onSuccess", r),
});
