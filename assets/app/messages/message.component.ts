import { MessageService } from './message.service';
import { Message } from './message.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styles: [`
        .auther{
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config{
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
    `]
})
export class MessageComponent {
    @Input() message_msg: Message;
    // @Output() editClicked = new EventEmitter<string>();

    constructor(private messageService: MessageService) {}
    
    // onEdit(){
    //     this.editClicked.emit('A new value')
    // }

    onEdit(){
        this.messageService.editMessage(this.message_msg)
    }

    onDelete(){
        this.messageService.deleteMessage(this.message_msg).subscribe(
            result => console.log(result)
        )
    }

    belongsToUser(){
        return localStorage.getItem('userId') == this.message_msg.userId 
    }
}