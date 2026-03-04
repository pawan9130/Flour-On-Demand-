import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../../../services/address.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  constructor(private svc: AddressService) {}
  ngOnInit(): void { this.svc.getAddresses().subscribe(a=>this.addresses=a); }
  add(){ const a = { id:0, name:'New', phone:'', line1:'', city:'', state:'', pincode:'', type:'Home'}; this.svc.addAddress(a as any).subscribe(n=>this.addresses.push(n)); }
  del(id:number){ this.svc.deleteAddress(id).subscribe(()=> this.addresses = this.addresses.filter(x=>x.id!==id)); }
  setDefault(a:any){ this.svc.setDefaultAddress(a.id).subscribe(()=> this.ngOnInit()); }
}
