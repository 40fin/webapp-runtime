/*eslint wrap-iife: 0, no-extra-semi : 0*/

import Vue              from 'vue';
import _bootstrap       from './bootstrap.js';
import _log             from './log.js';
import _is              from './is.js';
import _cache           from './cache.js';
import _dict            from './dict.js';
import _map             from './map.js';
// import _i18n            from './i18n.js';
import _web             from './web.js';
import _app             from './app.js';
import _ds              from './data_storage.js';

const self = module.exports = {
///////////////////////////////////////////////////////////////////////////////
    /**
     * install : hook to call after installed
     * @return none
     */
    install : function(Vue) { /* eslint no-shadow:0 */
        // init _crm and vue
        if (!window.Vue)        window.Vue  = Vue;
        if (!window._crm)       window._crm = {};
        if (!window._crm.data)  window._crm.data = {};
        if (!window._crm.msg)   window._crm.msg  = {};
        if (!_crm.extend)       _crm.extend = Vue.util.extend;

        // Append external interface
        _crm.extend(_crm, _bootstrap);
        _crm.extend(_crm, _log);
        _crm.extend(_crm, _is);
        _crm.extend(_crm, _cache);
        _crm.extend(_crm, _dict);
        _crm.extend(_crm, _map);
        // _crm.extend(_crm, _i18n);
        _crm.extend(_crm, _web);
        _crm.extend(_crm, _app);
        _crm.extend(_crm, _ds);

        window.Vue.use(_app);
    }
///////////////////////////////////////////////////////////////////////////////
};

/* istanbul ignore if */
if (typeof window !== 'undefined') {
    self.install(Vue);
};
