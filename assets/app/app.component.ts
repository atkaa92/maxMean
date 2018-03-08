import { MessageService } from './messages/message.service';
import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [MessageService]
    
})
export class AppComponent {
   
}