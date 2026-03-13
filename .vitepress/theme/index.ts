import VPLTheme from '@lando/vitepress-theme-default-plus';
import MyCustomLayout from './MyCustomLayout.vue';
import './style.css';
import Spoiler from './Spoiler.vue';

export default {
    extends: VPLTheme,
    Layout: MyCustomLayout,
    enhanceApp({ app }) {
        app.component('Spoiler', Spoiler);
    }
};
