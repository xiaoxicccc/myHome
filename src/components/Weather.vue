<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
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
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { reactive, onMounted, h } from 'vue';
import { ElMessage } from 'element-plus';
import { getAdcode, getWeather } from "@/api";
import { Error } from "@icon-park/vue-next";

// 高德开发者 Key
const mainKey = import.meta.env.VITE_WEATHER_KEY;

// 天气数据
const weatherData = reactive({
  adCode: {
    city: null, // 城市
    adcode: null, // 城市编码
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 取出天气平均值
const getTemperature = (min, max) => {
  try {
    // 计算平均值并四舍五入
    const average = (Number(min) + Number(max)) / 2;
    return Math.round(average);
  } catch (error) {
    console.error("计算温度出现错误：", error);
    return "NaN";
  }
};

// 获取天气数据
const getWeatherData = async () => {
  // 先检查本地是否有有效的缓存数据
  const cachedWeatherData = localStorage.getItem('weatherData');
  const cachedTimestamp = localStorage.getItem('weatherDataTimestamp');
  const now = Date.now();
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  
  // 如果有缓存数据，且缓存时间在12小时内，则使用缓存数据
  if (cachedWeatherData && cachedTimestamp) {
    const cacheTime = parseInt(cachedTimestamp);
    if (now - cacheTime < TWELVE_HOURS) {
      const parsedWeatherData = JSON.parse(cachedWeatherData);
      weatherData.adCode = parsedWeatherData.adCode;
      weatherData.weather = parsedWeatherData.weather;
      return;
    }
  }
  
  // 否则，调用接口获取天气数据
  try {
    // 获取地理位置信息
    // 获取 Adcode
    const adCode = await getAdcode(mainKey);
    console.log(adCode);
    if (adCode.infocode !== "10000") {
      throw "地区查询失败";
    }
    weatherData.adCode = {
      city: adCode.city,
      adcode: adCode.adcode,
    };
    // 获取天气信息
    const result = await getWeather(mainKey, weatherData.adCode.adcode);
    if (result.infocode !== "10000") {
      throw "天气查询失败";
    }
    weatherData.weather = {
      weather: result.lives[0].weather,
      temperature: result.lives[0].temperature,
      winddirection: result.lives[0].winddirection,
      windpower: result.lives[0].windpower,
    };
    
    // 将天气数据缓存到本地
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
    localStorage.setItem('weatherDataTimestamp', now.toString());
  } catch (error) {
    console.error("天气信息获取失败:" + error);
    onError("天气信息获取失败");
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
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
