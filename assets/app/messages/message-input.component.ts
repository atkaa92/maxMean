import { MessageService } from './message.service';
import { Message } from './message.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html',
})
export class MessageInputComponent implements OnInit {
    input_msg: Message;
    constructor(private messageService: MessageService) { }

    ngOnInit() {
        this.messageService.msgIsEdit.subscribe(
            (message: Message) => this.input_msg = message
        );
    }

    // onSave(content: string) {
    //     const message = new Message(content, 'Karen');
    //     this.messageService.addMessage(message);
    // }
    
    onSubmit(form: NgForm) {
        if (this.input_msg) {
            this.input_msg.content = form.value.content;
            this.messageService.updateMessage(this.input_msg).subscribe(
                result => console.log(result)
            )
            this.input_msg = null;

        } else {
            const message = new Message(form.value.content, 'Dummy');
            this.messageService.addMessage(message)
                .subscribe(
                    data => console.log(data),
                    err => console.log(err)
                )
        }
        form.resetForm();
    }

    onClear(form: NgForm) {
        this.input_msg = null;
        form.resetForm();
    }
}