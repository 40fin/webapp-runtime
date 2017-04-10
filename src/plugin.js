/*eslint max-len:0, no-plusplus:0 */
import _log             from './log.js';

/**
 * _plugins : plugin container
 * @type Object
 */
const _plugins = [];

const self = module.exports = { /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    /**
     * on_app_start : callback function before application started
     * @param  {Object} router router instance
     * @return {Boolean}        Operation result
     */
    on_app_start    : function(router) {
        let plugin;
        let result = true;
        for (let i = 0; i < _plugins.length; i++) {
            plugin = _plugins[i];

            if (plugin.on_app_start) {
                _log.log('  [' + (plugin._name || 'Unkonwn') + '] -----------------> on_app_start');
                try {
                    if (!plugin.on_app_start(router)) {
                        _log.warn('Failed to start app');
                        result = false;
                    }
                } catch (e) {
                    _log.log_except(e, { func: 'on_app_start', key : (plugin._name || 'Unkonwn') });
                    result = false;
                }
            }
        }
        return result;
    },

    /**
     * on_app_shutdown : callback function before application quit
     * @param  {Object} router router instance
     * @return {Boolean}        Operation result
     */
    on_app_shutdown    : function() {
        let plugin;
        let result = true;
        for (let i = 0; i < _plugins.length; i++) {
            plugin = _plugins[i];

            if (plugin.on_app_shutdown) {
                _log.log('  [' + (plugin._name || 'Unkonwn') + '] -----------------> on_app_shutdown');
                try {
                    if (!plugin.on_app_shutdown()) {
                        _log.warn('Failed to start app');
                        result = false;
                    }
                } catch (e) {
                    _log.log_except(e, { func: 'on_app_shutdown', key : (plugin._name || 'Unkonwn') });
                    result = false;
                }
            }
        }
        return result;
    },

    /**
     * on_before_action : callback function before action
     * @param  Object transition
     * @return Boolean            Operation result
     */
    on_before_action: function(to, from, next) {
        let result = true;

        if (to && !_crm.authed_user()) {
            _log.warn('Failed to load private page for non-login user : ' + (to.name || to.alias || ''));
            next(false);
            return false;
        }

        // set title
        to.matched.some((record) => {
            // return record.meta.title;
            if (record.meta.title) {
                window.document.title = _crm.get_app().$t(record.meta.title) || '';
                return true;
            }
            return false;
        });

        _plugins.forEach((plugin) => {
            if (plugin.on_before_action) {
                try {
                    if (!plugin.on_before_action(to, from, next)) {
                        _log.warn('Failed to start app');
                        result = false;
                    }
                } catch (e) {
                    _log.log_except(e, { func: 'on_before_action', key : (plugin._name || 'Unkonwn') });
                    result = false;
                }
            }
        });

        if (result) {
            next();
        } else {
            next(false);
        }
        return result;
    },

    /**
     * on_after_action : callback function after action
     * @param  Object transition
     * @return Boolean            Operation result
     */
    on_after_action : function(route) {
        let plugin;
        let result = true;

        for (let i = _plugins.length - 1; i >= 0; i--) {
            plugin = _plugins[i];

            if (plugin.on_after_action) {
                // _log.log('  [' + (plugin._name || 'Unkonwn') + '] -----------------> on_after_action');
                try {
                    if (!plugin.on_after_action(route)) {
                        _log.warn('Failed to start app');
                        result = false;
                    }
                } catch (e) {
                    _log.log_except(e, { func: 'on_after_action', key : (plugin._name || 'Unkonwn') });
                    result = false;
                }
            }
        }
        return result;
    },

    /**
     * find_plugin : find plugin by name
     * @param  {String} name     plugin name
     * @return reference of plugin
     */
    find_plugin : function(name) {
        let result = {};
        _plugins.forEach((plugin) => {
            if (plugin._name === name) {
                result = plugin;
            }
        });

        return result;
    },

    /**
     * install : interface for vue
     * @param  {object} objVue     vue instance
     * @param  {object} options options
     * @return none
     */
    install : function(objVue, options) {
        if (options && options.length > 0) {
            options.forEach((plugin) => {
                _plugins.push(plugin);
            });
        }
    }

///////////////////////////////////////////////////////////////////////////////
};
