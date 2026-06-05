import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: 'pkmnBorderCard',
  standalone: true
})
export class BorderCardDirective{
  private initialColor: string = '#f5f5f5';
  private defaultColor: string = '#009686';

  private initialBgColor: string = '#ffffff';
  private defaultBgColor: string = '#009686';

  private defaultHeight: number = 200;

  constructor( private el: ElementRef){
    this.setBorder(this.initialColor);
    this.setHeight(this.defaultHeight);
    this.setBackground(this.initialBgColor);
    this.el.nativeElement.style.transition = 'transform 0.2s ease-in-o'
  }

  private setBorder(color:string){
    let border = 'solid 4px '+ color;
    this.el.nativeElement.style.border = border;
  }

  private setHeight(heigh: number){
    this.el.nativeElement.style.height = heigh+'px';
  }

  private setBackground(background: string){
    this.el.nativeElement.style.background = background;
  }


  @HostListener('mouseenter') onMouseEnter(){
    this.setBorder(this.defaultColor);
    this.setBackground(this.defaultBgColor);
    this.el.nativeElement.style.transform = 'scale(1.1)'
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.setBorder(this.initialColor);
    this.setBackground(this.initialBgColor);
    this.el.nativeElement.style.transform = 'scale(1)'
  }


}