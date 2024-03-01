import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../product-details/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productId!: string;
  product!: Product | undefined;
  editMode: boolean = false; 
  editedProduct: Partial<Product> = {};
  isLoading: boolean = false; 

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private productService: ProductService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id !== null ? id : '';
    console.log('Product ID:', this.productId);
    this.getProductDetails();
  }

  getProductDetails(): void {
    console.log('Fetching product details...');
    this.productService.getProductById(this.productId)
      .subscribe(
        (response: Product) => {
          console.log('API response:', response);
          this.product = response; 
          console.log('Product:', this.product);  
          this.editedProduct = { ...response };
        },
        (error: HttpErrorResponse) => { 
          console.error('Error fetching product details:', error);
        }
      );
  }

  toggleEditMode(){
    this.editMode = !this.editMode;
  }

  saveProductChanges() {
    console.log('Saving product changes...');
    
    if (this.product && this.product.id) {
      console.log('Product ID:', this.product.id);
      console.log('Updated Product:', this.editedProduct);
  
      const { id, ...updatedProductWithoutId } = this.editedProduct;
  
      this.isLoading = true;
      this.productService.updateProduct(this.product.id, updatedProductWithoutId)
        .subscribe(
          (updatedProduct: any) => {
            console.log('Product updated successfully:', updatedProduct);
            this.product = { ...this.product, ...updatedProduct };
            this.editMode = false;
            this.isLoading = false;
            if (this.product?.id) {
              this.router.navigate(['/products', this.product.id]);
            } else {
              console.error('Product ID is undefined.');
            }
          },
          (error: HttpErrorResponse) => { 
            console.error('Error updating product:', error);
            this.isLoading = false;
          }
        );
    } else {
      console.error('Cannot save changes: Product or Product ID is missing.');
    }
  }
  
  
  
  cancelEdit(): void {
    this.router.navigate(['/products', this.product?.id]);
  }
}
