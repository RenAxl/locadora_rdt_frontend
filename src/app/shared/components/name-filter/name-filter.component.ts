import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-name-filter',
  templateUrl: './name-filter.component.html',
  styleUrls: ['./name-filter.component.css']
})
export class NameFilterComponent {

  @Input() text: string = '';
  @Input() nameFilter: string = '';
  @Output() search = new EventEmitter<string>();
  searchName(){
    this.search.emit(this.nameFilter);
  }

  formClear(){
    this.nameFilter = '';
    this.searchName();
  }

}
