CanvasRenderingContext2D.prototype.fillRoundRect = function(x,y,w,h,r){
    this.beginPath(); //开始路径
    this.moveTo(x+r, y); //线的起点
    /* x 决定圆角绘制的左右方向 y 决定圆角绘制的上下方向*/
    this.arcTo(x+w, y, x+w, y + h, r); //顶线圆角 
    this.arcTo(x+w, y+h, x, y+h, r); //右侧线圆角
    this.arcTo(x, y+h, x, y, r); //底线圆角
    this.arcTo(x, y, x+w, y, r); //左侧圆角
    this.closePath();
    this.fill();
}
//元素是否为内联元素
const isInline = element => {
         const _DISPLAY = element.style.display || getComputedStyle(element).display;

         return _DISPLAY == "inline"
      }

let canvas = null,context = null,css = null;

class DrawImage {
    constructor(element,opts = {}){
        this.element = element;
        this.opts = Object.assign({},opts);
        this.createCanvas();
    }
    //创建画布
    createCanvas(){
        const {element:{offsetWidth,offsetHeight}} = this;

        canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
       
        canvas.width = offsetWidth,
        canvas.height = offsetHeight,
        canvas.style.display = "none";

        this.draws();
       
        document.querySelector("body").appendChild(canvas)
    }
    //样式提取
    extract(){
        const {element:{offsetWidth,offsetHeight}} = this;

        const _CSS_KEY = ["borderRadius","backgroundColor","font","color","textAlign","lineHeight"],
              _CSS = window.getComputedStyle(this.element),
              _STYLE = this.element.style;
       
        css = {width:offsetWidth,height:offsetHeight};
        
        _CSS_KEY.forEach(e=>{
            let _val = _STYLE[e] || _CSS[e];

            if(_val != "normal"){ css[e] = /^[\d]+px$/.test(_val) ? parseInt(_val) : _val;}    
        });
    }
    //绘制文本
    drawText(){
        const {element:{offsetLeft,childNodes:[{nodeType,nodeValue}]}} = this;

        const _TEXT = nodeValue.trim();
        
        if(nodeType == Node.TEXT_NODE && _TEXT)
        {
            let _x = offsetLeft,_y = css.height - 1

            if(!isInline(this.element))
            {
                _x = css.width / 2,_y = _y / 2;
                
                context.textAlign = css.textAlign;
            }

            context.font = css.font; context.fillStyle = css.color;
         
            context.textBaseline = "middle";  context.fillText(_TEXT,_x,_y);
        }       
    }
    //多元素绘制
    draws(){
        const {children,children:{length}} = this.element;

        this.draw(); 

        length && [...children].forEach(e=>{this.element = e,this.draws()}); 
    }
    //单个元素绘制   
    draw(){
        this.extract();
        
        if(css.backgroundColor)
        {
            context.fillStyle = css.backgroundColor;
            
            context.fillRoundRect(0,0,css.width,css.height,css.borderRadius)
        }

        this.drawText()
    }
    //获取图片url
    getURL(){
        const _url = canvas.toDataURL();

        canvas.remove();

        return _url;
    }
    //下载图片到本地
    download(){
        const _a = document.createElement("a");

        _a.href = this.getURL();
        
        _a.download = new Date().toISOString().split("T")[0];
        
        _a.click();
     }
}