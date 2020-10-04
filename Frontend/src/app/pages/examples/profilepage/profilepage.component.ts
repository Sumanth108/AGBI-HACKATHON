import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { GlobalUserServiceService } from 'src/app/global-user-service.service';
import * as moment from 'moment';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html",
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  constructor(public globalUserService: GlobalUserServiceService,
    public http: HttpClient,
    private router: Router) { }

  posts: any = [];
  requests: any = [];
  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.globalUserService.setUserDetailsToFromLocalStorage();
    this.getPostByUser(String(this.globalUserService.username));
    if (!this.globalUserService.userObj.isDoctor)
      this.getRequestsByUser(String(this.globalUserService.user_id));
    else
      this.getRequestsOfDoctor(String(this.globalUserService.username));
  }
  getPostByUser(username: string) {
    this.http.get(`https://prototype-agbi-hackathon.herokuapp.com/api/user/${username}/posts/`).subscribe((response: any) => {
      if (response) {
        this.posts = response.posts;
      }
    });
  }
  getRequestsByUser(userId: string) {
    this.http.get(`https://prototype-agbi-hackathon.herokuapp.com/api/user/${userId}/requests`).subscribe((response: any) => {
      if (response) {
        this.requests = response.requests;
      }
    });
  }
  getRequestsOfDoctor(userId: string) {
    this.http.get('https://prototype-agbi-hackathon.herokuapp.com/api/user/' + userId + '/requestsTo').subscribe((response: any) => {
      if (response) {
        this.requests = response.requests;
      }
    });
  }
  updateRequest(update: string, request: any) {
    console.log(request, update);
    let reqBody = {
      "_id": request._id,
      "update": update
    }
    this.http.post('https://prototype-agbi-hackathon.herokuapp.com/api/updateRequest', reqBody).subscribe((response: any) => {
      if (response.success) {
        this.requests[this.requests.indexOf(request)] = response.updatedRecord[0];
      }
    });
  }
  getSecondsLeft(date: string) {
    console.log('sonem')
    let datea = new Date(date);
    let a = moment(datea);
    let b = moment();
    let seconds = b.diff(a, 'days');
    return seconds;
  }
  setAgo(date: string) {
    let a = new Date(date);
    return a.getDay();
  }
  setRequestStatus(request: any) {
    if (!request.isAccepted && !request.isRejected) {
      return 'Pending';
    }
    else if (request.isRejected) return 'Rejected';
    else return 'Accepted';
  }
  setSubmited(createdDate: string) {
    return moment(createdDate).fromNow()
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }
  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  goToVideoChat(id: string) {
    this.router.navigateByUrl(`videoChat/${id}`);
  }
}
