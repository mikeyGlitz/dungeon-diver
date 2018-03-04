import { createStore } from 'redux';
import reducers from './reducers/reducers';

export default createStore(
  reducers,
  /* eslint-disable no-underscore-dangle */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  /* eslint-enable */
);
