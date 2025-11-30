<template>
  <!-- 社交链接 -->
  <div class="social">
    <div class="link">
      <a
        v-for="item in socialLinks"
        :key="item.name"
        :href="item.url"
        target="_blank"
        @mouseenter="socialTip = item.tip"
        @mouseleave="socialTip = '通过这里联系我吧'"
      >
        <Icon size="24" class="icon">
          <component :is="socialIcons[item.icon]" />
        </Icon>
      </a>
    </div>
    <span class="tip">{{ socialTip }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from "@vicons/utils";
import { Github, Twitter, MailBulk } from "@vicons/fa";

// 社交链接数据
const socialLinks = [
  {
    "name": "GitHub",
    "url": "https://github.com",
    "icon": "Github",
    "tip": "GitHub"
  },
  {
    "name": "Twitter",
    "url": "https://twitter.com",
    "icon": "Twitter",
    "tip": "Twitter"
  },
  {
    "name": "Email",
    "url": "mailto:example@example.com",
    "icon": "MailBulk",
    "tip": "Email"
  }
];

// 社交链接图标映射
const socialIcons = {
  Github,
  Twitter,
  MailBulk
};

// 社交链接提示
const socialTip = ref("通过这里联系我吧");
</script>

<style lang="scss" scoped>
.social {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 460px;
  width: 100%;
  height: 42px;
  background-color: transparent;
  border-radius: 6px;
  backdrop-filter: blur(0);
  animation: fade 0.5s;
  transition:
    background-color 0.3s,
    backdrop-filter 0.3s;
  @media (max-width: 840px) {
    max-width: 100%;
    justify-content: center;
    .link {
      justify-content: space-evenly !important;
      width: 90%;
    }
    .tip {
      display: none !important;
    }
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: inherit;
      .icon {
        margin: 0 12px;
        transition: transform 0.3s;
        fill: white;
        color: white;
        &:hover {
          transform: scale(1.1);
        }
        &:active {
          transform: scale(1);
        }
        :deep(.i-icon) {
          fill: white;
          color: white;
        }
      }
    }
  }
  .tip {
    display: none;
    margin-right: 12px;
    animation: fade 0.5s;
  }
  @media (min-width: 768px) {
    &:hover {
      background-color: #00000040;
      backdrop-filter: blur(5px);
      .tip {
        display: block;
      }
    }
  }
}
</style>
