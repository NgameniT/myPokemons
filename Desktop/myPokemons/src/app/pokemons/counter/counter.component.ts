import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-counter',
  templateUrl: './counter.component.html'

})
export class CounterComponent{

  count = 0;

  increment(){
    this.count++;
  }

  decrement(){
    if(this.count > 0 ){
       this.count--;
    }
   
  }

}