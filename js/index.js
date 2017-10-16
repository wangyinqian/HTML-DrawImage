//绘制圆角矩形
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
//设置阴影
CanvasRenderingContext2D.prototype.setShadow = function(cssshadow){
    if(cssshadow == "none"){ cssshadow = "rgba(0,0,0,0) 0px 0px 0px"; }

    const [color,x,y,blur] =  cssshadow.split(/\) |px/);
    //阴影水平偏移
    this.shadowOffsetX = parseInt(x);
    //阴影垂直偏移
    this.shadowOffsetY = parseInt(y);
    //阴影颜色  
    this.shadowColor = color + ")";
    //阴影模糊度     
    this.shadowBlur = parseInt(blur)  
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
        this.opts = Object.assign({
                width:this.element.offsetWidth,
                height:this.element.offsetHeight,
                imgType:"image/png" 
        },opts);
        this.createCanvas();
    }
    //创建画布
    createCanvas(){
        canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
       
        canvas.width = this.opts.width,
        canvas.height = this.opts.height,
        canvas.style.display = "none";

        this.draws();
       
        document.querySelector("body").appendChild(canvas)
    }
    //样式提取
    extract(){
        const {element:{offsetWidth,offsetHeight}} = this;

        const _CSS_KEY = ["borderRadius","backgroundColor","font","color","textAlign","lineHeight","boxShadow","textShadow"],
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
        const {element:{offsetLeft,childNodes}} = this;

        if(childNodes && childNodes.length)
        {
            const [{nodeType,nodeValue}] = childNodes;
            
            const _TEXT = nodeValue && nodeValue.trim();
            
            if(nodeType == Node.TEXT_NODE && _TEXT)
            {
                let _x = offsetLeft,_y = css.height - 1
                
                if(!isInline(this.element))
                {
                    _x = css.width / 2,_y = _y / 2;
                    
                    context.textAlign = css.textAlign;
                }
    
                context.setShadow(css.textShadow);
    
                context.font = css.font; context.fillStyle = css.color;
                
                context.textBaseline = "middle";  context.fillText(_TEXT,_x,_y);
            }
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
            const {element:{offsetLeft:x,offsetTop:y}} = this;

            context.fillStyle = css.backgroundColor;

            context.setShadow(css.boxShadow);

            context.fillRoundRect(x,y,css.width,css.height,css.borderRadius);     
        }
        
        this.drawText()
    }
    //获取图片url
    getURL(){
        const _url = canvas.toDataURL(this.opts.imgType);

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
