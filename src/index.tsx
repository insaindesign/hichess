import ReactDOM from 'react-dom';
import App from './components/App';
import {register} from './registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// service worker
register();