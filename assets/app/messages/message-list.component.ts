import { MessageService } from './message.service';
import { Message } from './message.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-message-list',
    template: `
        <div class="col-md-8 col-md-offset-2">
            <app-message 
                [message_msg]="app_msg"
                *ngFor="let app_msg of app_msgs">
            </app-message>
        </div>
    `,
    })

// (editClicked) = "app_msg.content = $event" 
    
export class MessageListComponent implements OnInit {
    app_msgs: Message[];
    constructor(private messageService: MessageService) {}
    
    ngOnInit(){
        this.messageService.getMessages()
            .subscribe( 
                (messages: Message[]) => {
                    this.app_msgs = messages;
                }
            )
    }
}