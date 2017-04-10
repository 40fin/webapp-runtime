/*eslint max-len: 0, no-unused-vars: 0, wrap-iife: 0, no-extra-semi : 0*/

import VueRouter        from 'vue-router';
import VueResource      from 'vue-resource';
// import VueTouch         from 'vue-touch';
import lazyload         from 'vue-lazyload-img';

import Plugin           from './plugin.js';
import I18n             from './i18n.js';
import _is              from './is.js';
import _log             from './log.js';
import _dict            from './dict.js';
import _map             from './map.js';
import store from '../../../src/vuex/store.js';

// declare module variable
let _config = {};
let _router = {};

const self = module.exports = {
///////////////////////////////////////////////////////////////////////////////
    /**
     * _router : router instance
     * @type Object
     */
    // _router : null,

    /**
     * get_default_features : get default features
     * @return Object   Default features
     */
    get_default_features : function() {
        return {
            enable_webshims         : !!window.webshims,
            enable_touch_support    : _is.isTouchDevice(),
            enable_lazyload         : false,
            enable_localstorage     : true,
            enable_protect_hash     : true,
            enable_auto_dict        : true,
            enable_auto_map         : true,
            enable_i18n             : true,
            enable_tracker          : true
        };
    },

    /**
     * get_default_plugins : get default plugins
     * @return Object   Default plugins
     */
    get_default_plugins : function() {
        return [
            require('./plugins/keepscroll.js'),
            require('./plugins/tracker.js')
        ];
    },

    /**
     * get_default_config : get default config
     * @return Object   Default config
     */
    get_default_config : function() {
        return {
            debug           : false,
            default_action  : '/',
            default_tag     : 'App',
            start_component : {},
            route_map       : {},

            // msg             : {},
            // _error          : {},
            // config          : {},

            // call back function
            on_app_start    : function(router) {
                return true;
            },
            on_app_shutdown : function() {
                return true;
            },
            on_before_action: function(to, from, next) {
                return true;
            },
            on_after_action : function(route) {
                return true;
            },
            features : self.get_default_features()
        };
    },

    /**
     * get_config : get config value by key
     * @return {mixed}  retreived config value
     */
    get_config : function(key) {
        const default_val = arguments.length > 1 ? arguments[1] : '';

        if (!_config || 'undefined' === typeof _config[key]) {
            return default_val;
        }
        return _config[key];
    },

    /**
     * get_default_webshims : get default webshims
     * @return Object   Default webshims
     */
    get_default_webshims : function() {
        return [
            'es5',
            'forms',
            'canvas',
            'filereader',
            // 'forms-ext',
            'geolocation',
            'promise',
            'xhr2'
        ];
    },

    /**
     * init_app : init the app config
     * @param  {Object}     vue     vue object
     * @param  {Function}   onStart callback function
     * @return {boolean}     true
     */
    init_app : function(vue, onStart) {
        // load and implement all unsupported features
        if (self.has_feature('enable_webshims')) {
            // $('#container').css('-webkit-overflow-scrolling','auto');

            const features = self.get_default_webshims();
            window.webshims.polyfill(features.join(' '));
        }

        // if (self.has_feature('enable_touch_support')) {
        //     window.Vue.use(VueTouch);

        //     const FastClick = require('fastclick');
        //     /**
        //      * @param {EventTarget|Element} targetElement
        //      */
        //     FastClick.prototype.focus = function(targetElement) {
        //         let length;

        //         // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw
        //         //  a vague TypeError on setSelectionRange. These elements don't have an
        //         //  integer value for the selectionStart and selectionEnd properties, but
        //         //   unfortunately that can't be used for detection because accessing the
        //         //   properties also throws a TypeError. Just check the type instead.
        //         //   Filed as Apple bug #15122724.
        //         if (_is.isiOS()
        //             && targetElement.setSelectionRange
        //             && targetElement.type.indexOf('date') !== 0
        //             && targetElement.type !== 'number'
        //             && targetElement.type !== 'time'
        //             && targetElement.type !== 'month') {
        //             length = targetElement.value.length;
        //             targetElement.setSelectionRange(length, length);
        //         } else {
        //             targetElement.focus();
        //         }
        //     };

        //     FastClick.attach(window.document.body);
        // }

        if (self.has_feature('enable_lazyload')) {
            window.Vue.use(window.Vue.lazyimg, {
                fade    : true,
                nohori  : true,
                speed   : 20
            });
        }

        // enable url router
        window.Vue.use(VueRouter);
        if (_config.route_map) {
            _router = new VueRouter({
                linkActiveClass : 'active',
                routes          : _config.route_map
            });

            // alias
            window.Vue.prototype.$go = _router.go;
            window.Vue.prototype.$jump = window.location.href;
        } else {
            _log.log('No route mapping has been provided!');
        }

        // install and enable plugins
        window.Vue.use(VueResource);

        if (self.has_feature('enable_i18n')) {
            const default_lang = window.navigator.language;
            const default_locales = {};
            default_locales[default_lang] = {};
            window.Vue.use(
                I18n,
                self.get_config('i18n_locales', default_locales),
                self.get_config('prefer_lang', default_lang)
            );
        }

        // callback when initilizing stage
        if (onStart) {
            onStart(_router);
        }

        // self.load_map(function() {
        //     self.load_dict(onStart);
        // });
    },

    /**
     * get_app : get app instance
     * @return {object} object of app intance
     */
    get_app : function() {
        return _router && _router.app ? _router.app : {};
    },

    /**
     * get_router : get router instance
     * @return {object} object of router intance
     */
    get_router : function() {
        return _router || {};
    },

    /**
     * has_feature : detect has specified feature or not
     * @param  {String}  feature feature name
     * @return {Boolean}         has feature or not
     */
    has_feature : function(feature) {
        return !!_config.features[feature];
    },

    /**
     * start : function entry
     * @param  {Object}     conf    config
     * @param  {Function}   onStart callback function
     * @return none
     */
    start : function(conf, onStart) {
        if (!_config || Object.keys(_config).length <= 0) {
            _config = self.get_default_config();
        }
        if (conf) {
            window.Vue.util.extend(_config, conf);
        }
        window.Vue.config.silent = (!_config.debug) || true;
        _log.set_debug_mode(
            _config.debug || false,
            _config.bughd_key || ''
        );

        if (self.has_feature('enable_auto_dict')) {
            _dict.load_dict_from_pagedata();
        }
        if (self.has_feature('enable_auto_map')) {
            _map.load_map_from_pagedata();
        }
        if (self.has_feature('enable_protect_hash')) {
            self.start_protect_page(_config.protected_page === '#!/sys/volatile');
        }

        // prepare plugins
        const plugins = self.get_default_plugins();
        if (_config.plugins && _config.plugins.length > 0) {
            _config.plugins.forEach((plgn) => {
                plugins.push(plgn);
            });
        }
        _config.plugins = plugins;

        self.init_app(window.Vue, onStart);

        return self._run();
    },

    /**
     * start : function entry
     * @return boolean    Operation result
     */
    _run : function() {
        window.Vue.use(Plugin, _config.plugins);

        // call callback function on_app_start
        Plugin.on_app_start(_router);

        // global event hook for before/after each action
        _router.beforeEach(Plugin.on_before_action);
        _router.afterEach(Plugin.on_after_action);

        // // Redirect to default action if any routes are unmatched
        // _router.redirect({
        //     '*' : _config.default_action || '/'
        // });

        // Start the app on the #app div
        const app = new window.Vue(window.Vue.util.extend(
            _config.start_component,
            { router : _router,
                store :store
            }
        )).$mount(_config.default_tag);

        // Call callback function on_app_shutdown
        Plugin.on_app_shutdown();
        return true;
    },

    /**
     * start_protect_page : start to protect specified URL
     * @param  {Object} protectedHash protected URL hash
     * @return None
     */
    start_protect_page : function(protectedHash) {
        window.addEventListener('popstate', function() {
            if (window.location.hash === protectedHash) {
                setTimeout(() => {
                    window.history.go(-1);
                }, 0);
            }
        }, false);
    },

    /**
     * install : hook to call after installed
     * @return none
     */
    install : function(Vue) {
        // setup default value
        _config = self.get_default_config();
    }
///////////////////////////////////////////////////////////////////////////////
};
