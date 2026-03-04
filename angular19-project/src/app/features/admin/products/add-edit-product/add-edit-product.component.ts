import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {
  product: any = { name: '', price: 0, type: 'regular' };
  id: any;
  constructor(private route: ActivatedRoute, private router: Router){}
  ngOnInit(): void { this.route.paramMap.subscribe(pm=>{ const id = pm.get('id'); if(id) this.id = id; }); }
  save(){ alert('Saved (mock)'); this.router.navigate(['/admin/products']); }
}
