/*eslint no-console: 0 */

let _debug = true;

function report_info(level, msg) {
    if (window.bughd) {
        window.bughd('notify', level, msg);
    }
}

const self = module.exports = {  /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    set_debug_mode : function(flag, bughd_key) {
        _debug = !!flag;

        if (window.bughd && bughd_key) {
            window.bughd('create', { key : bughd_key });

            // set api_domain
            window.bughd('custom', {
                api_domain : _crm.get_config('api_domain'),
                user_agent : window.navigator.userAgent
            });

            const page_data = _crm.get_page_data() || {};
            const user_info = page_data.user_info || {};
            window.bughd('user', user_info);
        }
    },

    /**
     * log_except : log the exception information into console
     * @param  {Exception} e exception instance
     * @return none
     */
    log_except : function(e, params) {
        self.warn('[' + e.name + '] : ' + e.message + '(' + e.toString() + ')');

        if (window.bughd) {
            window.bughd('notifyException', e, params || {});
        }

        const stack = e.stack.split('\n');
        for (let i = 0; i < stack.length; i++) { /* eslint no-plusplus:0 */
            self.log('[' + (stack.length - i) + '] : ' + stack[i]);
        }
    },

    is_debug : function() {
        return _debug;
    },

    debug : function(msg) {
        if (_debug) {
            console.debug(msg);
        }
    },

    log : function(msg) {
        if (_debug) {
            console.log(msg);
        }
    },

    info : function(msg) {
        if (_debug) {
            console.info(msg);
            report_info('info', msg);
        }
    },

    warn : function(msg) {
        if (_debug) {
            console.warn(msg);
            report_info('warn', msg);
        }
    },

    error : function(msg) {
        if (_debug) {
            console.error(msg);
            report_info('error', msg);
        }
    }

///////////////////////////////////////////////////////////////////////////////
};
