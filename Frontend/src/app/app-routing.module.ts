import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { AboutUsComponent } from "./pages/examples/about-us/about-us.component";
import { ForumsComponent } from "./forums/forums.component";
import { ChatComponent } from './chat/chat.component';
import { ConsultAiComponent } from './consult-ai/consult-ai.component';
import { GetNearbyDoctorsComponent } from './get-nearby-doctors/get-nearby-doctors.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: LandingPageComponent },
  { path: "forums", component: ForumsComponent },
  { path: "aboutus", component: AboutUsComponent },
  { path: "profile", component: ProfilepageComponent },
  { path: "landing", component: LandingpageComponent },
  { path: "consult-ai", component: ConsultAiComponent },
  { path: 'getNearbyDocs', component: GetNearbyDoctorsComponent },
  { path: 'videoChat/:shit', component: VideoChatComponent },
  { path: 'userProfile', component: ProfilepageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule { }
