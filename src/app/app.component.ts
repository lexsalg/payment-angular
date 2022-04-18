import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './api.service';

import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  countries: string[] = []
  salesRegion: string[] = []
  states: any[] = []

  price = '';

  constructor(private fb: FormBuilder, private api: ApiService, private transloco: TranslocoService) {
    this.initForm();

  }


  ngOnInit(): void {

    const lang = localStorage.getItem('lang') || 'es';
    this.transloco.setActiveLang(lang);
    this.api.getFakeCountries().subscribe(res => this.countries = res);
    this.api.getSalesRegion().subscribe(res => this.salesRegion = res);
    this.api.getStates('Brazil').subscribe(res => this.states = res);
    this.changeCountry();
  }

  initForm() {
    let country = 'Peru';
    if (localStorage.getItem('country')) {
      country = localStorage.getItem('country') || 'Peru';
    }
    this.form = this.fb.group({
      country: [country, Validators.required],
      name: ['', Validators.required],
      priceBase: [0, Validators.required],
      region: ['', Validators.required],
      stateOrigin: ['', Validators.required],
      stateSale: ['', Validators.required],
    });
  }

  changeCountry() {
    this.form.get('country')?.valueChanges.subscribe(country => {
      localStorage.setItem('country', country)
      const lang = country == 'Peru' ? 'es' : 'pr';
      localStorage.setItem('lang', lang)
      this.form.patchValue({
        region: '',
        stateOrigin: '',
        stateSale: '',
      });
      window.location.reload();
    });
  }

  calculate() {
    this.api.calculatePrice(this.form.value).subscribe((res: any) => {
      this.price = res?.sales_price
    })


  }




}
