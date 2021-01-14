export class CreateImage {
    #SVGXHTML = '';
    constructor(element){
        this.element = this.clone(element);

        this.main();
    }
    main(){
        this.forEachElements();

        this.#SVGXHTML = this.getSVGXHTML();
    }
    clone(element){
        //
        return element 
               ? 
               element.cloneNode(true) 
               : 
               null;
    }
    forEachElements(){
        let childs = null,len = 0,list = [];

        do
        { 
            childs = this.element.children;

            len = childs.length;

            this.styleHandler(this.element); 
        }
        while(i<len)
        {
            const child = childs[i],nodeList = child.children;

            this.styleHandler(child);

            if(nodeList){ list = list.concat([...nodeList]); }

            if(i == len - 1 && list.length)
            {
                childs = list,len =  list.length;

                continue;
            }
            i++;
        }
    }
    styleHandler(element){
        const styles = getComputedStyle(element,null);

        for(let key in styles)
        {
            const value = styles[key]; 

            if(value){ element.style[key] = value; }
        }

        if(!element.style.width){ element.style.width = element.offsetWidth + 'px'; }

        if(!element.style.height){ element.style.height = element.offsetHeight + 'px'; }
    }
    getSVGXHTML(){
        const width = this.element.offsetWidth + 'px',
              height = this.element.offsetWidth + 'px';

        this.element.xmlns = 'http://www.w3.org/1999/xhtml';

        return `<svg xmlns = 'http://www.w3.org/2000/svg' width = '${width}' height = '${height}'>
                <foreignObject x = '0' y = '0' width = '100%' height = '100%'>
                    ${this.element.outerHTML}
                </foreignObject>
            </svg>`;
    }
    getDataURL(){
        const blob = new Blob([this.#SVGXHTML],{type:"image/svg+xml"});

        return new Promise((reslove,reject)=>{
                const file = new FileReader();

                file.readAsDataURL(blob);

                file.onload = ()=>reslove(file.result);

                file.onerror = (err)=>reject(err);
        });
    }
    getSVG(){ return `data:image/svg+xml;${this.#SVGXHTML}`; }
    getPng(){

    }

}