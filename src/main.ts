import "./styles.css";

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  options: {
    // Tells PrimeVue to inject after Tailwind v4's base reset layer
    cssLayer: {
      name: "primevue",
      order: "theme, base, primevue",
    },
  },
});
app.mount("#app");
