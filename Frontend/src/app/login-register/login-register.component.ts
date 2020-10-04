import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SnackService } from './../services/snack.service'
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { timeout, retry, catchError, shareReplay, debounceTime } from "rxjs/operators";
import { GlobalUserServiceService } from '../global-user-service.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  dialogData: any;
  registerForm: FormGroup;
  loginForm: FormGroup;
  DoctorRegisterForm: FormGroup;
  registrationNumber;
  //change these urls after deployment of backend.
  urlRegister = 'https://prototype-agbi-hackathon.herokuapp.com/api/register';
  urlLogin = 'https://prototype-agbi-hackathon.herokuapp.com/api/login';
  newUser: boolean = false;
  currentLocation = '';
  currentLocationDoc = '';
  latitude = '';
  longitude = '';
  isRegValid = false;
  whosHere = new BehaviorSubject<string>('oldUser');
  whosHere$: Observable<string> = this.whosHere.asObservable().pipe(
    shareReplay()
  );
  constructor(
    public dialogRef: MatDialogRef<LoginRegisterComponent>, @Inject(MAT_DIALOG_DATA) data,
    private _formBuilder: FormBuilder,
    private snackbar: SnackService,
    private http: HttpClient,
    public globalUserService: GlobalUserServiceService,
  ) {
    this.dialogData = data;
    this.registrationNumber = new FormControl(null);
    this.registerForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      email: ['', Validators.email],
      lat: [Number, Validators.required],
      long: [Number, Validators.required],
    });
    this.DoctorRegisterForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      email: ['', Validators.email],
      lat: [Number, Validators.required],
      long: [Number, Validators.required],
      isDoctor: [Boolean],
    });
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.registrationNumber.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      //hit the mci open rest api
      this.http.get(`https://mciindia.org/MCIRest/open/getPaginatedData?service=getPaginatedDoctor&draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=500&search%5Bvalue%5D=&search%5Bregex%5D=false&name=&registrationNo=${value}&smcId=13&year=&_=1600711009535`)
        .subscribe((response: any) => {
          console.log(response);
          if (response.recordsFiltered === 1) {
            console.log(response.data[0][4], response.data[0][5]);
            this.DoctorRegisterForm.patchValue({
              username: 'DR. ' + response.data[0][4],
            });
            this.isRegValid = true;
          }
        });
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  changeWhosHere(hereNow: string) {
    this.whosHere.next(hereNow);
    this.latitude = '';
    this.longitude = '';
    this.currentLocation = '';
    this.DoctorRegisterForm.reset();
    this.loginForm.reset();
    this.registerForm.reset();
    this.registrationNumber.reset();
  }
  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLocation(position);
      });
      setTimeout(() => {
        this.getCurrentLocationReverse();
      }, 1500);
    }
  }
  setLocation(position) {
    console.log('setLocation called', position.coords.latitude, position.coords.longitude);
    this.latitude = String(position.coords.latitude);
    this.longitude = String(position.coords.longitude);
    console.log(this.latitude, this.longitude)
    this.registerForm.patchValue({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  }
  getCurrentLocationReverse() {
    console.log(this.latitude, this.longitude);
    this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.latitude}%2C%20${this.longitude}&key=7a0d708a4f2e407d9bee3ce3e77737d9&language=en&pretty=1`).subscribe(
      (response: any) => {
        console.log(response);
        this.currentLocation = response.results[0].formatted;
      }
    )
  }
  getCurrentLocationForward() {
    let sendLocation = this.currentLocation.split(' ').join('%20');
    console.log(sendLocation);
    this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${sendLocation}&key=7a0d708a4f2e407d9bee3ce3e77737d9&language=en&pretty=1`).subscribe(
      (response: any) => {
        console.log(response);
        this.currentLocation = response.results[0].formatted;
        this.registerForm.patchValue({
          lat: response.results[0].geometry.lat,
          long: response.results[0].geometry.lng,
        })
      })
  }
  getGeolocationDoc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLocationDoc(position);
      });
      setTimeout(() => {
        this.getCurrentLocationReverse();
      }, 1500);
    }
  }
  setLocationDoc(position) {
    console.log('setLocation called', position.coords.latitude, position.coords.longitude);
    this.latitude = String(position.coords.latitude);
    this.longitude = String(position.coords.longitude);
    console.log(this.latitude, this.longitude)
    this.DoctorRegisterForm.patchValue({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  }
  getCurrentLocationReverseDoc() {
    console.log(this.latitude, this.longitude);
    this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.latitude}%2C%20${this.longitude}&key=7a0d708a4f2e407d9bee3ce3e77737d9&language=en&pretty=1`).subscribe(
      (response: any) => {
        console.log(response);
        this.currentLocationDoc = response.results[0].formatted;
      }
    )
  }
  getCurrentLocationForwardDoc() {
    let sendLocation = this.currentLocationDoc.split(' ').join('%20');
    console.log(sendLocation);
    this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${sendLocation}&key=7a0d708a4f2e407d9bee3ce3e77737d9&language=en&pretty=1`).subscribe(
      (response: any) => {
        console.log(response);
        this.currentLocationDoc = response.results[0].formatted;
        this.DoctorRegisterForm.patchValue({
          lat: response.results[0].geometry.lat,
          long: response.results[0].geometry.lng,
        })
      })
  }
  //when user registers
  submitFormRegister() {
    console.log(this.registerForm.value);

    //Validation performed
    if (this.registerForm.valid && this.registerForm.value.passwordConfirm == this.registerForm.value.password) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.http.post(this.urlRegister, JSON.stringify(this.registerForm.value), { headers }).pipe(
        timeout(5000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          this.closeDialog();
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.snackbar.openSnackBar('Registered Succesfully!!!', 'OKAY');
          this.globalUserService.setUserDetails(response);
          this.closeDialog();
          //redirect to users profile
        }
        else if (response.message) {
          this.snackbar.openSnackBar(response.message, 'OKAY');
        }
        else {
          this.snackbar.openSnackBar('Registration Unsuccessful, Try again after sometime', 'OKAY');
        }

      }, (error: any) => {
        this.snackbar.openSnackBar('Some Error Occurred, please try after some time....', 'OKAY');
        console.log(error);
        this.closeDialog();
      });
    }
    else if (this.registerForm.value.passwordConfirm == this.registerForm.value.password && this.registerForm.value.lat && this.registerForm.invalid) {
      this.snackbar.openSnackBar('Please Enter a valid email', 'OKAY');
    }
    else if (this.registerForm.value.passwordConfirm != this.registerForm.value.password && this.registerForm.valid) {
      this.snackbar.openSnackBar('The Entered Passwords Do not match!!', 'OKAY');
    }
    else if (this.registerForm.value.passwordConfirm == this.registerForm.value.password && this.registerForm.invalid) {
      this.snackbar.openSnackBar('One or More Feilds have been entered incorrectly!!!', 'OKAY');
    }
    else {
      this.snackbar.openSnackBar('Some Unknown Problem Occurred...Try After Sometime', 'OKAY');
    }
  }
  submitDoctorFormRegister() {
    console.log(this.DoctorRegisterForm.value);
    this.DoctorRegisterForm.patchValue({
      isDoctor: true,
    })
    //Validation performed
    if (this.DoctorRegisterForm.valid && this.DoctorRegisterForm.value.passwordConfirm == this.DoctorRegisterForm.value.password) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.http.post(this.urlRegister, JSON.stringify(this.DoctorRegisterForm.value), { headers }).pipe(
        timeout(7000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          this.closeDialog();
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.snackbar.openSnackBar('Registered Succesfully!!!', 'OKAY');
          this.globalUserService.setUserDetails(response);
          this.storeDoctorDetails();
          this.closeDialog();
          //redirect to users profile
        }
        else if (response.message) {
          this.snackbar.openSnackBar(response.message, 'OKAY');
        }
        else {
          this.snackbar.openSnackBar('Registration Unsuccessful, Try again after sometime', 'OKAY');
        }

      }, (error: any) => {
        this.snackbar.openSnackBar('Some Error Occurred, please try after some time....', 'OKAY');
        console.log(error);
        this.closeDialog();
      });
    }
    else if (this.registerForm.value.passwordConfirm == this.registerForm.value.password && this.registerForm.value.lat && this.registerForm.invalid) {
      this.snackbar.openSnackBar('Please Enter a valid email', 'OKAY');
    }
    else if (this.registerForm.value.passwordConfirm != this.registerForm.value.password && this.registerForm.valid) {
      this.snackbar.openSnackBar('The Entered Passwords Do not match!!', 'OKAY');
    }
    else if (this.registerForm.value.passwordConfirm == this.registerForm.value.password && this.registerForm.invalid) {
      this.snackbar.openSnackBar('One or More Feilds have been entered incorrectly!!!', 'OKAY');
    }
    else {
      this.snackbar.openSnackBar('Some Unknown Problem Occurred...Try After Sometime', 'OKAY');
    }
  }
  storeDoctorDetails() {
    let details = {
      "name": this.DoctorRegisterForm.value.username,
      "isOnline": true,
      "lat": Number(this.DoctorRegisterForm.value.lat),
      "long": Number(this.DoctorRegisterForm.value.long),
      "formattedAddress": String(this.currentLocationDoc),
    };
    this.http.post(`https://prototype-agbi-hackathon.herokuapp.com/api/saveDoctorDetails`, details).subscribe((response: any) => {
      if (response.success) {
        console.log('doctor details saved success fully');
      }
    });
  }
  //when user logs - in
  submitFormLogin() {
    console.log(this.loginForm.value);
    //Validation performed
    if (this.loginForm.valid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post(this.urlLogin, JSON.stringify(this.loginForm.value), { headers }).pipe(
        timeout(5000), retry(2), catchError((err) => {
          this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
          this.closeDialog();
          throw new Error('Server Timeout' + err);
        })
      ).subscribe((response: any) => {
        console.log(response);
        if (response.success) {
          this.snackbar.openSnackBar('Logged In Succesfully!!!', 'OKAY');
          this.globalUserService.setUserDetails(response);
          this.closeDialog();
          //redirect to users profile
        }
        else if (response.message) {
          this.snackbar.openSnackBar(response.message, 'OKAY');
        }
        else {
          this.snackbar.openSnackBar('Login Unsuccessful, Try again after sometime', 'OKAY');
        }

      }, (error: any) => {
        this.snackbar.openSnackBar('Some Error Occurred, please try after some time....', 'OKAY');
        console.log(error);
        this.closeDialog();
      });
    }
    else {
      this.snackbar.openSnackBar('Please enter valid details', 'OKAY');
    }
  }
}
