import { Component, OnInit } from '@angular/core';


import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '../../services/country/country.service';
import { Country, Currency, Favorite } from '../../models/country.model';
import { AppState } from '../../store/app.reducers';
import { loadCountries } from 'src/app/store/actions';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  Africa = [];
  America = [];
  Asia = [];
  Europa = [];
  Oceania = [];
  countries: Country[] = [];
  favorites: Favorite[] = [];
  myFavorites:any = [];

  closeResult = '';
  loading: boolean = false;
  error: any;

  optionView:string = 'all';
  termino:string = '';

  countryDetail = {
    alpha3Code:'',
    name:'',
    region: '',
    population: '',
    capital: '',
    currency: '',
    language: '',
    countries: '',
    flag: '',
    isFavorite:false
  }


  constructor(
    
    private store:Store<AppState>,
    private modalService:NgbModal) { 
  }

  ngOnInit(): void {

    this.favorites = (localStorage.getItem('favorites') !== null ) ? JSON.parse(localStorage.getItem('favorites')) : [];

    this.store.select('countries').subscribe( ({ countries, loading, error }) => {
      this.countries = countries;
      this.groupByRegion(countries as Country [])
      this.loading  = loading;
      this.error    = error;
    });

    this.store.select('search')
      .subscribe( data => {
        this.optionView = data.option;
        this.termino = data.termino;
        this.searching(this.termino);

        if(this.optionView === 'fav'){
          this.filterFavorites(this.termino);
        }
        
      });


    this.store.dispatch( loadCountries() );
  }


  groupByRegion (countries:Country []) {

    countries.forEach((country,index)=>{

      if (country.region && country.name && country.flag) {
        if (country.region.toLowerCase().trim() === 'africa') {
          
          let fav =  this.checkIsFavorite(country);
          this.Africa.push({...country,favorite:fav});
        }
        if (country.region.toLowerCase().trim() === 'americas') {
          let fav =  this.checkIsFavorite(country);
          this.America.push({...country,favorite:fav});
        }
        if (country.region.toLowerCase().trim() === 'asia') {
          let fav =  this.checkIsFavorite(country);
          this.Asia.push({...country,favorite:fav});
        }
        if (country.region.toLowerCase().trim() === 'europe') {
          let fav =  this.checkIsFavorite(country);
          this.Europa.push({...country,favorite:fav});
        }
        if (country.region.toLowerCase().trim() === 'oceania') {
          let fav =  this.checkIsFavorite(country);
          this.Oceania.push({...country,favorite:fav});
        }
      }else{
        
      }
    });
  }

  open(content, country ) {
    
    
    this.countryDetail.alpha3Code  =  country.alpha3Code;
    this.countryDetail.name        =  country.name;
    this.countryDetail.region      =  country.region;
    this.countryDetail.population  =  this.roundPopulation(country.population);
    this.countryDetail.capital     =  country.capital;
    this.countryDetail.currency    =  this.getCurrencies(country.currencies);
    this.countryDetail.language    =  this.getLanguages(country.languages);
    this.countryDetail.countries   =  this.getCountriesBorders(country.borders);
    this.countryDetail.flag        =  country.flag;
    this.countryDetail.isFavorite  =  this.checkIsFavorite(country);

    

    
    this.modalService.open(
      content, 
      {ariaLabelledBy: 'modal-basic-title', centered:true, size:'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  searching(termino:string){
    if(termino.length > 0){     
      this.filterTermByOption(termino,this.optionView);
    }else{
      this.Africa = [];
      this.America = [];
      this.Asia = [];
      this.Europa = [];
      this.Oceania = [];
      this.groupByRegion(this.countries);
    }
  }

  filterTermByOption(term:string, option:string){

    switch (option) {
      case "all":
        this.filterAll(term);
        break;
      case "fav":
        this.filterFavorites(term);
          break;
      case "africa": 
        this.Africa = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === option ));

        this.Africa.forEach((c,i)=>{
          let fav =  this.checkIsFavorite(c);
          this.Africa[i]={...c,favorite:fav};
        });

        break;
      case "americas":
        this.America = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === option )); 

        this.America.forEach((c,i)=>{
          let fav =  this.checkIsFavorite(c);
          this.America[i]={...c,favorite:fav};
        });

          break;
      case "asia":  
        this.Asia = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === option )); 

        this.Asia.forEach((c,i)=>{
          let fav =  this.checkIsFavorite(c);
          this.Asia[i]={...c,favorite:fav};
        });

          break;
      case "europe": 
        this.Europa = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === option ));  

        this.Europa.forEach((c,i)=>{
          let fav =  this.checkIsFavorite(c);
          this.Europa[i]={...c,favorite:fav};
        });

          break;
      case "oceania":
          this.Oceania = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === option ));
          
          this.Oceania.forEach((c,i)=>{
            let fav =  this.checkIsFavorite(c);
            this.Oceania[i]={...c,favorite:fav};
          });

          break;
      default:
        this.filterAll(term);
        break;
    }
  }


  filterAll(term:string){

    this.Africa   = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim())  && c.region.toLowerCase().trim() === "africa"));

    this.Africa.forEach((c,i)=>{

      let fav =  this.checkIsFavorite(c);
      this.Africa[i]={...c,favorite:fav};

    });

    this.America  = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim())  && c.region.toLowerCase().trim() === "americas")); 

    this.America.forEach((c,i)=>{

      let fav =  this.checkIsFavorite(c);
      this.America[i]={...c,favorite:fav};

    });
  
    this.Asia     = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim())  && c.region.toLowerCase().trim() === "asia")); 

    this.Asia.forEach((c,i)=>{

      let fav =  this.checkIsFavorite(c);
      this.Asia[i]={...c,favorite:fav};

    });
  
    this.Europa   = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim())  && c.region.toLowerCase().trim() === "europe"));  

    this.Europa.forEach((c,i)=>{

      let fav =  this.checkIsFavorite(c);
      this.Europa[i]={...c,favorite:fav};

    });
  
    this.Oceania = this.countries.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim())  && c.region.toLowerCase().trim() === "oceania"));   

    this.Oceania.forEach((c,i)=>{

      let fav =  this.checkIsFavorite(c);
      this.Oceania[i]={...c,favorite:fav};

    });

  }

  filterFavorites(term:string){

    if(term.length == 0){

      this.myFavorites = [];

      let f1 = this.Africa.filter( c => c.favorite == true);

      let f2 = this.America.filter( c => c.favorite == true );
      
      let f3 = this.Asia.filter( c => c.favorite == true );

      let f4 = this.Europa.filter( c => c.favorite == true );

      let f5 = this.Oceania.filter( c => c.favorite == true );

      this.myFavorites.push(...f1,...f2,...f3,...f4,...f5);
    }

    

    this.Africa = this.myFavorites.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === "africa"));

    this.America = this.myFavorites.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === "americas" ));

    this.Asia = this.myFavorites.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === "asia" ));

    this.Europa = this.myFavorites.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === "europe" ));

    this.Oceania = this.myFavorites.filter( c => (c.name.toLowerCase().trim().includes( term.toLowerCase().trim()) && c.region.toLowerCase().trim() === "oceania" ));

  }

  getCurrencies (currencies) {
    let currency = ''
    if (currencies.length > 1) {
      for (let j = 0;j < currencies.length;j++) {
        if (currencies[j].name !== null) {
          currency += `${ currencies[j].name }, `
        }
      }

      if (currency.slice(-1) === ' ') {
        currency = `${ currency.slice(0, -2) }`
      }
    } else {
      currency = `${ currencies[0].name } `
    }
    return currency;
  }

  getLanguages (languages) {
    let lenguages = ''
    if (languages.length > 1) {
      for (let j = 0;j < languages.length;j++) {
        if (languages[j].name !== null) {
          lenguages += `${ languages[j].name }, `
        }
      }
      
      if (lenguages.slice(-1) === ' ') {
        lenguages = `${ lenguages.slice(0, -2) }`
      }
    } else {
      lenguages = `${ languages[0].name } `
    }
    return lenguages;
  }

  getCountriesBorders(borders) {
    let countries = ''
    if (borders.length > 0) {
      for (let j = 0;j < borders.length;j++) {

        let result:any =  this.countries.filter( c => (c.alpha3Code === borders[j]) );
        countries +=  `${ result[0].name }, `;
      }

      if (countries.slice(-1) === ' ') {
        countries = `${ countries.slice(0, -2) }`
      }
      
    } else {
      countries = `No have border countries`;
    }
    return countries;
  }

  roundPopulation (num) {
    let population = ''
    if (num >= 1000000) {
      population = `${ Math.round(num / 1000000) } M`
    } else {
      population = '< 1M'
    }
    return population;
  }

  favorite(code:string, active:boolean ){
    if(active){
      
      if(this.favorites.filter(f => f.code === code).length == 0 ){
        this.favorites.push({code:code,active: active});
        localStorage.setItem('favorites',JSON.stringify(this.favorites));
      }

      if(this.countryDetail.alpha3Code === code){
        this.countryDetail.isFavorite = true;
        this.updateFavoriteList(this.countryDetail);
      }

    }else{

      let favs = JSON.parse(localStorage.getItem('favorites'));
      favs = favs.filter(f => f.code !== code);
      this.favorites = favs;

      if(this.countryDetail.alpha3Code === code){
        this.countryDetail.isFavorite = false;
        this.updateFavoriteList(this.countryDetail);
      }

      localStorage.setItem('favorites',JSON.stringify(favs));
      
    }
  }

  checkIsFavorite(country):boolean{
    
    let result = this.favorites.filter( f => f.code === country.alpha3Code);

    return (result.length > 0) ? result[0].active: false;
    
  }

  updateFavoriteList(country){

    let result = this.favorites.filter( f => f.code === country.alpha3Code);

    switch (country.region.toLowerCase().trim()) {
      case "africa": 
        if(result.length > 0){
          let cIndex = this.Africa.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Africa[cIndex].favorite = true;
        }else{
          let cIndex = this.Africa.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Africa[cIndex].favorite = false;
        }
        break;
      case "americas":
        if(result.length > 0){
          let cIndex = this.America.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.America[cIndex].favorite = true;
        }else{
          let cIndex = this.America.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.America[cIndex].favorite = false;
        }
        break;
      case "asia":  
        if(result.length > 0){
          let cIndex = this.Asia.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Asia[cIndex].favorite = true;
        }else{
          let cIndex = this.Asia.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Asia[cIndex].favorite = false;
        }
        break;
      case "europe": 
        if(result.length > 0){
          let cIndex = this.Europa.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Europa[cIndex].favorite = true;
        }else{
          let cIndex = this.Europa.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Europa[cIndex].favorite = false;
        }
        break;
      case "oceania":
        if(result.length > 0){
          let cIndex = this.Oceania.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Oceania[cIndex].favorite = true;
        }else{
          let cIndex = this.Oceania.findIndex(c => c.alpha3Code == country.alpha3Code);
          this.Oceania[cIndex].favorite = false;
        }
        break;
      default:
        
        break;
    }
  }
}
