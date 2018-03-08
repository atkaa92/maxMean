import { AuthService } from './auth.service';
import { User } from './user.module';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',

})
export class SigninComponent implements OnInit {
    myForm: FormGroup;
    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
            password: new FormControl('', Validators.required),
        })
    }

    onSubmit() {
        const user = new User(
            this.myForm.value.email,
            this.myForm.value.password,
        );
        this.authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('userId', data.userId)
                    this.router.navigateByUrl('/')
                },
                error => console.error(error)
            )
        this.myForm.reset();
    }
}
