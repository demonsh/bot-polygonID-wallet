import { createApp } from 'vue'
import { Quasar } from 'quasar'
import router from './router';
import { core } from "@0xpolygonid/js-sdk";
import './assets/styles/index.scss'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const app = createApp(App)
app.use(router);
app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
})
core.registerDidMethodNetwork({
    method: core.DidMethod.Iden3,
    blockchain: "linea",
    chainId: 59140,
    network: "testnet",
    networkFlag: 0b0100_0000 | 0b0000001,
});
// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app')
