import { create, all } from 'mathjs';
import { Message } from "element-ui"

const math = create(all);
//配置精度
math.config({
    number: 'BigNumber',
    precision: 64
})

/**
 * @param  add      加法
 * @param  multip   乘法
 * @param  sub      减法
 * @param  divide   除法
 */
export default {
    add: function() {
        let result = 0;
        for(let i=0, len= arguments.length; i< len; i++) {
            let p = arguments[i]? arguments[i]: 0;
            result = math.format(math.parser().eval(result + '+' + p))
        }
        return math.number(result);
    },
    multip: function() {
        let result = 1;
        for(let i=0, len= arguments.length; i< len; i++) {
            let p = arguments[i]? arguments[i]: 0;
            result = math.format(math.parser().eval(result + '*' + p))
        }
        return math.number(result);
    },
    sub: function() {
        let result = arguments[0]? arguments[0]: 0;
        for(let i=0, len= arguments.length; i< len-1; i++) {
            let p = arguments[i+1]!=='' && arguments[i+1]!== void 0 && arguments[i+1]!==null? arguments[i+1]: 0;
            result = math.format(math.parser().eval(result + '-' +p));
        }
        return math.number(result);
    },
    divide: function() {
        let result = arguments[0];
        if(result===''||result===undefined||result==0||result==null) return 0;
        for(let i=0, len= arguments.length; i< len-1; i++) {
            if(arguments[i+1] ==0) {
                Message.error('被除数不能为0！')
                return "";
            }
            result = math.format(math.parser().eval(result + '/' +arguments[i+1]))
        }
        return math.number(result);
    }
}