/*eslint max-len: 0, wrap-iife: 0*/
/**
 * @qinhuang
 * to solve the prooblem of
 * one page data transform to another page without use cookie
 *we can use this two way ---->session_strorage   and local_storage
 *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *session_strorage:
 *to save data  transient,if close your browser and the data will not work anymore
 *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *local_storage :
 *will always save the data ,only dismiss when you removeItem of its key
 *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 */
const self = module.exports = {  /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    save_session : function(key, value) {
        window.sessionStorage.setItem(key, value);
    },
    get_session : function(key) {
        return window.sessionStorage.getItem(key);
    },
    remove_session  :function (key) {
        window.sessionStorage.removeItem(key);
    },

    //---------------------------please use session possibly
    save_local_data : function(key, value) {
        window.localStorage.setItem(key, value);
    },
    get_local_data : function(key) {
        window.localStorage.getItem(key);
    },
    remove_local_data  :function (key) {
        window.localStorage.removeItem(key);
    }

///////////////////////////////////////////////////////////////////////////////
};
