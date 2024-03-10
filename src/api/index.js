// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
    const res = await fetch(
        `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
    );
    const data = await res.json();

    if (data[0].url.startsWith("@")) {
        // eslint-disable-next-line no-unused-vars
        const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
        const jsonpData = await fetchJsonp(url).then((res) => res.json());
        const domain = (
            jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
            jsonpData.req_0.data.sip[0]
        ).replace("http://", "https://");

        return data.map((v, i) => ({
            name: v.name || v.title,
            artist: v.artist || v.author,
            url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
            cover: v.cover || v.pic,
            lrc: v.lrc,
        }));
    } else {
        return data.map((v) => ({
            name: v.name || v.title,
            artist: v.artist || v.author,
            url: v.url,
            cover: v.cover || v.pic,
            lrc: v.lrc,
        }));
    }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
    // const res = await fetch("https://v1.hitokoto.cn");
    const res = await fetch("https://hitokoto.artisticcode.cn");
    return await res.json();
};

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
    let res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
    return await res.json();
};

// 获取高德城市信息
export const getCity = async (key, city, prov) => {
    let res = await fetch(
        `https://geoapi.qweather.com/v2/city/lookup?location=${city}&adm=${prov}&key=${key}`,
    );
    return await res.json();
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
    let res = await fetch(
        `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
    );
    return await res.json();
};

// 获取和风实时天气信息
export const getnowWeather = async (key, id) => {
    let res = await fetch(
        `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key}`,
    );
    return await res.json();
};

// 获取和风7天天气信息
export const getsevenDWeather = async (key, id) => {
    let res = await fetch(
        `https://devapi.qweather.com/v7/weather/7d?location=${id}&key=${key}`,
    );
    return await res.json();
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
    const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
    return await res.json();
};
