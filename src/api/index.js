import axios from "axios";

// 创建axios实例
const apiClient = axios.create({
  timeout: 10000, // 请求超时时间
});

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await apiClient.get("https://v1.hitokoto.cn");
  return res.data;
};

/**
 * 高德地图API
 */

// 获取IP定位和adcode
export const getAdcode = async (key) => {
  const res = await apiClient.get('https://restapi.amap.com/v3/ip', {
    params: {
      key
    }
  });
  return res.data;
};

// 获取天气信息
export const getWeather = async (key, adcode) => {
  const res = await apiClient.get('https://restapi.amap.com/v3/weather/weatherInfo', {
    params: {
      key,
      city: adcode,
      extensions: 'base'
    }
  });
  return res.data;
};

