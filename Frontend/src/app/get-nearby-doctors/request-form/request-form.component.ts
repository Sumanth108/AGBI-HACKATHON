import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalUserServiceService } from 'src/app/global-user-service.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {

  requestForm: FormGroup;
  docId: string;
  docName: string;
  constructor(
    public dialogRef: MatDialogRef<RequestFormComponent>, @Inject(MAT_DIALOG_DATA) data,
    private formBuilder: FormBuilder,
    public globalUserService: GlobalUserServiceService,
    public http: HttpClient) {
    if (data) {
      this.docId = data.docId;
      this.docName = data.docName;
    }
    this.requestForm = this.formBuilder.group({
      requestDate: [null, Validators.required],
      requestTime: [null, Validators.required],
    });
  }
  requestMade = new BehaviorSubject<boolean>(false);
  requestMade$: Observable<boolean> = this.requestMade.asObservable();
  ngOnInit(): void {

  }

  makeRequest() {
    let reqBody = {
      "from": this.globalUserService.user_id,
      "to": this.docId,
      "fromUsername": this.globalUserService.username,
      "toUsername": this.docName,
      "date_time": new Date(this.requestForm.value.requestDate + " " + this.requestForm.value.requestTime),
    }
    // reqBody.date_time.setTime(this.requestForm.value.requestTime);
    console.log(this.requestForm.value.requestDate + " " + this.requestForm.value.requestTime);
    console.log(reqBody);
    this.http.post('https://prototype-agbi-hackathon.herokuapp.com/api/new-request', reqBody).subscribe((response: any) => {
      console.log(response);
    });
    this.requestMade.next(true);
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }

}
