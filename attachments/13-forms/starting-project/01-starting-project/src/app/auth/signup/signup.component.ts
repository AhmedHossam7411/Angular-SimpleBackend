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
          confirmPassword: new FormControl('',{
           validators: [Validators.required, Validators.minLength(6),mustContainQuestionMark],
          }),
          firstName: new FormControl('',{ validators: [Validators.required],}),
          lastName: new FormControl('',{ validators: [Validators.required],}),
          street: new FormControl('',{ validators: [Validators.required],}),
          number: new FormControl('',{ validators: [Validators.required],}),
          postalCode: new FormControl('',{ validators: [Validators.required],}),
          city: new FormControl('',{ validators: [Validators.required],}),
          
          role : new FormControl<
          'student' | 'teacher' | 'employee' | 'founder' | 'other'
          >('student', {validators : [Validators.required]}),
          agree : new FormControl(false,{ validators: [Validators.required]})
       });
      
}
