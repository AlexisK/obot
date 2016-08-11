import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent}  from './app.component';
import {routing, appRoutingProviders} from './app.routing';

@NgModule({
  imports      : [BrowserModule, routing],
  declarations : [AppComponent],
  providers    : [HTTP_PROVIDERS, appRoutingProviders],
  bootstrap    : [AppComponent]
})
export class AppModule {
}
