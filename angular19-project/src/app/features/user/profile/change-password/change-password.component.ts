import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  model: any = { old: '', new: '', confirm: '' };
  constructor(private user: UserService){}
  save(){ if(this.model.new !== this.model.confirm) return alert('Passwords do not match'); this.user.changePassword(this.model.old, this.model.new).subscribe(()=>alert('Changed')); }
}

