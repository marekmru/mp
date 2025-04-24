import './style.css'

import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia';
import vuetify from './plugins/vuetify';
import router from './router'

const pinia = createPinia();
const app = createApp(App);

app.config.warnHandler = (msg, vm, trace) => {
    if (msg.includes('Slot "default" invoked outside of the render function')) {
        // swallow this specific warning
        return
    }
    // let all other warnings through
    console.warn(`[Vue warn]: ${msg}${trace}`)
}
app.use(pinia);
app.use(vuetify);
app.use(router);
app.mount('#app');