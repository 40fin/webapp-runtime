/**
 * indexScrollTop : index scroll top
 * @type {Number}
 */
const _history = [];

const self = module.exports = {  /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    /**
     * _name : name of current plugin
     * @type {string}
     */
    _name : 'history',

    /**
     * on_before_action : callback function before action
     * @param  Object transition
     * @return Boolean            Operation result
     */
    on_before_action: function(transition) {
        _history.push(window.location.href);
        return true;
    },

    /**
     * on_after_action : callback function after action
     * @param  Object transition
     * @return Boolean            Operation result
     */
    on_after_action : function(transition) {
        _history.pop();
        return true;
    },

    /**
     * current_url : get current URL
     * @return {String} current URL
     */
    current_url : function() {
        if (_history.length > 0) {
            return _history[_history.length - 1];
        }
        return '';
    },

///////////////////////////////////////////////////////////////////////////////
};
