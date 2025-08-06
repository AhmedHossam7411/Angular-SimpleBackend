import { LetDeclaration } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mustContainQuestionMark } from '../login/login.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [ReactiveFormsModule]
})
export class SignupComponent 
{
  onSubmit()
  {
    console.log();
  }
  
  onReset(){
  this.form.reset();
}

   form = new FormGroup({
         email: new FormControl('',{ 
           validators: [Validators.email, Validators.required]  
         }),
         password: new FormControl('',{
           validators: [Validators.required, Validators.minLength(6),mustContainQuestionMark],
          }),
       });
   
}
