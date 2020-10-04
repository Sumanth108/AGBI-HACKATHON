import { Component, OnInit } from '@angular/core';
import { GlobalUserServiceService } from '../global-user-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnackService } from '../services/snack.service';
import { debounceTime, timeout, retry, catchError } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consult-ai',
  templateUrl: './consult-ai.component.html',
  styleUrls: ['./consult-ai.component.scss']
})
export class ConsultAiComponent implements OnInit {
  imagePath;

  imgURL: String[] = [null, null, null];
  predictionValues = [null, null, null];

  CLOUDINARY_BASE_URL = 'https://api.cloudinary.com/v1_1/dzhqx36hu/upload';
  CLOUDINARY_UPLOAD_PRESET = 'fpu92ndt';
  generatedReport = null;
  predictionURL = "https://skin-canc-detector.herokuapp.com/"
  isCollapsed = true;

  constructor(public globalUserService: GlobalUserServiceService,
    private http: HttpClient,
    public snackbar: SnackService,
    public router: Router) { }
  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.globalUserService.setUserDetailsToFromLocalStorage();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  preview(files, index) {
    if (files.length == 1) {
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.snackbar.openSnackBar('Only images are supported.', 'OKAY');
        return;
      }
      const reader = new FileReader();
      this.imagePath = files[0];
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.uploadPhoto(this.imagePath, index);
      };
    }
    else {
      this.snackbar.openSnackBar('Please Upload Only one image at a time!', 'OKAY');
    }
  }
  uploadPhoto(data, index) {
    let formData = new FormData();
    formData.append('file', data);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.http.post(this.CLOUDINARY_BASE_URL, formData).pipe(debounceTime(1500), timeout(4000), retry(3), catchError((err) => {
      this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
      throw new Error('Server Timeout' + err);
    })
    ).subscribe((response: any) => {
      console.log(response);
      this.imgURL[index] = response.url;
      this.getPrediction(data, index);
    }, (error: any) => {
      this.snackbar.openSnackBar('Something went wrong', 'OKAY');
    });
  }
  getPrediction(data, index) {
    let predicForm = new FormData();
    predicForm.append('file', data);
    this.http.post(this.predictionURL, predicForm).pipe(debounceTime(1500), timeout(4000), retry(3), catchError((err) => {
      this.snackbar.openSnackBar('Server responded with an error, please try after some time....', 'OKAY');
      throw new Error('Server Timeout' + err);
    })
    ).subscribe((response: any) => {
      if (response.prediction) {
        this.predictionValues[index] = Math.floor((Number(response.prediction) * 100));
      }
      else {
        this.snackbar.openSnackBar('Something went wrong', 'OKAY');
      }
    }, (error: any) => {
      this.snackbar.openSnackBar('Something went wrong', 'OKAY');
      console.log(error);
    });
  }
  value = 50;
  generateReport() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    this.generatedReport = {
      PatientName: this.globalUserService.username,
      PredictionValue: Math.max(...this.predictionValues),
      ReportedOn: dateTime,
    }
    setTimeout(() => {
      document.getElementById('postArea').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
    console.log('the generated report is', this.generatedReport);
  }
  saveReport() {
    console.log("report to be saved");
    this.router.navigateByUrl('/forums');
  }
}
