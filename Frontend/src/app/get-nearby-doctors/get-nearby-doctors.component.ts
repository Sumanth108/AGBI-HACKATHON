import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, scan } from 'rxjs/operators';
import { GlobalUserServiceService } from '../global-user-service.service';
import { LoginRegisterComponent } from '../login-register/login-register.component';
import { SnackService } from '../services/snack.service';
import { RequestFormComponent } from './request-form/request-form.component';

@Component({
  selector: 'app-get-nearby-doctors',
  templateUrl: './get-nearby-doctors.component.html',
  styleUrls: ['./get-nearby-doctors.component.scss']
})
export class GetNearbyDoctorsComponent implements OnInit {

  isCollapsed = true;
  page = 0;
  maxValOfPageReached = 0;
  nearForm: FormGroup;
  constructor(public globalUserService: GlobalUserServiceService,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private snackbar: SnackService,
    private breakPointObserver: BreakpointObserver,
    private dialog: MatDialog) {
    this.nearForm = this._formBuilder.group({
      Address: ['', Validators.required],
      Radius: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required]
    });
  }
  loading = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loading.asObservable();

  disableNext = new BehaviorSubject<boolean>(true);
  disableNext$: Observable<boolean> = this.disableNext.asObservable();

  resultsOver = new BehaviorSubject<boolean>(false);
  resultsOver$: Observable<boolean> = this.resultsOver.asObservable();

  results = new BehaviorSubject<doctorDetails[][]>([]);
  results$: Observable<doctorDetails[][]>;

  resultsOnline = new BehaviorSubject<doctorDetails[]>([]);
  resultsOnline$: Observable<doctorDetails[]> = this.resultsOnline.asObservable();

  disabledRequestBtns: number[] = [];
  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.globalUserService.setUserDetailsToFromLocalStorage();
    this.initResults();
    this.nearForm.get('Address').valueChanges.pipe(debounceTime(2500)).subscribe((data) => {
      console.log(data);
      //this.getCurrentLocationForward();
    });
    this.getOnlineDoctors();
  }
  ngAfterViewInit() {
    if (!this.globalUserService.loggedIn) {
      this.snackbar.openSnackBar('Please login or register to continue', 'OKAY')
      this.globalUserService.openLoginRegisterComponent().subscribe((data) => {
        console.log('dialog closed');
        this.getLocationReverse(this.globalUserService.userObj.lat, this.globalUserService.userObj.long).subscribe(
          (response: any) => {
            console.log(response);
            this.nearForm.patchValue({
              Address: response.results[0].formatted,
              Radius: '4',
              lat: this.globalUserService.userObj.lat,
              long: this.globalUserService.userObj.long,
            });
          }
        )
      });
    }
    else {
      this.getLocationReverse(this.globalUserService.userObj.lat, this.globalUserService.userObj.long).subscribe(
        (response: any) => {
          console.log(response);
          this.nearForm.patchValue({
            Address: response.results[0].formatted,
            Radius: '4',
            lat: this.globalUserService.userObj.lat,
            long: this.globalUserService.userObj.long,
          });
        }
      )
    }
  }
  getOnlineDoctors() {
    this.http.get('https://prototype-agbi-hackathon.herokuapp.com/api/getOnlineDoctors').subscribe((response: any) => {
      if (response.results.length > 0) {
        console.log(response.results);
        this.resultsOnline.next(response.results);
        console.log(this.resultsOnline.value);
      }
    })
  }
  initResults() {
    // if (this.results$) {
    //   this.results.unsubscribe();
    // }
    this.results = new BehaviorSubject<doctorDetails[][]>([]);
    this.results$ = this.results.asObservable().pipe(
      scan<doctorDetails[][]>((allResponses, currentResponse) => allResponses.concat(currentResponse), [])
    );
  }
  getResults() {
    this.page = 0;
    this.maxValOfPageReached = 0;
    this.resultsOver.next(false);
    this.initResults();
    this.getDoctors();
  }
  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLocation(position);
      });
    }
  }
  setLocation(position) {
    console.log('setLocation called', position.coords.latitude, position.coords.longitude);
    this.getLocationReverse(position.coords.latitude, position.coords.longitude).subscribe(
      (response: any) => {
        console.log(response);
        this.nearForm.patchValue({
          Address: response.results[0].formatted,
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    );
  }
  getLocationReverse(latitude: string, longitude: string) {
    console.log('calling api for values:', latitude, longitude);
    return this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C%20${longitude}&key=7a0d708a4f2e407d9bee3ce3e77737d9&language=en&pretty=1`)
  }
  getLocationForward() {
    let sendLocation = this.nearForm.get('Address').value.split(' ').join('%20');
    console.log(sendLocation);
    this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${sendLocation}&key=7a0d708a4f2e407d9bee3ce3e77737d9&language=en&pretty=1`).subscribe(
      (response: any) => {
        console.log(response);
        this.nearForm.patchValue({
          Address: response.results[0].formatted,
          lat: response.results[0].geometry.lat,
          long: response.results[0].geometry.lng,
        });
      })
  }
  getDoctors() {
    this.loading.next(true);
    this.disableNext.next(false);
    if (this.nearForm.valid) {
      this.loading
      let reqBody = {
        "lat": Number(this.nearForm.get('lat').value),
        "long": Number(this.nearForm.get('long').value),
        "radius": Number(this.nearForm.get('Radius').value),
        "page": this.page
      }
      this.http.post('https://prototype-agbi-hackathon.herokuapp.com/api/getNearbyDoctors', reqBody).subscribe((response: any) => {
        console.log(response);
        if (response.results) {
          if (response.results.length < 5) {
            console.log('no results');
            this.disableNext.next(true);
            this.resultsOver.next(true);
          }
          this.results.next([response.results]);
          console.log(this.results.value);
        }
        this.loading.next(false);
      });
    }
    else {
      this.snackbar.openSnackBar('Please fill all the details', 'OKAY');
    }
  }
  prevPage() {
    if (this.page > 0)
      this.page--;
    if (this.disableNext.value === true)
      this.disableNext.next(false);
  }
  nextPage() {
    this.page++;
    if (this.page === this.maxValOfPageReached && this.resultsOver.value)
      this.disableNext.next(true);
    if (this.page > this.maxValOfPageReached) {
      this.maxValOfPageReached = this.page;
      this.getDoctors();
    }
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
  formatLabel(value: number) {
    return value + 'Km';
  }

  openRequestDialog(docId: string, docName: string, index: number) {
    this.disabledRequestBtns.push(index);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    this.breakPointObserver.observe([
      '(min-width: 1024px)'
    ]).subscribe(
      result => {
        if (result.matches) {
          console.log('screen is greater than  1024px');
          dialogConfig.minWidth = '30vw';
          dialogConfig.minHeight = '20vh';
          dialogConfig.disableClose = false;
        } else {
          console.log('screen is less than  1024px');
          dialogConfig.minWidth = '60vw';
          dialogConfig.maxHeight = '40vh';
          dialogConfig.disableClose = true;
        }
      }
    );
    dialogConfig.data = {
      docId: docId,
      docName: docName
    }
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(RequestFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      console.log('request made');
    });
  }
}

export class doctorDetails {
  constructor(
    public created: string,
    public formattedAddress: string,
    public isOnline: boolean,
    public lat: number,
    public long: number,
    public name: string,
    public __v: number,
    public _id: string) { }
}
