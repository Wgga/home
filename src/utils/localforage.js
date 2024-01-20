import localforage from 'localforage';
import dayjs from 'dayjs';

export const setItemWithExpiration = (key, value, expirationTime, type) => {
    const item = {
        value: value,
        expirationTime: dayjs().add(expirationTime, type).unix() // 过期时间为当前时间加上指定的过期时间
    };
    localforage.setItem(key, item);
}

export const getItemWithExpiration = (key) => {
    return new Promise((resolve, reject) => {
        localforage.getItem(key).then(item => {
            if (item && dayjs().unix() < item.expirationTime) {
                resolve(item.value);
            } else {
                resolve(null); // 返回空值
                localforage.removeItem(key); // 数据已过期，移除数据
            }
        }).catch(err => {
            reject(err);
        });
    });
}