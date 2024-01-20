<template>
    <!-- <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
        <span>{{ weatherData.adCode.city }}&nbsp;</span>
        <span>{{ weatherData.weather.weather }}&nbsp;</span>
        <span>{{ weatherData.weather.temperature }}℃</span>
        <span class="sm-hidden">
            &nbsp;{{
                weatherData.weather.winddirection?.endsWith("风")
                ? weatherData.weather.winddirection
                : weatherData.weather.winddirection + "风"
            }}&nbsp;
        </span>
        <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
    </div> -->
    <div class="weather" v-if="weatherData.adCode && weatherData.nowweather && weatherData.sevenDWeather">
        <div class="weather_top">
            <div class="top_left">
                <span class="weather_city" v-if="weatherData.adCode.city">{{ weatherData.adCode.city }}&nbsp;</span>
                <span class="weather_temp" v-if="weatherData.nowweather.temp">{{ weatherData.nowweather.temp }}<em>℃</em></span>
            </div>
            <div class="top_right">
                <span class="weather_text">{{ weatherData.nowweather.text }}</span>
                <i class="weather_icon" :class="'qi-' + weatherData.nowweather.icon"></i>
            </div>
        </div>
        <div class="weather_bottom">
            <div class="sevenD_weather" v-for="x in weatherData.sevenDWeather" :key="x.fxDate">
                <span class="weather_text">{{ x.fxDate }}</span>
                <i class="sevenD_weather_icon" :class="'qi-' + x.iconDay"></i>
                <span class="sevenD_temp_con">
                    <span class="maxtemp">{{ x.tempMin }}</span>~<span class="mintemp">{{ x.tempMax }}</span>
                </span>
            </div>
        </div>
    </div>
    <div class="weather" v-else>
        <span>天气数据获取失败</span>
    </div>
</template>

<script setup>
import { getAdcode, getWeather, getOtherWeather, getnowWeather, getCity, getsevenDWeather } from "@/api";
import { mainStore } from "@/store";
import { storeToRefs } from "pinia";
import { Error } from "@icon-park/vue-next";
import { getFormatTimes } from "@/utils/getTime.js";
import { setItemWithExpiration, getItemWithExpiration } from "@/utils/localforage.js";
const store = mainStore();
const {
    weatherType
} = storeToRefs(store);

// 高德开发者 Key / 和风天气开发者 Key
const mainKey = import.meta.env.VITE_WEATHER_KEY;
const QmainKey = import.meta.env.VITE_QWEATHER_KEY;

// 天气数据
const weatherData = reactive({
    adCode: {
        city: null, // 城市
        adcode: null, // 城市编码
    },
    cityInfo: {
        location: null, // 地理位置信息
        id: null // 城市ID
    },
    weather: {
        weather: null, // 天气现象
        temperature: null, // 实时气温
        winddirection: null, // 风向描述
        windpower: null, // 风力级别
    },
    nowweather: {
        obsTime: null, // 数据观测时间
        temp: null,  // 温度
        feelsLike: null, // 体感温度
        icon: null, // 天气图标
        text: null,  // 天气描述
        wind360: null, // 风向360角度
        windDir: null, // 风向描述
        windScale: null,  // 风力级别
        windSpeed: null, // 风速
        humidity: null,  // 湿度
        precip: null,  // 小时累计降水量
        pressure: null, // 大气压强
        vis: null,  // 能见度
        cloud: null, // 天气云量
        dew: null // 露点温度
    },
    sevenDWeather: [],
});

// 获取天气数据
const getWeatherData = async () => {
    // 获取天气缓存数据
    const weatherCacheData = await getItemWithExpiration("weatherData");
    if (weatherCacheData) {
        weatherData.adCode = JSON.parse(weatherCacheData).adCode;
        weatherData.weather = JSON.parse(weatherCacheData).weather;
        weatherData.cityInfo = JSON.parse(weatherCacheData).cityInfo;
        weatherData.nowweather = JSON.parse(weatherCacheData).nowweather;
        weatherData.sevenDWeather = JSON.parse(weatherCacheData).sevenDWeather;
        return;
    }
    try {
        // 获取地理位置信息
        if (!mainKey) {
            // console.log("未配置，使用备用天气接口");
            const result = await getOtherWeather();
            // console.log(result);
            const data = result.result;
            weatherData.adCode = {
                city: data.city.city_name || "未知地区",
                // adcode: data.city.cityId,
            };
            weatherData.weather = {
                weather: data.condition.condition,
                temperature: data.condition.temp,
                winddirection: data.condition.windDir,
                windpower: data.condition.windLevel,
            };
        } else {
            // 获取高德城市Adcode
            const adCode = await getAdcode(mainKey);
            // console.log(adCode);
            if (adCode.infocode !== "10000") {
                throw "地区查询失败";
            }
            // 获取高德天气信息
            /* const weather = await getWeather(mainKey, weatherData.adCode.adcode);
            weatherData.weather = {
                weather: result.lives[0].weather,
                temperature: result.lives[0].temperature,
                winddirection: result.lives[0].winddirection,
                windpower: result.lives[0].windpower,
            }; */
            weatherData.adCode = {
                city: adCode.city,
                prov: adCode.province,
                adcode: adCode.adcode,
            };

            // 获取和风城市信息
            const cityInfo = await getCity(QmainKey, weatherData.adCode.city, weatherData.adCode.prov);
            if (cityInfo.code == '200') {
                weatherData.cityInfo = {
                    location: cityInfo.location,
                    id: cityInfo.location[0].id,
                }
            }

            // 获取和风城市实时天气信息
            const nowWeather = await getnowWeather(QmainKey, weatherData.cityInfo.id);
            if (nowWeather.code == '200') {
                weatherData.nowweather = nowWeather.now;
            }

            // 获取和风城市7天天气信息
            const sevenDresult = await getsevenDWeather(QmainKey, weatherData.cityInfo.id);
            if (sevenDresult.code == '200') {
                weatherData.sevenDWeather = getFormatTimes(sevenDresult.daily).slice(0, 6);
            }

            // 设置缓存数据
            setItemWithExpiration("weatherData", JSON.stringify(weatherData), 1, "day");
        }
    } catch (error) {
        console.error("天气信息获取失败:" + error);
        onError("天气信息获取失败");
    }
};

// 报错信息
const onError = (message) => {
    ElMessage({
        message,
        appendTo: "#main",
        customClass: "message-toast",
        icon: h(Error, {
            theme: "filled",
            fill: "#efefef",
        }),
    });
    console.error(message);
};

onMounted(() => {
    // 调用获取天气
    getWeatherData();
});

</script>

<style lang="scss" scoped>
.weather {
    padding: 15px 15px;
    text-align: center;
    width: 100%;
    height: 100%;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
    animation: fade 0.5s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .weather_top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .top_left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 5px;
        }

        .weather_city {
            font-size: 13px;
        }

        .weather_temp {
            display: flex;
            align-items: flex-start;
            font-size: 25px;
            font-weight: 500;
            margin-top: 5px;

            em {
                font-style: normal;
                font-size: 15px;
                margin-left: 2px;
                margin-top: 3px;
            }
        }

        .top_right {
            display: flex;
            align-items: center;
            margin-top: 5px;
            margin-right: 5px;

            .weather_icon {
                font-size: 20px;
                margin-left: 5px;
            }
        }
    }

    .weather_text {
        font-size: 13px;
    }

    .weather_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;

        .sevenD_weather {
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 950px) {
            .sevenD_weather:nth-child(6) {
                display: none;
            }
        }

        .sevenD_temp_con {
            font-size: 13px;
        }
    }
}
</style>