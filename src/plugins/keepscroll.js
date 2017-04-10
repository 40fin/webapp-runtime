/**
 * indexScrollTop : index scroll top
 * @type {Number}
 */
let _indexScrollTop = 0;

const self = module.exports = {  /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    /**
     * _name : name of current plugin
     * @type {string}
     */
    _name : 'keepscroll',

    /**
     * on_before_action : callback function before action
     * @param  route    to   route instance of to
     * @param  route    from route instance of from
     * @param  Function next resolver callback function
     * @return Boolean            Operation result
     */
    on_before_action: function(to, from, next) {
        if (to.fullPath !== '/') {
            _indexScrollTop = window.document.body.scrollTop;
        }
        window.scrollTo(0, _indexScrollTop);
        return true;
    },

    /**
     * on_after_action : callback function after action
     * @param  Object route
     * @return Boolean            Operation result
     */
    on_after_action : function(route) {
        if (route.fullPath !== '/') {
            window.document.body.scrollTop = 0;
        } else {
            window.Vue.nextTick(() => {
                window.document.body.scrollTop = _indexScrollTop;
            });
        }
        return true;
    }

///////////////////////////////////////////////////////////////////////////////
};
