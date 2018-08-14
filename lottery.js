class lotteryCard{
	constructor(props) {
        //定义校验规则
        this.propTypes = {
            containerId : 'string.isRequired' ,//容器id
            resultKlass : 'string.notRequired',//结果class
            maskKlass   : 'string.notRequired',//刮层class
            defaultText : 'string.notRequired',//默认文本
            resultText  : 'string.notRequired',//奖品文本
            defaultColor: 'string.notRequired',//刮层颜色
            loop        : 'number.isRequired',//循环的次数
            speed       : 'number.isRequired',//动画的速度
        };
        //参数赋值
        this.state = props ? props : {};
        this.isLock = false;//锁
        this.lotteryItems = null;//存储所要循环的元素
        this.lotteryBegin = null;//存储开始按钮元素
        this.step = 0;//当前位置
        this.random = Math.floor(Math.random()*7)//生成0-7随机数
        //定义容器及组件的样式
        this.lotteryCardStyle = `#${this.state.containerId}{
            display: flex;
            flex-wrap: wrap;
            width: 300px;
            height: 300px
        }`;

        this.lotteryItemsStyle = `.lottery_item{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
            list-style: none;
            cursor: pointer;
            background: #333;
            border: 1px  solid  #fff;
            text-align: center;
            font-size: 16px;
            color: #fff;
            line-height: 22px;
        }`
        this.lotteryItemsStyleActive = `.lottery_item.active {
            background: #fff;
            color: #333;
        }`
        this.lotteryBeginStyle = `#lottery_begin{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
            list-style: none;
            cursor: pointer;
            background: #333;
            border: 1px  solid  #fff;
            text-align: center;
            font-size: 16px;
            color: #fff;
            line-height: 22px;
            `
        // 静态方法

        //用于选择DOM
        this._$ = selector => document.querySelector(selector);
        //用于创建DOM
        this._createElement = type => document.createElement(type);
        //用于文本赋值
        this._setContent = (elem, content) => elem.textContent = content;
        //用于增加子节点
        this._appendChild = (container, node) => container.appendChild(node);
        //启动流程
        this._init();  
    }
    _init(){
        this._validate(); //校验参数
        this._addHTML();//创建HTMl
        this._addStyle(); //创建样式
    }
    _validate(){
        const propTypes = this.propTypes; //获取校验规则
        Object.getOwnPropertyNames(propTypes).forEach((val, idx, array) => {
            //当前类型
            let stateType  = typeof this.state[val];
            //console.log(stateType)//string
            
            //规则类型
            let propsType  = propTypes[val].split('.')[0];
            //console.log(propsType)//string nubmer
            
            //规则参数是否必传
            let required   = propTypes[val].split('.')[1];
            //验证当前参数是否必传
            let isRequired = required  === 'isRequired' ? true : false;
            //验证当前类型与规则类型是否相等
            let isPropType = propsType === typeof this.state[val] ? true : false;
            //类型错误抛出异常值
            let errorType  = `${val} type should be ${propsType} but ${stateType}`;
            //必传参数抛出类型异常值
            let errorIsQu  = `${val} isRequired!'`;
            //如果为必传参数但是没有传值 
            if(isRequired  && !this.state[val]){
                throw new Error (errorIsQu);     //抛出异常
            }
            //如果当前类型与规则类型不等
            if(!isPropType && this.state[val]){
                throw new Error (errorType);     //抛出异常
            }
        });
    }
    _addHTML(){
        let arrLotteryItems = [];
        let $ = this._$;
        let idContainer = $(`#${this.state.containerId}`);
        for(let i = 0;i < 9;i++){
            let lotteryItems = this._createElement("li");
            this._appendChild(idContainer,lotteryItems);
            if(i == 4){
                this._setContent(lotteryItems,this.state.defaultText)
                lotteryItems.setAttribute("id","lottery_begin");
                this.lotteryBegin = lotteryItems
            }else{
                this._setContent(lotteryItems,this.state.resultText)
                lotteryItems.setAttribute("class","lottery_item");
                arrLotteryItems.push(lotteryItems);
            }
        }
        let tmpArrLotteryItems = [];
        tmpArrLotteryItems[0] = arrLotteryItems[0];
        tmpArrLotteryItems[1] = arrLotteryItems[1];
        tmpArrLotteryItems[2] = arrLotteryItems[2];
        tmpArrLotteryItems[3] = arrLotteryItems[4];
        tmpArrLotteryItems[4] = arrLotteryItems[7];
        tmpArrLotteryItems[5] = arrLotteryItems[6];
        tmpArrLotteryItems[6] = arrLotteryItems[5];
        tmpArrLotteryItems[7] = arrLotteryItems[3];
        this.lotteryItems = tmpArrLotteryItems;
        // console.log(this.lotteryItems)
        this.lotteryBegin.addEventListener('click',this._settle.bind(this));//绑定事件

    }
    _addStyle(){
        let $ = this._$;
        //创建样式style标签
        let style = this._createElement('style');
        //把样式的字符串去除空格
        let styleContent = `${this.lotteryCardStyle}
                            ${this.lotteryItemsStyle}
                            ${this.lotteryBeginStyle}
                            ${this.lotteryItemsStyleActive}
                            `;
        // 字符串插入style标签
        this._setContent(style,styleContent);
        // 把style标签插入head标签
        this._appendChild($('head'),style);
    }
    _settle(){
        let isLock = this.isLock;
        if(isLock){
          return
        }else{
            this.isLock = true;
        }
        let lotteryItems = this.lotteryItems
        let random = this.random;
        let length = this.lotteryItems.length;//一圈所走的长度
        let loop = this.state.loop;
        let speed = this.state.speed;
        let total = loop * length + random;
        let step = this.step;
        let timer = setTimeout(() =>{
            for(let i = 0;i<length;i++){
                lotteryItems[i].setAttribute('class','lottery_item')
            }
            if(this.step < total){
                lotteryItems[(this.step+length) % length].setAttribute('class','lottery_item active')
                this.step ++; 
                this.isLock = false;
                this._settle();
            }else{
                lotteryItems[random].setAttribute('class','lottery_item active')
                clearTimeout(timer);
                this.step = 0;  
                this.isLock = false;
            }
            // console.log(this.step,this.step > (loop - 1) * length + random ? speed += 300 :speed)
        },this.step > (loop - 1) * length + random ? speed += 300 :speed)
    }
}
var Card = new lotteryCard({
    containerId:'lotteryCard',
    defaultText:'我要抽奖',
    resultText: '谢谢惠顾',
    loop: 3,
    speed: 90,
});
// this.step > (loop - 1) * length + random ? speed += 177 :speed