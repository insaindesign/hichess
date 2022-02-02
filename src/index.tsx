import ReactDOM from 'react-dom';
import App from './components/App';
import {register} from './registerServiceWorker';

import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// service worker
register();