import { Provider } from 'react-redux';
import './App.css';
import RootRoute from './routing/routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { Store } from './store/store';
import { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(Store)
function App() {

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
      <Router>
       <RootRoute />
      </Router>
      </PersistGate>
      </Provider>
  )
}

export default App;