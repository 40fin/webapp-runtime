import VueI18n        from 'vue-i18n';

const self = module.exports = { /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    /**
     * install : interface for vue
     * @param  {object} Vue     vue object
     * @param  {object} options options
     * @return none
     */
    install (Vue, locales, prefer) {
        // install plugin
        Vue.use(VueI18n);
        // set lang
        Vue.config.lang = (prefer || window.navigator.language).toLowerCase();   /*eslint no-param-reassign: 0, max-len:0 */
        // set locales
        Object.keys(locales).forEach((lang) => {
            Vue.locale(lang, locales[lang]);
        });
    }

///////////////////////////////////////////////////////////////////////////////
};
