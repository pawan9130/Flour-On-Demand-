import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.component.html'
})
export class PaymentGatewayComponent implements OnInit {
  payment: any = {};

  constructor(private svc: SettingsService) {}

  ngOnInit(): void { this.svc.getSettings('payment').subscribe(p=>this.payment = p || {}); }
  save(){ this.svc.updateSettings('payment', this.payment).subscribe(()=>alert('Saved')); }
}
