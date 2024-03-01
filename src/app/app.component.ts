// app.component.ts
import { Component } from '@angular/core';
import { ProductService } from '../app/service/product.service';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../app/cart/cart.service';
import { CartItem } from '../app/cart/cart.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartItems: CartItem[] = [];
  registerObj: any = {
    "CustId": 0,
    "Name": "",
    "MobileNo": "",
    "Password": ""
  };
  loginObj: any = {
    "UserName": "",
    "UserPassword": ""
  };
  loggedObj: any = {};
  loginModelClass: string = '';

  constructor(private productService: ProductService, private http: HttpClient, private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();
  }

  onRegister() {
    // Handle registration
  }

  onLogin() {
    // Handle login
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.cartItems = this.cartService.getCartItems();
  }

  removeFromCart(item: CartItem, event: Event) {
    event.stopPropagation(); 
    this.cartService.removeFromCart(item);
    this.cartItems = this.cartService.getCartItems();
  }

  getUniqueCartItems(): { item: CartItem, count: number }[] {
    const uniqueItemsMap = new Map<number, { item: CartItem, count: number }>();
    this.cartItems.forEach(item => {
      if (uniqueItemsMap.has(item.id)) {
        const existingItem = uniqueItemsMap.get(item.id)!;
        existingItem.count++;
        uniqueItemsMap.set(item.id, existingItem);
      } else {
        uniqueItemsMap.set(item.id, { item: item, count: 1 });
      }
    });
    return Array.from(uniqueItemsMap.values());
  }
  getUniqueProductCount(): number {
    return this.cartItems.length;
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
  changeQuantity(cartItem: CartItem, action: 'increase' | 'decrease') {
    if (action === 'increase') {
      cartItem.quantity++;
    } else {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      }
    }
  }
}