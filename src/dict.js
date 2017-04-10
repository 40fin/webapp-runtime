/**
 * _crm._sys_dict : dictionary item containor
 * @type object
 */

const self = module.exports = {
///////////////////////////////////////////////////////////////////////////////
    /**
     * init_dict : initialize the global dictionary
     * @param  array    data      dictionary data
     * @param  boolean  overwrite flag to control overwrite the existing data or not
     * @return none
     */
    init_dict : function(data, overwrite) {
        if (true === overwrite) {
            _crm._sys_dict = data || {};
        } else {
            _crm._sys_dict = _crm.extend({}, _crm._sys_dict || {}, data || {});
        }

        if (_crm.has_feature('enable_localstorage')) {
            _crm.set_cache('_crm._sys_dict', _crm._sys_dict);
        }
    },

    /**
     * load_dict_from_pagedata : load the initia dict items from page data
     * @return {[type]} [description]
     */
    load_dict_from_pagedata : function() {
        const dict_obj = [];
        let dict =  [];
        if (_crm.get_page_data() && _crm.get_page_data().dict) {
            dict = _crm.get_page_data().dict;
        }
        dict.forEach((di) => {
            if (!dict_obj[di.category]) {
                dict_obj[di.category] = [];
            }
            if (di.key) {
                dict_obj[di.category].push({
                    key     : di.key + '',
                    value   : di.value,
                    in_use  : di.in_use
                });
            }
        });
        self.init_dict(dict_obj, true);
    },

    load_dict : function(after_load) {
        if (_crm.has_feature('enable_localstorage')) {
            _crm._sys_dict = _crm.get_cache('_crm._sys_dict', {});
        }

        if (typeof after_load === 'function') {
            after_load();
        }
    },

    /**
     * find_dict : find value by key from global dictionary
     * @param  sting  key           key
     * @param  mixed  default_val   default value
     * @return none
     */
    find_dict : function(categroy, key, default_val) {
        if (!categroy || !key || !_crm._sys_dict || !_crm._sys_dict[categroy]) {
            return default_val || key;
        }
        const dicts = _crm._sys_dict[categroy];
        const dicts_length = dicts.length;
        let result = '';
        for (let i = 0; i < dicts_length; i++) { /* eslint no-plusplus:0 */
            if (dicts[i].key.toString() === key.toString()) {
                result = dicts[i].value;
                break;
            }
        }
        return result;
    },

    /**
     * load_dict_category : load dictionary category
     * @param  sting  categroy   category name
     * @param  boolean  all   include in_use==0 dict
     * @return array  dictionary value
     */
    load_dict_category : function(categroy, all) {
        if (!categroy || !_crm._sys_dict || !_crm._sys_dict[categroy]) {
            return [];
        }
        if (all && all === true) {
            return _crm._sys_dict[categroy];
        } else { /*eslint no-else-return: 0*/
            const result_dict = [];
            for (let i = 0; i < _crm._sys_dict[categroy].length; i++) {  /* eslint no-plusplus:0 */
                if (_crm._sys_dict[categroy][i].in_use.toString() === '1') {
                    result_dict.push(_crm._sys_dict[categroy][i]);
                }
            }
            return result_dict;
        }
    }

///////////////////////////////////////////////////////////////////////////////
};

