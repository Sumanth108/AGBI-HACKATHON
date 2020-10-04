import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';
// import { AgmCoreModule } from '@agm/core';
// import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatTabsModule } from '@angular/material/tabs';
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
import { MatMenuModule } from "@angular/material/menu"
import { PagesModule } from "./pages/pages.module";
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ForumsComponent } from './forums/forums.component';
import { ChatComponent } from './chat/chat.component';
import { ConsultAiComponent } from './consult-ai/consult-ai.component';
import { GetNearbyDoctorsComponent } from './get-nearby-doctors/get-nearby-doctors.component';
import { MatSliderModule } from '@angular/material/slider';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { RequestFormComponent } from './get-nearby-doctors/request-form/request-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
const agoraConfig: AgoraConfig = {
  AppID: 'c81e827b39a04dbfa796faba63eabb91',
};
@NgModule({
  declarations: [
    AppComponent,
    // IndexComponent,
    // ProfilepageComponent,
    // RegisterpageComponent,
    // LandingpageComponent,
    LoginRegisterComponent,
    ForumsComponent,
    ChatComponent,
    ConsultAiComponent,
    GetNearbyDoctorsComponent,
    VideoChatComponent,
    RequestFormComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    // ProgressbarModule.forRoot(),
    // TooltipModule.forRoot(),
    // CollapseModule.forRoot(),
    // TabsModule.forRoot(),
    PagesModule,
    // PaginationModule.forRoot(),
    // AlertModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    // CarouselModule.forRoot(),
    // ModalModule.forRoot()
    CommonModule,
    BrowserModule,
    MatMenuModule,
    CollapseModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    AngularAgoraRtcModule.forRoot(agoraConfig),
    MatTabsModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [
    LoginRegisterComponent,
    RequestFormComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
