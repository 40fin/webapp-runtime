/* eslint no-prototype-builtins:0 */

import Store            from 'store';
import _log             from './log.js';

/**
 * _cache : cache container
 * @type Object
 */
const _cache = {};

const self = module.exports = {  /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    /**
     * set_cache : set page cache
     * @param {String} key   key name
     * @param {Mixed}  value value
     */
    set_cache : function(key, value) {
        _cache[key] = value;

        if (!Store.enabled) {
            _log.warn('Local Storage is not enabled on your web browser!');
            return false;
        }

        try {
            Store.set(key, value);
        } catch (e) {
            _log.log_except(e, { func : 'set_cache', key : key });
            if (e.name === 'QuotaExceededError') {
                _log.warn('The size of local storage beyonds its quotation');
            } else {
                _log.warn('Failed to save data into Local Storage');
            }
            return false;
        }
        return true;
    },

    /**
     * get_cache : get cached value
     * @param {String} key              key name
     * @param {Mixed}  default_value    default value
     * @return {Mixed}                  retreived value
     */
    get_cache : function(key, default_value) {
        if (_cache[key]) {
            return _cache[key];
        }
        return Store.get(key) || default_value;
    },

    /**
     * remove_cache : remove specific row by key
     * @param  {String} key          key name of major cache key
     * @param  {String} sub_key_name sub-key name of the row
     * @param  {Mixed}  sub_key_val  value of the sub-key
     * @return {Boolean}             Operation result
     */
    remove_cache : function(key, sub_key_name, sub_key_val) {
        const ext = self.get_cache(key, []);
        if (!ext) {
            return false;
        }

        const tmp = [];
        for (const idx in ext) {  /*eslint no-restricted-syntax: 0*/
            if (ext.hasOwnProperty(idx) && ext[idx].hasOwnProperty(sub_key_name)
                && sub_key_val === ext[idx][sub_key_name]) {
                continue; /* eslint no-continue:0 */
            }
            tmp.push(ext[idx]);
        }
        self.set_cache(key, tmp);

        return true;
    }
///////////////////////////////////////////////////////////////////////////////
};

