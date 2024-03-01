import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: any = {};
  editMode: boolean = false;
  editedProduct: any = {};
  cartItems: CartItem[] = [];
  isLoading: boolean = false; 

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id !== null ? id : '';
    console.log('Product ID:', this.productId);
    this.getProductDetails();
    this.cartItems = this.cartService.getCartItems();
  }

  getProductDetails() {
    console.log('Fetching product details...');
    this.isLoading = true;
    this.productService.getProductById(this.productId)
      .subscribe(
        (response: any) => {
          console.log('API response:', response);
          this.product = response || {};
          console.log('Product:', this.product);
          this.editedProduct = { ...this.product };
        },
        (error: any) => {
          console.error('Error fetching product details:', error);
        },
        () => {
          this.isLoading = false; 
        }
      );
  }

  toggleEditMode() {
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
            this.router.navigate(['/products', this.product?.id]);
          },
          (error: HttpErrorResponse) => {
            console.error('Error updating product:', error);
          },
          () => {
            this.isLoading = false; 
          }
        );
    } else {
      console.error('Cannot save changes: Product or Product ID is missing.');
    }
  }


  cancelEdit() {
    this.editedProduct = { ...this.product };
    this.editMode = false;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.cartItems = this.cartService.getCartItems();
  }
}
