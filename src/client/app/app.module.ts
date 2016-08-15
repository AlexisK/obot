import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent}  from './app.component';
import {routing, appRoutingProviders} from './app.routing';

@NgModule({
  imports      : [BrowserModule, routing],
  declarations : [AppComponent],
  providers    : [HTTP_PROVIDERS, appRoutingProviders, {provide : LocationStrategy, useClass : HashLocationStrategy}],
  bootstrap    : [AppComponent]
})
export class AppModule {
}
