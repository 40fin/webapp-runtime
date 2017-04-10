/* eslint class-methods-use-this:0 */
import _log             from '../log.js';

/**
 * tracker : website tracker
 * @type {Number}
 */

class Tracker {
    /**
     * constructor : ctor
     * @param  {object} options options
     * @return none
     */
    constructor() {
        if (!window._czc) {
            window._czc = [];
        }

        const page_data = _crm.get_page_data() || {};
        const user_info = page_data.user_info || {};

        // copy the disabled event categories from user session
        this.no_tracking = {};
        if (page_data.no_tracking) {
            Object.keys(page_data.no_tracking).forEach(function(idx) {
                this.no_tracking[page_data.no_tracking[idx]] = true;
            });
        }

        this.setCustomVar('role', user_info.role || 'Non-Login', 0);
        this.event('system', 'init', user_info.uid || '', user_info.uid || '');
    }

    setAutoPageview(autopageview) {
        window._czc.push([
            '_setAutoPageview',
            autopageview || true
        ]);
    }

    pageview(content_url, referer_url) {
        this.setAutoPageview(false);
        window._czc.push([
            '_trackPageview',
            content_url || '',
            referer_url || ''
        ]);
    }

    event(category, action, label, value, nodeid) {
        // skip the disabled tracking categories
        if (this.no_tracking && true === this.no_tracking[category]) {
            _log.log('No tracking on category : ' + category);
            return;
        }

        window._czc.push([
            '_trackEvent',
            category || '',
            action   || '',
            label    || '',
            value    || 0,
            nodeid   || ''
        ]);
    }

    setCustomVar(name, value, time) {
        window._czc.push([
            '_setCustomVar',
            name || '',
            value || '',
            time || 1
        ]);
    }

    deleteCustomVar(name) {
        window._czc.push([
            '_deleteCustomVar',
            name || ''
        ]);
    }

    setAccount(siteid) {
        window._czc.push([
            '_setAccount',
            siteid || 0
        ]);
    }
}

const self = module.exports = {  /*eslint no-unused-vars: 0*/
///////////////////////////////////////////////////////////////////////////////
    /**
     * _name : name of current plugin
     * @type {string}
     */
    _name : 'tracker',

    /**
     * on_before_action : callback function before action
     * @param  route    to   route instance of to
     * @param  route    from route instance of from
     * @param  Function next resolver callback function
     * @return Boolean            Operation result
     */
    on_before_action: function(to, from, next) {
        if (_crm.has_feature('enable_tracker')) {
            if (!_crm.tracker) {
                _crm.tracker = new Tracker();
            }

            _crm.tracker.event(
                '==>',
                to.fullPath || '',
                '',
                _crm.get_time()
            );
        }
        return true;
    },

    /**
     * on_after_action : callback function after action
     * @param  Object route
     * @return Boolean            Operation result
     */
    on_after_action : function(route) {
        if (_crm.has_feature('enable_tracker') && _crm.tracker) {
            _crm.tracker.event(
                '<==',
                route.fullPath || '',
                '',
                _crm.get_time()
            );
        }

        return true;
    },

    /**
     * get_page_name : get full path by transition
     * @param  Object transition    transition
     * @return String               retrieved full path
     */
    get_page_name : function(transition) {
        if (transition && transition.to) {
            if (transition.to.title) {
                return _crm.get_app().$t(transition.to.title) || transition.to.title;
            }
            if (transition.to.page_name) {
                return transition.to.page_name;
            }

            if (transition.to.matched > 0) {
                const rtr = transition.to.matched[transition.to.matched.length - 1];
                if (rtr && rtr.handler && rtr.handler.fullPath) {
                    return rtr.handler.fullPath;
                }
            }
        }

        return '';
    }
///////////////////////////////////////////////////////////////////////////////
};
