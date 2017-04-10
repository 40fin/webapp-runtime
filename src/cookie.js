// /* jshint unused:false */'use strict';

// ///////////////////////////////////////////////////////////////////////////////

// class cookie{
//     /**
//      * install : interface for vue
//      * @param  {object} Vue     vue object
//      * @param  {object} options options
//      * @return none
//      */
//     static install (Vue, options) {
//         if( !Vue.prototype.$_cookie ){
//             Vue.prototype.$_cookie = new cookie(options);
//         }
//     }

//     /**
//      * constructor : ctor
//      * @param  {object} options options
//      * @return none
//      */
//     constructor(options){}

//     /**
//      * create : create cookie
//      * @param  string name  cookie name
//      * @param  string value cookie value
//      * @param  number days  number of days for expiritions
//      * @return none
//      */
//     create (name, value, days) {
//         var expires = '';
//         if (days) {
//             var date = new Date();
//             date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//             expires = '; expires=' + date.toGMTString();
//         }

//         window.document.cookie = name + '=' + value + expires + '; path=/';
//     }

//     /**
//      * read : read value from cookie by cookie name
//      * @param  string name  cookie name
//      * @return string      cookie value
//      */
//     read (name) {
//         var nameEQ = name + '=';
//         var ca = window.document.cookie.split(';');
//         for (var i = 0; i < ca.length; i++) {
//             var c = ca[i];
//             while (c.charAt(0) === ' '){
//                 c = c.substring(1, c.length);
//             }
//             if (c.indexOf(nameEQ) === 0){
//                 return c.substring(nameEQ.length, c.length);
//             }
//         }
//         return null;
//     }

//     /**
//      * erase : erase the data on cookie
//      * @param  string name  cookie name
//      * @return none
//      */
//     erase (name) {
//         this.create(name, '', -1);
//     }
// }

// ///////////////////////////////////////////////////////////////////////////////

// // interface for vue-plugin
// export default {install : cookie.install};
