import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import * as actions from '../../store/actions/search.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('inputSearch') inputSearch:ElementRef;
  showAlert = false;

  searchOptions =[
    {name:'Show All', value:'all'},
    {name:'Favorites', value:'fav'},
    {name:'Africa', value:'africa'},
    {name:'America', value:'americas'},
    {name:'Asia', value:'asia'},
    {name:'Europa', value:'europe'},
    {name:'Oceania', value:'oceania'}
  ];

  termino:string = "";

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  selectedOption(option:string){
    this.store.dispatch( actions.searchOption({ option }) );
  }

  search(termino:string){
    this.store.dispatch( actions.search({ term: termino }) );

    let valueInput = this.inputSearch.nativeElement.value;
    if(valueInput.length > 0){ this.showAlert = false;}
  }

  btnSearch(e){
    let valueInput = this.inputSearch.nativeElement.value;
    if(valueInput.length > 0){
      this.store.dispatch( actions.search({ term: valueInput }) );
      this.showAlert = false;
    }else{
      this.showAlert = true;
    }
    e.preventDefault();
  }

}
