import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
// 引入 pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 引入 swiper
import "swiper/scss";
import "swiper/scss/pagination";

// 引入 dayjs 设置中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.mount("#app");

// PWA
navigator.serviceWorker.addEventListener("controllerchange", () => {
	// 弹出更新提醒
	console.log("站点已更新，刷新后生效");
	ElMessage({
		message: "站点已更新，刷新后生效",
		appendTo: "#main",
		customClass: "message-toast",
	});
});
