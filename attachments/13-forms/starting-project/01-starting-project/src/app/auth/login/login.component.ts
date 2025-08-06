import { afterNextRender, afterRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

export function mustContainQuestionMark(control: AbstractControl)
{
  if(control.value.includes('?')){
    return null;
  }
  return { mustContainQuestionMark: true }; // invalid
}

function emailIsUnique(control: AbstractControl)
{
  if(control.value === 'test@example.com')
  {
    return { emailIsUnique: true }
  }
  return null;
}
let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if(savedForm)
{
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

// template forms ts  is commented out down here 
export class LoginComponent {
onSubmit() {
   console.log(this.form);
}

     
    form = new FormGroup({
      email: new FormControl(initialEmailValue,{ 
        validators: [Validators.email, Validators.required,emailIsUnique]  
      }),
      password: new FormControl({
        validators: [Validators.required, Validators.minLength(6),mustContainQuestionMark],
       }),
    });

    get emailIsInvalid(){
      return (
        this.form.controls.email.touched &&
        this.form.controls.email.dirty &&
        this.form.controls.email.invalid
      );
    }
    get passwordIsInvalid(){
      return (
        this.form.controls.password.touched &&
        this.form.controls.password.dirty &&
        this.form.controls.password.invalid
      );
    }
}

  /* ----------------this is Template Forms---------------------- 
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  
   
   
  constructor() {
    afterNextRender(() => {
     const savedForm = window.localStorage.getItem('saved-login-form');

     if (savedForm){
         const loadedFormData = JSON.parse(savedForm);
         const savedEmail = loadedFormData.email;
         setTimeout(() => {
           this.form().controls['email'].setValue(savedEmail);
         }, 1);
     }

      const subscription = this.form()
      .valueChanges?.pipe(debounceTime(500))
      .subscribe({
        next: (value) =>
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email : value.email})
          ),
      });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    })
    
    
  }
onSubmit(formData: NgForm) {
  if(formData.form.invalid){
    return ;
  }
   console.log(formData); // view naming and values that this element contains 
  const enteredEmail= formData.form.value.email;
  const enteredPassword = formData.form.value.password;
  console.log(enteredEmail,enteredPassword);

  formData.form.reset();  // reset after submitting
}
}
*/

