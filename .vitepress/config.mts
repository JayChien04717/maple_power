import { defineConfig } from '@lando/vitepress-theme-default-plus/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const config = defineConfig({
    ignoreDeadLinks: true,
    title: '新楓之谷戰力分析',
    base: '/maple_power/',
    lang: 'zh-TW',
    cleanUrls: true,
    appearance: 'dark',
    head: [
        ['meta', { name: 'theme-color', content: '#00FFEE' }],
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
        ['script', { type: 'text/javascript', src: 'https://openapi.nexon.com/js/analytics.js?app_id=245469', async: '' }]
    ],
    vite: {
        plugins: [react()],
        resolve: {
            alias: [
                { find: 'react', replacement: fileURLToPath(new URL('../node_modules/react', import.meta.url)) },
                { find: 'react-dom', replacement: fileURLToPath(new URL('../node_modules/react-dom', import.meta.url)) },
            ],
            dedupe: ['react', 'react-dom'],
        },
        optimizeDeps: {
            include: [
                'react', 
                'react-dom', 
                'react-dom/client',
                'lucide-react',
                'markdown-it',
                'recharts'
            ],
        },
    },   
    themeConfig: {
        logo: '/logo.png',
        sidebar: false,
        nav: [],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/HolyBearTW' }
        ],
    },
})

export default config
