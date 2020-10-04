import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { PopoverModule } from "ngx-bootstrap/popover";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from '@angular/material/expansion';
// import {MatAccordionModule} from "@angular/material/"

import { ProfilepageComponent } from "./examples/profilepage/profilepage.component";
import { LandingpageComponent } from "./examples/landingpage/landingpage.component";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutUsComponent } from './examples/about-us/about-us.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    SlickCarouselModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatExpansionModule
  ],
  declarations: [
    ProfilepageComponent,
    LandingpageComponent,
    LandingPageComponent,
    AboutUsComponent,

  ],
  entryComponents: [
  ],
  exports: [
    ProfilepageComponent,
    LandingpageComponent,
  ],
  providers: [MatSnackBar]
})
export class PagesModule { }
