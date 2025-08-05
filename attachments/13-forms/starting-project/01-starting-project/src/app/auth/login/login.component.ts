import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
onSubmit(formData: NgForm) {
  if(formData.form.invalid){
    return ;
  }
   console.log(formData); // view naming and values that this element contains 
  const enteredEmail= formData.form.value.email;
  const enteredPassword = formData.form.value.password;
  console.log(enteredEmail,enteredPassword);
}
}
