/**
 * _sys_map : map item containor
 * @type object
 */

const self = module.exports = {
///////////////////////////////////////////////////////////////////////////////

    /**
     * init_map : initialize the global map
     * @param  array    data      dictionary data·
     * @param  boolean  overwrite flag to control overwrite the existing data or not
     * @return none
     */
    init_map : function(data, overwrite) {
        if (true === overwrite) {
            _crm._sys_map = data || {};
        } else {
            _crm._sys_map = _crm.extend({}, _crm._sys_map || {}, data || {});
        }

        if (_crm.has_feature('enable_localstorage')) {
            _crm.set_cache('_crm._sys_map', _crm._sys_map);
        }
    },
    load_map_from_pagedata : function() {
        const map_obj = [];
        let map =  [];
        if (_crm.get_page_data() && _crm.get_page_data().map) {
            map = _crm.get_page_data().map;
        }
        for (let i = 0; i < map.length; i++) { /* eslint no-plusplus:0 */
            const mi = map[i];
            const value = {
                left    : mi.left,
                right   : mi.right
            };
            if (!map_obj[mi.category]) {
                map_obj[mi.category] = [];
            }
            map_obj[mi.category].push(value);
        }
        self.init_map(map_obj, true);
    },
    /**
     * load_map : load the url_map from the local storage
     * @param  {function} after_load  the callback after load
     * @return {undefined}
     */
    load_map : function(after_load) {
        if (_crm.has_feature('enable_localstorage')) {
            _crm._sys_map =  _crm.get_cache('_crm._sys_map', {});
        }

        if (typeof after_load === 'function') {
            after_load();
        }
    },

    /**
     * find_map : find value by key from global map
     * @param  sting  key           key
     * @param  mixed  default_val   default value
     * @return none
     */
    find_map : function(key, default_val) {
        if (_crm._sys_map && _crm._sys_map[key]) {
            return _crm._sys_map[key];
        }
        if (arguments.length > 1) {
            return default_val;
        }
        return key;
    }

///////////////////////////////////////////////////////////////////////////////
};
