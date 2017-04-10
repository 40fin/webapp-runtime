/* eslint max-len:0, no-mixed-operators:0, no-useless-escape:0, no-plusplus:0, class-methods-use-this:0 */
// import * as VueValidator from '../../../node_modules/vue-validator';

///////////////////////////////////////////////////////////////////////////////
const my_validators = {
    required : {
        message : '该项必填',
        check : function (val) {
            return !val;
        }
    },
    email : {
        message : 'email地址无效',           // error message with plain string
        check : function (val) {            // define validator
            return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
        }
    },
    news_external_url : {
        message : 'URL地址无效',
        check : function (val) {
            return new RegExp('^(http[s]?:\\/\\/(www\\.)){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?').test(val);
        }
    },
    url : {
        message : 'URL地址无效',
        check : function (val) {
            return new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?').test(val);
        }
    },

    area_code : {
        message : '区号无效',
        check : function (val) {
            return /^0\d{2,3}$/.test(val);
        }
    },

    tel_fixed : {
        message : '固定电话号码无效',
        check : function (val) {
            return /^0{0,2}(86)?(10|2[1-9]|[1-9][0-9]{1,2})\-?[0-9]{3,4}\-?[0-9]{4}(\-?[0-9]{2,4})?$/.test(val);
        }
    },

    telephone : {
        message : '号码无效',
        check : function (val) {
            return /^0{0,2}(86)?([1-9][0-9]{1,2})?\-?([0-9]{3,4})\-?([0-9]{4})$/.test(val);
        }
    },

    tel_mobile : {
        message : '手机号无效',
        check : function (val) {
            return /^0{0,2}(86)?1[3-9][0-9]{9}$/.test(val);
        }
    },

    integer : {
        message : '请填写整数',
        check : function (val) {
            return /^[1-9][0-9]*$/.test(val);
        }
    },

    money : {
        message : '请填写合法的金额(单位元)',
        check : function (val) {
            return /^([1-9][0-9]*|0)(\.[0-9]{0,2})?$/.test(val);
        }
    },

    name : {  //少数名族姓名可使用点号
        message : '请填写正确的姓名,长度1到40位',
        check : function (val) {
            return /^[\u4e00-\u9fa5]+[\u4e00-\u9fa5.·]*[\u4e00-\u9fa5]+$/.test(val);
        }
    },
    name_zn : {
        message : '请填写正确的姓名,长度1到40位',
        check : function (val) {
            return /^[\u4e00-\u9fa5]+[\u4e00-\u9fa5.·]*[\u4e00-\u9fa5]+$/.test(val);
        }
    },
    zh_cn : {
        message : '请填写中文汉字',
        check : function (val) {
            return /^[\u4e00-\u9fa5]+$/.test(val);
        }
    },
    zh_en : {
        message : '请填写英文字母',
        check : function (val) {
            return /^[a-zA-Z]+$/.test(val);
        }
    },
    zh_en_n : {
        message : '请填写英文字母和数字',
        check : function (val) {
            return /^[a-zA-Z0-9]$/.test(val);
        }
    },
    string : {
        message : '请填写中文、数字或字母',
        check : function (val) {
            return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(val);
        }
    },

    no_quotes : {
        message : '请填写除了双引号、单引号以外的任意字符',
        check : function (val) {
            return /^[^'"]+$/.test(val);
        }
    },
    // 身份证验证
    certno : {
        message : '请填写正确的身份证号码',
        check : function (val) {
            if (!val) { //是否填写了身份证号码
                return false;
            }
            val = val.toString().toUpperCase();  //eslint-disable-line no-param-reassign
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(val))) { //验证15,18位
                return false;
            }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
            const len = val.length;
            if (len === 15) {
                const re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                const arrSplit = val.match(re);
                //检查生日日期是否正确
                const dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                const bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
                if (!bGoodDay) {
                    //出生日期错误
                    return false;
                }
                return true;
            }
            if (len === 18) {
                const re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                const arrSplit = val.match(re);
                //检查生日日期是否正确
                const dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                const bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
                if (!bGoodDay) {
                    return false;
                }
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                let nTemp = 0;
                for (let k = 0; k < 17; k++) {
                    nTemp += val.substr(k, 1) * arrInt[k];
                }
                const valnum = arrCh[nTemp % 11];
                if (valnum !== val.substr(17, 1)) {
                    //alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return true;
            }
            return false;
        }
    },
//银行卡校验
    bank_card : {
        message : '请填写正确的银行卡号',
        check : function (val) {
            val = val.toString();  //eslint-disable-line no-param-reassign
            if (!val || val.length === 0) {
                return false;
            }
            // 16到19位的数字
            if (!/^[0-9]{16,19}$/.test(val)) {
                return false;
            }
            /*
             * Judges if the number is encoded according to luhm algorithm.
             * return: true if success, else false.
             */
            const len = val.length;
            const header = val.substring(0, len - 1);
            let sum = 0;
            for (let i = header.length - 1, j = 1; i >= 0; i--, j++) {
                let tmp = j % 2 === 1 ? (header[i] - '0') * 2 : (header[i] - '0');
                if (tmp > 9) {
                    tmp = 1 + tmp % 10;
                }
                sum += tmp;
            }
            sum = sum + (val[len - 1] - '0'); /* eslint operator-assignment:0 */
            if (sum % 10 === 0) {
                return true;
            }
            return false;
        }
    },
    any : {
        message : '可填写任意字符',
        check : function (val) {
            return /^[\W\w]+$/.test(val);
        }
    }
};


// class Validator {

    /**
     * install : interface for vue
     * @param  {object} Vue     vue object
     * @param  {object} options options
     * @return none
     */
//     static install (Vue, options) {
//         if (!window.Vue.prototype.$_validator) {
//             window.Vue.prototype.$_validator = new Validator(options);
//         }
//         Vue.use(VueValidator);

//         Object.keys(my_validators).forEach(function(name) {
//             Vue.validator(name, my_validators[name]);
//         });
//     }
//     setup_validator (validator) {
//         /* eslint 'no-param-reassign': 0 */
//         Object.keys(my_validators).forEach(function(name)  {
//             validator[name] = {
//                 fn     :  my_validators[name].check,
//                 msg:  my_validators[name].message
//             };
//         });
//     }
// }
///////////////////////////////////////////////////////////////////////////////

// interface for vue-plugin
export default my_validators;
