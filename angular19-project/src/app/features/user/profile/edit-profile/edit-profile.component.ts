import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  profile: any = {};
  constructor(private user: UserService){ this.user.getProfile().subscribe(p=>this.profile = p); }
  save(){ this.user.updateProfile(this.profile).subscribe(()=>alert('Saved')); }
}

