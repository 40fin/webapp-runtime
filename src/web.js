/*eslint max-len: 0, wrap-iife: 0, indent: 0, no-useless-escape:0 */

import _log             from './log.js';

const self = {
///////////////////////////////////////////////////////////////////////////////
    /**
     * getViewport : get rect value of viewport. Note viewport sizing broken in
     *      Android 2.x see http://stackoverflow.com/questions/6601881/problem-with-meta-viewport-and-android
     * @return {Object} Rect value of viewport
     */
    getViewport : function() {
        const viewport = {
                left    : window.pageXOffset,   // http://www.quirksmode.org/mobile/tableViewport.html
                top     : window.pageYOffset,
                width   : window.innerWidth || window.documentElement.clientWidth,
                height  : self.getClientHeight()
        };
        if (self.isTouchDevice() && self.isInput(self.getActiveElement())) {     // iOS *lies* about viewport size when keyboard is visible. See http://stackoverflow.com/questions/2593139/ipad-web-app-detect-virtual-keyboard-using-javascript-in-safari Input focus/blur can indicate, also scrollTop:
            return {
                left    : viewport.left,
                top     : viewport.top,
                width   : viewport.width,
                height  : viewport.height * (viewport.height > viewport.width ? 0.65 : 0.45)  // Fudge factor to allow for keyboard on iPad
            };
        }
        return viewport;
    },

    /**
     * adjustViewport : Adjust the size of viewport
     * @return None
     */
    adjustViewport : function() {
        if (!self.isMobile()) {
            return;
        }
        const meta = window.document.querySelector('[name="viewport"]');
        let TARGET_WIDTH = 320;

        const match = window.navigator.userAgent.match(/Android (\d+\.\d+)/);
        if (match) {
            if (parseFloat(match[1]) < 4.4) {
                if (TARGET_WIDTH === 320) {
                    TARGET_WIDTH++; /* eslint no-plusplus:0 */
                }
                const scale = window.screen.width / TARGET_WIDTH;
                meta.setAttribute('content', 'width=' + TARGET_WIDTH + ', initial-scale = ' + scale + ', target-densitydpi=device-dpi');
            } else {
                meta.setAttribute('content', 'width=' + TARGET_WIDTH + ', user-scalable=no');
            }
        } else {
            meta.setAttribute('content', 'width=' + TARGET_WIDTH + ', user-scalable=no');
        }
    },

    /**
     * getActiveElement : get current active element
     * @return {Object} current active element
     */
    getActiveElement : function() {
        try {
            return window.document.activeElement;  // can get exeption in IE8
        } catch (e) {
            _log.log_except(e);
            return null;
        }
    },

    /**
     * getClientHeight : 获取窗口可视范围的高度
     * @return {Number} 窗口可视范围的高度
     */
    getClientHeight : function() {
        let clientHeight = 0;
        if (window.document.body.clientHeight && window.document.documentElement.clientHeight) {
            clientHeight = (window.document.body.clientHeight < window.document.documentElement.clientHeight) ? window.document.body.clientHeight : window.document.documentElement.clientHeight;
        } else {
            clientHeight = (window.document.body.clientHeight > window.document.documentElement.clientHeight) ? window.document.body.clientHeight : window.document.documentElement.clientHeight;
        }
        return clientHeight || 0;
    },

    /**
     * getClientWidth : 获取窗口可视范围的宽度
     * @return {Number} 窗口可视范围的宽度
     */
    getClientWidth : function() {
        let clientWidth = 0;
        if (window.document.body.clientWidth && window.document.documentElement.clientWidth) {
            clientWidth = (window.document.body.clientWidth < window.document.documentElement.clientWidth) ? window.document.body.clientWidth : window.document.documentElement.clientWidth;
        } else {
            clientWidth = (window.document.body.clientWidth > window.document.documentElement.clientWidth) ? window.document.body.clientWidth : window.document.documentElement.clientWidth;
        }
        return clientWidth || 0;
    },

    /**
     * getScrollTop : 获取窗口滚动条高度
     * @return {Number} 窗口滚动条高度
     */
    getScrollTop : function() {
        let scrollTop = 0;
        if (window.document.documentElement && window.document.documentElement.scrollTop) {
            scrollTop = window.document.documentElement.scrollTop;
        } else if (window.document.body) {
            scrollTop = window.document.body.scrollTop;
        }
        return scrollTop || 0;
    },

    /**
     * getScrollHeight : 获取文档内容实际高度
     * @return {Number} 文档内容实际高度
     */
    getScrollHeight : function() {
        return Math.max(window.document.body.scrollHeight, window.document.documentElement.scrollHeight);
    },

    /**
     * getStyle : get specified style property from current element
     * @param  {Object} el        Current element instance
     * @param  {String} styleProp Style name
     * @return {Mixed}            Value of specified style property
     */
    getStyle : function(el, styleProp) {
        const camelize = function (str) {
            return str.replace(/\-(\w)/g, function(str2, letter) {
                return letter.toUpperCase();
            });
        };

        if (el.currentStyle) {
            return el.currentStyle[camelize(styleProp)];
        } else if (window.document.defaultView && window.document.defaultView.getComputedStyle) {
            return window.document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        }
        return el.style[camelize(styleProp)];
    }

    // dataURL2Blob : function(data_url) {
    //     // convert base64/URLEncoded data component to raw binary data held in a string
    //     var byteString;
    //     if (data_url.split(',')[0].indexOf('base64') >= 0) {
    //         byteString = atob(data_url.split(',')[1]);
    //     } else {
    //         byteString = unescape(data_url.split(',')[1]);
    //     }

    //     // separate out the mime component
    //     var mimeString = data_url.split(',')[0].split(':')[1].split(';')[0];

    //     // write the bytes of the string to a typed array
    //     var ia = new Uint8Array(byteString.length);
    //     for (var i = 0; i < byteString.length; i++) {
    //         ia[i] = byteString.charCodeAt(i);
    //     }

    //     return new window.Blob([ia], {type:mimeString});
    // },

    // blob2DataURL : function(blob, callback) {
    //     var reader = new window.FileReader();
    //     reader.onload = function(e) {
    //         if (callback) {
    //             callback(e.target.result);
    //         }
    //     };
    //     reader.readAsDataURL(blob);
    // },

    // loadDataURL(obj, callback) {
    //     if (!obj) {
    //         return false;
    //     }
    //     let reader = new window.FileReader();

    //     reader.onprogress =  function(event) {
    //         if (event.lengthComputable) {
    //             // event.loaded and event.total are ProgressEvent properties
    //             var loaded = event.total===0 ? 0 : (100 * event.loaded / event.total);
    //             _log.log('onprogress : ' + loaded);
    //         }
    //     };

    //     reader.onload = function(event) {
    //         if (callback) {
    //             callback(event.target.result);
    //         }
    //     };

    //     reader.onerror = function(event){
    //         if (event.target.error.name === 'NotReadableError') {
    //             // The file could not be read
    //         }
    //         _log.error(event);
    //     };

    //     reader.readAsDataURL(obj);

    //     return true;
    // },
    // /**
    //  * go_prev go back
    //  * @param  string url if there is no history, then go this rul
    //  */
    // go_prev(url) {
    //     if(window.history.length>1) {
    //         window.history.back();
    //     } else {
    //         window.location.href  = url;
    //         //_log._router.go(url);
    //     }
    // },
///////////////////////////////////////////////////////////////////////////////
};

module.exports = { web : self };
