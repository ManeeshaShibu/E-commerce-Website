import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductGridComponent } from '../app/products/products.component';
import { ProductDetailsComponent } from '../app/product-details/product-details.component'; 
import { ProductEditComponent } from './product-edit/product-edit.component';



const routes: Routes = [
 
  {
    path:'products',
    component: ProductGridComponent
  },
  { 
    path: 'products/:id', 
    component: ProductDetailsComponent 
  },
  {
    path: 'products/:id/edit',
    component: ProductEditComponent
  },
  { path: '', 
    redirectTo: '/products', 
    pathMatch: 'full' 
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
