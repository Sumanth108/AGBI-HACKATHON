import { Component, OnInit } from '@angular/core';
import { GlobalUserServiceService } from '../global-user-service.service';
import { scan } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  constructor(public globalUserService: GlobalUserServiceService,
    private http: HttpClient) { }

  isCollapsed = true;
  messages$: Observable<Message[]>;
  formValue: string;
  msgLength = 0;
  voiceEnabled = true;
  toggleVoice(a: boolean) {
    this.voiceEnabled = a;
  }
  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.globalUserService.setUserDetailsToFromLocalStorage();


    this.messages$ = this.conversation.asObservable().pipe(
      scan((acc, val) => acc.concat(val))
    );
    this.messages$.subscribe((result) => {
      this.msgLength = result.length - 1;
    });
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
  sendMessage() {
    this.converse(this.formValue);
    this.formValue = '';
  }

  conversation = new BehaviorSubject<Message[]>([]);
  webDemoUrl = 'https://dialogflow.cloud.google.com/v1/integrations/messenger/webhook/71af7459-3a2d-400c-9826-ce435be5c62d/sessions/webdemo-fe8461eb-4e86-eefa-694b-67e125a9e644?platform=webdemo';
  imgSRC = 'https://storage.googleapis.com/cloudprod-apiai/f1d08f30-49e6-4811-846a-6b44aa32de48_x.png';

  update(msg: Message) {
    this.conversation.next([msg]);
    console.log('message_' + String(this.msgLength));
    document.querySelector('#messageBody').scrollTo({ top: 1000, behavior: 'smooth' });
  }

  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    let body = {
      "queryInput": {
        "text": {
          "text": msg,
          "languageCode": "en"
        }
      }
    }
    this.http.post(this.webDemoUrl, body).subscribe((response: any) => {
      if (response.queryResult) {
        console.log(response.queryResult.fulfillmentText);
        const botMessage = new Message(response.queryResult.fulfillmentText, 'bot');
        this.update(botMessage);
        if (('speechSynthesis' in window) && this.voiceEnabled) {
          var msg = new SpeechSynthesisUtterance();
          msg.text = botMessage.content;
          console.log('speaking');
          window.speechSynthesis.speak(msg);
        }
      }
    });
  }

}
export class Message {
  constructor(public content: string, public sentBy: string) { }
}