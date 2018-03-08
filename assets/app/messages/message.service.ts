import { ErrorService } from './../errors/error.service';
import { User } from './../auth/user.module';
import { Message } from './message.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import "rxjs/Rx";
import { Observable } from 'rxjs';

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    msgIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) { }

    addMessage(message: Message) {
        const body = JSON.stringify(message)
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
            console.log(message);
            
        const headers = new Headers({ 'Content-Type': 'application/json' })
        return this.http.post('http://localhost:3000/message' + token, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const newMsg = new Message(result.obj.content, result.obj.user.firstName, result.obj._id, result.obj.user._id)
                this.messages.push(newMsg)
                return newMsg;
            })
            .catch((error: Response) => {       
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
            .map((response: Response) => {
                const messages = response.json().obj;
                let transMsgs: Message[] = [];
                for (let message of messages) {
                    transMsgs.push(new Message(message.content, message.user.firstName, message._id, message.user._id))
                }
                this.messages = transMsgs;
                return transMsgs;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    editMessage(message: Message) {
        this.msgIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message)
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const headers = new Headers({ 'Content-Type': 'application/json' })
        return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1)
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}