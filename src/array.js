/* eslint class-methods-use-this:0, no-plusplus:0, no-continue:0 */

///////////////////////////////////////////////////////////////////////////////

class array {
    /**
     * install : interface for vue
     * @param  {object} Vue     vue object
     * @param  {object} options options
     * @return none
     */
    static install (Vue, options) {
        if (!Vue.prototype.$_array) {
            /*eslint new-cap: 0, max-len:0 */
            /*eslint no-param-reassign: 0, max-len:0 */
            Vue.prototype.$_array = new array(options);
        }
    }

    exists(data, key_name, key_value, strict) {
        if (!(data instanceof Array)) {
            return false;
        }

        let result = false;
        for (let i = 0; i < data.length; i++) {
            if (strict && data[i][key_name] === key_value) {
                result = true;
                break;
            } else if (data[i][key_name] === key_value) {
                result = true;
                break;
            }
        }
        return result;
    }

    index_of(data, key_name, key_value, strict) {
        if (!(data instanceof Array)) {
            return -1;
        }

        let result = -1;
        for (let i = 0; i < data.length; i++) {
            if (strict && data[i][key_name] === key_value) {
                result = i;
                break;
            } else if (data[i][key_name] === key_value) {
                result = i;
                break;
            }
        }
        return result;
    }

    in_array(needle, haystack, strict) {
        if (!(haystack instanceof Array)) {
            return false;
        }

        let result = false;
        for (let i = 0; i < haystack.length; i++) {
            if (strict && haystack[i] === needle) {
                result = true;
                break;
            } else if (haystack[i] === needle) {
                result = true;
                break;
            }
        }
        return result;
    }

    merge(des, src, key, overwrite, strict) {
        if (!(des instanceof Array) || !(src instanceof Array)) {
            return false;
        }

        let result = true;
        let index  = 0;
        for (let i = 0; i < src.length; i++) {
            // in case the source array dose not contain the specified key
            if (!src[i].hasOwnProperty(key)) {  /* eslint no-prototype-builtins:0 */
                result = false;
                break;
            }

            index = this.index_of(des, key, src[i][key], strict);
            if (index < 0 || index >= des.length) {
                // in case the destination array dose not contain the specified key
                des.push(src[i]);
                continue;
            }

            // skip if not necessary to overwrite the existing one
            if (!overwrite) {
                continue;
            }

            des.splice(index, 1);
            des.splice(index, 0, src[i]);
            // // reset the destination array
            // if (src[i] instanceof Array) {
            //     des[index] = [];
            // } else {
            //     des[index] = {};
            // }

            // // copy the values
            // for (let idx in src[i]) {
            //     if (!src[i].hasOwnProperty(idx)) {
            //         continue;
            //     }
            //     des[index][idx] = src[i][idx];
            // }
        }
        return result;
    }
}

///////////////////////////////////////////////////////////////////////////////

// interface for vue-plugin
export default { install : array.install };
