import { Injectable } from '@angular/core';
import { LoginRegisterComponent } from './login-register/login-register.component'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class GlobalUserServiceService {

  constructor(private dialog: MatDialog,
    private breakPointObserver: BreakpointObserver,
    public router: Router) {

  }
  loggedIn: Boolean = false;
  userToken: String;
  username: String = '';
  user_id: String;
  userObj: any;

  setUserDetails(userData: any) {
    this.loggedIn = userData.success;
    this.username = userData.user.username;
    this.userToken = userData.token;
    this.user_id = userData.user._id;
    this.userObj = userData.user;
    this.setUserDetailsToFromLocalStorage();
  }

  setUserDetailsToFromLocalStorage() {
    if (localStorage.getItem('userdata')) {
      let temp_userdata = JSON.parse(localStorage.getItem('userdata'));
      if (temp_userdata.loggedIn == '1') {
        this.loggedIn = true;
        this.username = temp_userdata.username;
        this.userToken = temp_userdata.usertoken;
        this.user_id = temp_userdata.user_id;
        this.userObj = temp_userdata.userObj;
      }
    }
    let user = {
      "loggedIn": this.loggedIn ? '1' : '0',
      "username": this.username,
      "usertoken": this.userToken,
      "user_id": this.user_id,
      "userObj": this.userObj,
    }
    localStorage.setItem("userdata", JSON.stringify(user));
  }

  getUserLoginStatus() {
    console.log('called getUserLoginStatus');
    if (localStorage.getItem('userdata')) {
      let temp_userdata = JSON.parse(localStorage.getItem('userdata'));
      this.loggedIn = temp_userdata.loggedIn;
      this.userToken = temp_userdata.usertoken;
      this.username = temp_userdata.username;
      this.user_id = temp_userdata.user_id;
      this.userObj = temp_userdata.userObj;
    }
    return this.loggedIn;
  }
  getUsername() {
    console.log('called getUsername');
    if (localStorage.getItem('userdata')) {
      let temp_userdata = JSON.parse(localStorage.getItem('userdata'));
      this.loggedIn = temp_userdata.loggedIn;
      this.userToken = temp_userdata.usertoken;
      this.username = temp_userdata.username;
    }
    return this.username;
  }
  logout() {
    this.loggedIn = false;
    this.username = '';
    this.userToken = '';
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
  openLoginRegisterComponent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    this.breakPointObserver.observe([
      '(min-width: 1024px)'
    ]).subscribe(
      result => {
        if (result.matches) {
          console.log('screen is greater than  1024px');
          dialogConfig.minWidth = '50vw';
          dialogConfig.minHeight = '50vh';
          dialogConfig.disableClose = false;
        } else {
          console.log('screen is less than  1024px');
          dialogConfig.minWidth = '90vw';
          dialogConfig.maxHeight = '90vh';
          dialogConfig.disableClose = true;
        }
      }
    );
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(LoginRegisterComponent, dialogConfig);
    return dialogRef.afterClosed();
  }
}
