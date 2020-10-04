import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GlobalUserServiceService } from '../global-user-service.service';
import { DataFilteringService } from './data-filtering.service';
import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import * as moment from 'moment';
import { timeout, retry, catchError, debounceTime } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSidenav } from '@angular/material/sidenav'
import { SnackService } from '../services/snack.service';

// import 'rxjs/add/operator/debounceTime';
@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.scss']
})
export class ForumsComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  urlAllPosts = 'https://prototype-agbi-hackathon.herokuapp.com/api/posts/all';
  submitNewPostUrl = 'https://prototype-agbi-hackathon.herokuapp.com/api/posts/new';
  posts = [];
  postsSideBar = [];
  input;
  searchBtn;
  loadLimit = 2;

  searchControl: FormControl;
  searching: boolean;
  submittingPost: boolean;
  postForm: FormGroup;
  newComment: FormControl;
  postToShow: any = null;
  @ViewChild('sidenav1') public sidenav1: MatSidenav;
  @ViewChild('sidenav2') public sidenav2: MatSidenav;

  constructor(public globalUserService: GlobalUserServiceService,
    private http: HttpClient,
    public dataFiltering: DataFilteringService,
    public _formBuilder: FormBuilder,
    public snackbar: SnackService
  ) {
    this.searchControl = new FormControl();
    this.newComment = new FormControl();
    this.postForm = this._formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(12), Validators.maxLength(70)])],
      text: ['', Validators.compose([Validators.minLength(45), Validators.maxLength(600)])],
      created: [''],
      author: [''],
      username: [''],
    });
  }

  ngOnInit(): void {
    this.isCollapsed = false;
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.globalUserService.setUserDetailsToFromLocalStorage();
    this.searching = true;
    this.submittingPost = false;
    this.getAllPosts();
    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe(search => {
      this.posts = this.dataFiltering.filterPosts(this.searchControl.value);
      this.searching = false;
    });
  }
  ngAfterViewInit() {
    this.input = document.getElementById("search-input");
    this.searchBtn = document.getElementById("search-btn");
    //console.log("search Bar Done");
  }
  setPostFormValues() {
    this.postForm.patchValue({
      title: this.postForm.value.title.trim(),
      text: this.postForm.value.text.trim(),
      created: Date.now(),
      author: this.globalUserService.user_id,
      username: this.globalUserService.username,
    })
  }
  setSubmited(createdDate: string) {
    return moment(createdDate).fromNow()
  }
  setPostContent(content: string): string {
    let cunt = content.split(' ');
    return cunt[0] + ' ' + cunt[1] + ' ' + cunt[2] + '. . . . . .';
  }
  searchButtonBeauty() {
    this.searchBtn.classList.toggle("close");
    this.input.classList.toggle("square");
    this.searchControl.patchValue('');
  }
  getAllPosts() {
    this.http.get(this.urlAllPosts).pipe(
      debounceTime(1000), timeout(10000), retry(3), catchError((err) => {
        throw new Error('Server Timeout' + err);
      })
    ).subscribe((response: any) => {
      if (response.success) {
        this.posts = response.data;
        this.postsSideBar = response.data.slice(0, 6);
        console.log(this.posts);
        this.dataFiltering.setPostList(this.posts);
        this.searching = false;
      }
    }, (error: any) => {
      console.log('Error occurred while fetching all posts' + error);
      this.searching = false;
    });
  }
  get f() {
    return this.postForm.controls;
  }
  submitPost() {
    this.setPostFormValues();
    console.log(this.postForm.value);
    if (this.postForm.valid) {
      this.submittingPost = true;
      setTimeout(() => {
        console.log('submitting post');
      }, 3000);

      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.globalUserService.userToken,
        'Content-Type': 'application/json'
      });
      this.http.post(this.submitNewPostUrl, JSON.stringify(this.postForm.value), { headers }).pipe(
        debounceTime(1500), timeout(4000), retry(3), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          this.sidenav1.toggle();
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.snackbar.openSnackBar('Post Submitted Succesfully!!!', 'OKAY');
          this.posts.push(response.post);
          console.log(this.posts);
          this.submittingPost = false;
          console.log(response.post);
          this.postForm.patchValue({
            title: '',
            text: '',
            created: '',
            author: '',
            username: '',
          });
          this.getSinglePost(response.post._id);
          this.sidenav1.toggle();
          setTimeout(() => {
            this.sidenav2.open();
          }, 1000);
        }
        else if (response.tokenExpired) {
          this.snackbar.openSnackBar('Your Authorisation token has expired,please login again', 'OKAY');
          this.globalUserService.logout();
          this.submittingPost = false;
          this.globalUserService.openLoginRegisterComponent();
        }
        else {
          this.snackbar.openSnackBar('Post Submission Unsuccessful, Try again after sometime', 'OKAY');
          this.submittingPost = false;
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Some Error Occurred, please try after some time....', 'OKAY');
        console.log(error);
        this.submittingPost = false;
      });
    }
    else {
      this.snackbar.openSnackBar('some or more fields are invalid', 'OKAY');
    }
  }
  getSinglePost(post_id: string) {
    if (post_id) {
      this.sidenav2.toggle();
      this.http.get(`https://prototype-agbi-hackathon.herokuapp.com/api/post/${post_id}/single`).pipe(
        debounceTime(500), timeout(1500), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          this.sidenav2.toggle();
          throw new Error('Server Timeout' + err);
        })).subscribe((response: any) => {
          if (response.success) {

            setTimeout(() => {
              console.log('found post', response);
              this.postToShow = response;
            }, 2000);
          }
          else if (response.message) {
            this.snackbar.openSnackBar(response.message, 'OKAY');
            this.sidenav2.toggle();
          }
        }, (error: any) => {
          this.snackbar.openSnackBar('Something Went Wrong...try again later', 'OKAY');
        });
    }
  }
  postComment() {
    if (this.newComment.value) {
      let commentObject = {
        comment: this.newComment.value.trim(),
        author: this.globalUserService.user_id,
        username: this.globalUserService.username,
        post: this.postToShow.post._id,
        upvotedby: this.globalUserService.user_id,
        created: Date.now()
      };
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.globalUserService.userToken,
        'Content-Type': 'application/json'
      })
      console.log(commentObject);
      console.log(this.globalUserService.userToken);
      this.http.post('https://prototype-agbi-hackathon.herokuapp.com/api/post/${postId}/comment', JSON.stringify(commentObject), { headers }).pipe(
        debounceTime(500), timeout(3000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.snackbar.openSnackBar('Commented Succesfully!!!', 'OKAY');
          this.postToShow.comments = [response.comment, ...this.postToShow.comments];
          console.log(this.postToShow.comments);
          this.newComment.patchValue('');
          //this.posts.push(response.post);
          //console.log(this.posts);
          // let posts = [...this.posts];// creating a shallow copy of the posts array

        }
        else if (response.tokenExpired) {
          this.snackbar.openSnackBar('Your Authorisation token has expired,please login again', 'OKAY');
          this.globalUserService.logout();
          this.globalUserService.openLoginRegisterComponent();
        }
        else {
          this.snackbar.openSnackBar('Comment Submission Unsuccessful, Try again after sometime', 'OKAY');
          //this.submittingPost = false;
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Some Error Occurred, please try after some time....', 'OKAY');
        console.log(error);
        //this.submittingPost = false;
      });

    }
  }
  upvotePost(post) {
    if (this.globalUserService.loggedIn) {
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.globalUserService.userToken,
        'Content-Type': 'application/json'
      });
      this.http.put(`https://prototype-agbi-hackathon.herokuapp.com/api/post/${post._id}/upvote`, JSON.stringify({ userId: this.globalUserService.user_id }), { headers }).pipe(
        debounceTime(500), timeout(2000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        if (response.success) {
          if (post.downvotedby.includes(this.globalUserService.user_id)) {

            this.posts[this.posts.indexOf(post)].downvotedby.splice(
              this.posts[this.posts.indexOf(post)].downvotedby.indexOf(this.globalUserService.user_id));

          }
          console.log(response);
          this.posts[this.posts.indexOf(post)].score = response.post.score;
          this.posts[this.posts.indexOf(post)].upvotedby.push(this.globalUserService.user_id);
          this.snackbar.openSnackBar('Upvoted Post By ' + post.username, 'OKAY');
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Couldn\'t Upvote', 'OKAY');
      });
    }
    else {
      this.snackbar.openSnackBar('Please login or register to upvote!', 'OKAY');
      this.globalUserService.openLoginRegisterComponent();
    }
  }
  downvotePost(post) {
    if (this.globalUserService.loggedIn) {
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.globalUserService.userToken,
        'Content-Type': 'application/json'
      });
      this.http.put(`https://prototype-agbi-hackathon.herokuapp.com/api/post/${post._id}/downvote`, JSON.stringify(this.globalUserService.userObj), { headers }).pipe(
        debounceTime(500), timeout(2000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        if (response.success) {
          if (post.upvotedby.includes(this.globalUserService.user_id)) {

            this.posts[this.posts.indexOf(post)].upvotedby.splice(
              this.posts[this.posts.indexOf(post)].upvotedby.indexOf(this.globalUserService.user_id));
          }
          console.log(response);
          this.posts[this.posts.indexOf(post)].score = response.post.score;
          this.posts[this.posts.indexOf(post)].downvotedby.push(this.globalUserService.user_id);
          this.snackbar.openSnackBar('Downvoted Post By ' + post.username, 'OKAY');
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Couldn\'t Downvote', 'OKAY');
      });
    }
    else {
      this.snackbar.openSnackBar('Please login or register to downvote!', 'OKAY');
      this.globalUserService.openLoginRegisterComponent();
    }
  }
  upvoteComment(comment) {
    console.log("niggga");
    if (this.globalUserService.loggedIn) {
      console.log("niggga");
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.globalUserService.userToken,
        'Content-Type': 'application/json'
      });
      this.http.put(`https://prototype-agbi-hackathon.herokuapp.com/api/comment/${comment._id}/upvote`, JSON.stringify(this.globalUserService.userObj), { headers }).pipe(
        debounceTime(500), timeout(2000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        if (response.success) {
          if (comment.downvotedby.includes(this.globalUserService.user_id)) {
            this.postToShow.comments[this.postToShow.comments.indexOf(comment)].downvotedby.splice(
              this.postToShow.comments[this.postToShow.comments.indexOf(comment)].downvotedby.indexOf(this.globalUserService.user_id));
          }
          console.log(response);
          this.postToShow.comments[this.postToShow.comments.indexOf(comment)].score = response.comment.score;
          this.postToShow.comments[this.postToShow.comments.indexOf(comment)].upvotedby.push(this.globalUserService.user_id);
          //this.postToShow.comments[this.postToShow.comments.indexOf(response.comment)] = response.comment;
          this.snackbar.openSnackBar('Upvoted comment By ' + comment.username, 'OKAY');
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Couldn\'t Upvote', 'OKAY');
      });
    }
    else {
      this.snackbar.openSnackBar('Please login or register to upvote!', 'OKAY');
      this.globalUserService.openLoginRegisterComponent();
    }
  }
  downvoteComment(comment) {
    if (this.globalUserService.loggedIn) {
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.globalUserService.userToken,
        'Content-Type': 'application/json'
      });
      this.http.put(`https://prototype-agbi-hackathon.herokuapp.com/api/comment/${comment._id}/downvote`, JSON.stringify(this.globalUserService.userObj), { headers }).pipe(
        debounceTime(500), timeout(2000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        if (response.success) {
          if (comment.upvotedby.includes(this.globalUserService.user_id)) {
            this.postToShow.comments[this.postToShow.comments.indexOf(comment)].upvotedby.splice(
              this.postToShow.comments[this.postToShow.comments.indexOf(comment)].upvotedby.indexOf(this.globalUserService.user_id));
          }
          console.log(response);
          this.postToShow.comments[this.postToShow.comments.indexOf(comment)].score = response.comment.score;
          this.postToShow.comments[this.postToShow.comments.indexOf(comment)].downvotedby.push(this.globalUserService.user_id);
          this.snackbar.openSnackBar('Downvoted comment By ' + comment.username, 'OKAY');
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Couldn\'t Downvote', 'OKAY');
      });
    }
    else {
      this.snackbar.openSnackBar('Please login or register to downvote!', 'OKAY');
      this.globalUserService.openLoginRegisterComponent();
    }
  }
  deleteComment(comment) {
    if (this.globalUserService.loggedIn) {
      let options = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.globalUserService.userToken,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(this.globalUserService.userObj),
      };
      this.http.delete(`https://prototype-agbi-hackathon.herokuapp.com/api/post/${comment._id}/comment`, options).pipe(
        debounceTime(500), timeout(2000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        if (response.success) {
          console.log(response);
          this.postToShow.comments.splice(this.postToShow.comments.indexOf(comment), 1);
        }
      }, (error: any) => {
        this.snackbar.openSnackBar('Couldn\'t Delete', 'OKAY');
      });
    }
  }
  loadMore() {
    if (this.loadLimit < 5)
      this.loadLimit++;
  }
  loadLess() {
    if (this.loadLimit > 2)
      this.loadLimit--;
  }
  toggleDrawer() {
    this.sidenav1.toggle();
  }
  backToAllPosts() {
    this.sidenav2.toggle();
    this.postToShow = null;
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

}
