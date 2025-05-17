import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { createApp } from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import Home from './Home';

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle"

var url = new URL(window.location);
var shop = url.searchParams.get("shop");

const App = () => {
  const [app, setApp] = useState(null);

  useEffect(() => {
    const app = createApp({
      apiKey: '0919e493b26d0b3e6f005cecc1669c1a',
      shopOrigin: shop,
      host: new URLSearchParams(location.search).get("host")
    });
    setApp(app);
  }, []);

  if (!app) {
    return null;
  }
  
  // Check if app is running inside an iframe
  if (window.top === window.self) {
    // Redirect to the Shopify admin to authenticate the app
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.APP, '/auth');
  } else {
    // App is running inside an iframe, display the app UI
    // ...
  }

  return (
    <AppProvider i18n={enTranslations}>
        <Home />  
</AppProvider>
   );
};

ReactDOM.render(<App />, document.getElementById('root'));