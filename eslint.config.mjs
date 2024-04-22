// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import pluginVue from 'eslint-plugin-vue';

export default withNuxt(
  ...pluginVue.configs['flat/strongly-recommended'],
  {
    rules: {
      'semi': 'error',
      'arrow-spacing': 'error',
      'vue/multi-word-component-names': ['error', {ignores: ['default', 'index', 'settings']}]
    }
  }
);
