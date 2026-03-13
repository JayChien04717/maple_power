<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { ref, onMounted, onUnmounted, provide, nextTick } from 'vue'
import NavThemeHandler from './NavThemeHandler.vue'
import Tech from './background/TechBackground.vue'
import Animated from './background/AnimatedBackground.vue'
import GamingRGB from './background/GamingRGB.vue'
import Slow3DFly from './background/Slow3DFly.vue'
import Halo from './background/CircularHaloBackgroud.vue'
import HyperOS from './background/HyperOSTheme.vue'
import HyperOS2 from './background/HyperOS2Theme.vue'
import Christmas from './background/ChristmasBackground.vue'
import Halloween from './background/HalloweenBackground.vue'
import GravityFieldSimulation from './background/GravityFieldSimulation.vue'
import { 
  defaultTheme, 
  THEME_STORAGE_KEY, 
  THEME_CHANGE_EVENT,
  getAllThemeIds
} from './background/themes'

const { isDark } = useData()

// 當前背景主題
const currentBackgroundTheme = ref(defaultTheme)

// ============================================
// 　　　　　　　深淺色模式切換邏輯
// ============================================

let isAnimating = false;

provide('toggle-appearance', async () => {
    if (typeof document === 'undefined' || isAnimating) {
        return
    }

    isAnimating = true;
    const isDarkNow = isDark.value;
    const direction = isDarkNow ? 'to-light' : 'to-dark';

    const canvasThemes = ['tech', 'animated', 'gaming', 'slow3dfly', 'gravityfield'];
    let overlayStyle = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100%; height: 100%;
        z-index: 0;
        pointer-events: none;
        transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    let useCanvasImage = false;
    if (canvasThemes.includes(currentBackgroundTheme.value)) {
        const canvas = document.querySelector('.ClientOnly canvas, canvas');
        if (canvas && canvas instanceof HTMLCanvasElement) {
            try {
                const dataUrl = canvas.toDataURL('image/png');
                overlayStyle += `background: url('${dataUrl}') center/cover no-repeat;`;
                useCanvasImage = true;
            } catch(e) {}
        }
    }
    if (!useCanvasImage) {
        const bodyStyle = window.getComputedStyle(document.body);
        const bgProps = [
            'background',
            'backgroundImage',
            'backgroundSize',
            'backgroundPosition',
            'backgroundRepeat',
            'backgroundColor'
        ];
        bgProps.forEach(prop => {
            const val = bodyStyle.getPropertyValue(prop);
            if (val) {
                overlayStyle += `${prop}: ${val};`;
            }
        });
    }

    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.setAttribute('data-direction', direction);
    overlay.style.cssText = overlayStyle;
    document.body.insertBefore(overlay, document.body.firstChild);

    isDark.value = !isDarkNow;
    await nextTick();

    requestAnimationFrame(() => {
        if (direction === 'to-light') {
            overlay.style.transform = 'translateY(-100%)';
        } else {
            overlay.style.transform = 'translateY(100%)';
        }
    });

    setTimeout(() => {
        overlay.remove();
        isAnimating = false;
    }, 1500);
});

// 監聽主題切換事件
const handleThemeChange = (event: Event) => {
  const customEvent = event as CustomEvent
  const newTheme = customEvent.detail.theme
  currentBackgroundTheme.value = newTheme
  updateBodyClass(newTheme)
}

const updateBodyClass = (theme: string) => {
  if (typeof document === 'undefined') return
    const allThemeIds = getAllThemeIds()
    const allThemeClasses = allThemeIds.map(id => `theme-${id}`)
    document.body.classList.remove(...allThemeClasses)
  if (theme && theme !== 'none') {
    document.body.classList.add(`theme-${theme}`)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme) {
      currentBackgroundTheme.value = savedTheme
      updateBodyClass(savedTheme)
    } else {
      updateBodyClass(defaultTheme)
    }
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
  }
})
</script>

<template>
    <ClientOnly>
        <Tech v-if="currentBackgroundTheme === 'tech'" />
        <Animated v-if="currentBackgroundTheme === 'animated'" />
        <GamingRGB v-if="currentBackgroundTheme === 'gaming'" />
        <Slow3DFly v-if="currentBackgroundTheme === 'slow3dfly'" />
        <Halo v-if="currentBackgroundTheme === 'halo'" />
        <HyperOS v-if="currentBackgroundTheme === 'hyperos'" />
        <HyperOS2 v-if="currentBackgroundTheme === 'hyperos2'" />
        <Halloween v-if="currentBackgroundTheme === 'halloween'" />
        <GravityFieldSimulation v-if="currentBackgroundTheme === 'gravityfield'" />
        <Christmas v-if="currentBackgroundTheme === 'christmas'" />
    </ClientOnly>

    <component :is="DefaultTheme.Layout">
        <template #layout-top>
            <NavThemeHandler />
        </template>
    </component>
    
    <footer class="SimpleFooter">
        <div class="container">
            <p class="copyright">Copyright © 2025-2026 聖小熊</p>
        </div>
    </footer>
</template>

<style scoped>
.SimpleFooter {
    padding: 2rem 0;
    border-top: 1px solid var(--vp-c-divider);
    text-align: center;
    color: var(--vp-c-text-2);
    font-size: 0.9rem;
}
.theme-transition-overlay {
    z-index: 10000 !important;
}
</style>

<style>
/* 內容區域圓角與模糊背景 */
.VPDoc .content:not(.VPDocAsideOutline):not(.VPDocAsideOutline *) {
  border-radius: 18px !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
  padding: 24px;
}

.dark .VPDoc .content:not(.VPDocAsideOutline):not(.VPDocAsideOutline *) {
  background-color: rgba(26, 26, 30, 0.8) !important;
}

.VPContent {
    background-color: rgba(255, 255, 255, 0.2) !important;
}

.dark .VPContent {
    background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>