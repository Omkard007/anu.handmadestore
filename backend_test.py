#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Jewellery E-commerce
Tests all API endpoints: products, cart, orders, and payment integration
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://glamcharms.preview.emergentagent.com/api"
SESSION_ID = "test_session_123"

class JewelleryAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session_id = SESSION_ID
        self.test_results = []
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_products_endpoints(self):
        """Test all product-related endpoints"""
        print("=== TESTING PRODUCT ENDPOINTS ===")
        
        # Test 1: Get all products
        try:
            response = requests.get(f"{self.base_url}/products")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'products' in data:
                    products = data['products']
                    if len(products) == 15:  # Expected 15 products
                        self.log_test("GET /api/products - Fetch all products", True, 
                                    f"Retrieved {len(products)} products successfully")
                    else:
                        self.log_test("GET /api/products - Fetch all products", False, 
                                    f"Expected 15 products, got {len(products)}")
                else:
                    self.log_test("GET /api/products - Fetch all products", False, 
                                "Invalid response format")
            else:
                self.log_test("GET /api/products - Fetch all products", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/products - Fetch all products", False, str(e))

        # Test 2: Filter products by category
        try:
            response = requests.get(f"{self.base_url}/products?category=Earring")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'products' in data:
                    earrings = data['products']
                    if len(earrings) == 3:  # Expected 3 earrings
                        self.log_test("GET /api/products?category=Earring - Filter by category", True, 
                                    f"Retrieved {len(earrings)} earrings successfully")
                    else:
                        self.log_test("GET /api/products?category=Earring - Filter by category", False, 
                                    f"Expected 3 earrings, got {len(earrings)}")
                else:
                    self.log_test("GET /api/products?category=Earring - Filter by category", False, 
                                "Invalid response format")
            else:
                self.log_test("GET /api/products?category=Earring - Filter by category", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/products?category=Earring - Filter by category", False, str(e))

        # Test 3: Get single product by ID
        try:
            response = requests.get(f"{self.base_url}/products/1")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'product' in data:
                    product = data['product']
                    if product['id'] == '1' and product['name'] == 'Royal Gold Jhumkas':
                        self.log_test("GET /api/products/1 - Get single product", True, 
                                    f"Retrieved product: {product['name']}")
                    else:
                        self.log_test("GET /api/products/1 - Get single product", False, 
                                    "Product data mismatch")
                else:
                    self.log_test("GET /api/products/1 - Get single product", False, 
                                "Invalid response format")
            else:
                self.log_test("GET /api/products/1 - Get single product", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/products/1 - Get single product", False, str(e))

        # Test 4: Get non-existent product
        try:
            response = requests.get(f"{self.base_url}/products/999")
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("GET /api/products/999 - Non-existent product", True, 
                                "Correctly returned 404 for non-existent product")
                else:
                    self.log_test("GET /api/products/999 - Non-existent product", False, 
                                "Invalid error response format")
            else:
                self.log_test("GET /api/products/999 - Non-existent product", False, 
                            f"Expected 404, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/products/999 - Non-existent product", False, str(e))

    def test_cart_endpoints(self):
        """Test all cart-related endpoints"""
        print("=== TESTING CART ENDPOINTS ===")
        
        # Test 1: Add product to cart
        try:
            payload = {
                "productId": "1",
                "quantity": 2,
                "sessionId": self.session_id
            }
            response = requests.post(f"{self.base_url}/cart", json=payload)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("POST /api/cart - Add product to cart", True, 
                                "Successfully added product to cart")
                else:
                    self.log_test("POST /api/cart - Add product to cart", False, 
                                "Response indicates failure")
            else:
                self.log_test("POST /api/cart - Add product to cart", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/cart - Add product to cart", False, str(e))

        # Test 2: Get cart items
        try:
            response = requests.get(f"{self.base_url}/cart?sessionId={self.session_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'items' in data:
                    items = data['items']
                    if len(items) > 0:
                        self.log_test("GET /api/cart - Get cart items", True, 
                                    f"Retrieved {len(items)} cart items")
                    else:
                        self.log_test("GET /api/cart - Get cart items", False, 
                                    "No items found in cart after adding")
                else:
                    self.log_test("GET /api/cart - Get cart items", False, 
                                "Invalid response format")
            else:
                self.log_test("GET /api/cart - Get cart items", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/cart - Get cart items", False, str(e))

        # Test 3: Update cart item quantity
        try:
            payload = {
                "quantity": 3,
                "sessionId": self.session_id
            }
            response = requests.put(f"{self.base_url}/cart/1", json=payload)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("PUT /api/cart/1 - Update cart item quantity", True, 
                                "Successfully updated cart item quantity")
                else:
                    self.log_test("PUT /api/cart/1 - Update cart item quantity", False, 
                                "Response indicates failure")
            else:
                self.log_test("PUT /api/cart/1 - Update cart item quantity", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("PUT /api/cart/1 - Update cart item quantity", False, str(e))

        # Test 4: Add another product to cart for testing
        try:
            payload = {
                "productId": "7",  # Classic Gold Mangalsutra
                "quantity": 1,
                "sessionId": self.session_id
            }
            response = requests.post(f"{self.base_url}/cart", json=payload)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("POST /api/cart - Add second product", True, 
                                "Successfully added second product to cart")
                else:
                    self.log_test("POST /api/cart - Add second product", False, 
                                "Response indicates failure")
            else:
                self.log_test("POST /api/cart - Add second product", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/cart - Add second product", False, str(e))

        # Test 5: Remove item from cart
        try:
            response = requests.delete(f"{self.base_url}/cart/7?sessionId={self.session_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("DELETE /api/cart/7 - Remove item from cart", True, 
                                "Successfully removed item from cart")
                else:
                    self.log_test("DELETE /api/cart/7 - Remove item from cart", False, 
                                "Response indicates failure")
            else:
                self.log_test("DELETE /api/cart/7 - Remove item from cart", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("DELETE /api/cart/7 - Remove item from cart", False, str(e))

    def test_payment_endpoints(self):
        """Test payment-related endpoints"""
        print("=== TESTING PAYMENT ENDPOINTS ===")
        
        # Test 1: Create payment intent
        try:
            # Get current cart items first
            cart_response = requests.get(f"{self.base_url}/cart?sessionId={self.session_id}")
            cart_items = []
            total_amount = 0
            
            if cart_response.status_code == 200:
                cart_data = cart_response.json()
                cart_items = cart_data.get('items', [])
                for item in cart_items:
                    total_amount += item['price'] * item['quantity']
            
            payload = {
                "amount": total_amount,  # Amount in paise
                "items": cart_items,
                "sessionId": self.session_id
            }
            
            response = requests.post(f"{self.base_url}/create-payment-intent", json=payload)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'clientSecret' in data and 'paymentIntentId' in data:
                    self.payment_intent_id = data['paymentIntentId']
                    self.log_test("POST /api/create-payment-intent - Create payment intent", True, 
                                f"Created payment intent with amount ₹{total_amount/100:.2f}")
                else:
                    self.log_test("POST /api/create-payment-intent - Create payment intent", False, 
                                "Invalid response format")
            else:
                self.log_test("POST /api/create-payment-intent - Create payment intent", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/create-payment-intent - Create payment intent", False, str(e))

    def test_order_endpoints(self):
        """Test order-related endpoints"""
        print("=== TESTING ORDER ENDPOINTS ===")
        
        # Test 1: Create order
        try:
            # Get current cart items
            cart_response = requests.get(f"{self.base_url}/cart?sessionId={self.session_id}")
            cart_items = []
            subtotal = 0
            
            if cart_response.status_code == 200:
                cart_data = cart_response.json()
                cart_items = cart_data.get('items', [])
                for item in cart_items:
                    subtotal += item['price'] * item['quantity']
            
            payload = {
                "sessionId": self.session_id,
                "items": cart_items,
                "shippingAddress": {
                    "name": "Priya Sharma",
                    "address": "123 MG Road",
                    "city": "Mumbai",
                    "state": "Maharashtra",
                    "pincode": "400001",
                    "phone": "9876543210"
                },
                "paymentIntentId": getattr(self, 'payment_intent_id', 'pi_test_123'),
                "subtotal": subtotal,
                "total": subtotal + 500  # Adding shipping
            }
            
            response = requests.post(f"{self.base_url}/orders", json=payload)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'orderId' in data:
                    self.order_id = data['orderId']
                    self.log_test("POST /api/orders - Create order", True, 
                                f"Created order with ID: {self.order_id}")
                else:
                    self.log_test("POST /api/orders - Create order", False, 
                                "Invalid response format")
            else:
                self.log_test("POST /api/orders - Create order", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/orders - Create order", False, str(e))

        # Test 2: Verify cart is cleared after order
        try:
            response = requests.get(f"{self.base_url}/cart?sessionId={self.session_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'items' in data:
                    items = data['items']
                    if len(items) == 0:
                        self.log_test("Cart cleared after order creation", True, 
                                    "Cart successfully cleared after order")
                    else:
                        self.log_test("Cart cleared after order creation", False, 
                                    f"Cart still has {len(items)} items")
                else:
                    self.log_test("Cart cleared after order creation", False, 
                                "Invalid response format")
            else:
                self.log_test("Cart cleared after order creation", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Cart cleared after order creation", False, str(e))

        # Test 3: Get orders for session
        try:
            response = requests.get(f"{self.base_url}/orders?sessionId={self.session_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'orders' in data:
                    orders = data['orders']
                    if len(orders) > 0:
                        self.log_test("GET /api/orders - Get orders for session", True, 
                                    f"Retrieved {len(orders)} orders")
                    else:
                        self.log_test("GET /api/orders - Get orders for session", False, 
                                    "No orders found after creating order")
                else:
                    self.log_test("GET /api/orders - Get orders for session", False, 
                                "Invalid response format")
            else:
                self.log_test("GET /api/orders - Get orders for session", False, 
                            f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/orders - Get orders for session", False, str(e))

        # Test 4: Get single order
        if hasattr(self, 'order_id'):
            try:
                response = requests.get(f"{self.base_url}/orders/{self.order_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'order' in data:
                        order = data['order']
                        if order['orderId'] == self.order_id:
                            self.log_test("GET /api/orders/{orderId} - Get single order", True, 
                                        f"Retrieved order: {order['orderId']}")
                        else:
                            self.log_test("GET /api/orders/{orderId} - Get single order", False, 
                                        "Order ID mismatch")
                    else:
                        self.log_test("GET /api/orders/{orderId} - Get single order", False, 
                                    "Invalid response format")
                else:
                    self.log_test("GET /api/orders/{orderId} - Get single order", False, 
                                f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("GET /api/orders/{orderId} - Get single order", False, str(e))

        # Test 5: Update order status
        if hasattr(self, 'order_id'):
            try:
                payload = {
                    "paymentStatus": "completed",
                    "status": "confirmed"
                }
                response = requests.put(f"{self.base_url}/orders/{self.order_id}", json=payload)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        self.log_test("PUT /api/orders/{orderId} - Update order status", True, 
                                    "Successfully updated order status")
                    else:
                        self.log_test("PUT /api/orders/{orderId} - Update order status", False, 
                                    "Response indicates failure")
                else:
                    self.log_test("PUT /api/orders/{orderId} - Update order status", False, 
                                f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("PUT /api/orders/{orderId} - Update order status", False, str(e))

    def test_error_handling(self):
        """Test error handling scenarios"""
        print("=== TESTING ERROR HANDLING ===")
        
        # Test 1: Add non-existent product to cart
        try:
            payload = {
                "productId": "999",
                "quantity": 1,
                "sessionId": self.session_id
            }
            response = requests.post(f"{self.base_url}/cart", json=payload)
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Error handling - Non-existent product in cart", True, 
                                "Correctly handled non-existent product")
                else:
                    self.log_test("Error handling - Non-existent product in cart", False, 
                                "Invalid error response format")
            else:
                self.log_test("Error handling - Non-existent product in cart", False, 
                            f"Expected 404, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Error handling - Non-existent product in cart", False, str(e))

        # Test 2: Invalid endpoint
        try:
            response = requests.get(f"{self.base_url}/invalid-endpoint")
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Error handling - Invalid endpoint", True, 
                                "Correctly handled invalid endpoint")
                else:
                    self.log_test("Error handling - Invalid endpoint", False, 
                                "Invalid error response format")
            else:
                self.log_test("Error handling - Invalid endpoint", False, 
                            f"Expected 404, got HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Error handling - Invalid endpoint", False, str(e))

    def run_all_tests(self):
        """Run all test suites"""
        print(f"Starting comprehensive backend API testing...")
        print(f"Base URL: {self.base_url}")
        print(f"Session ID: {self.session_id}")
        print("=" * 60)
        
        self.test_products_endpoints()
        self.test_cart_endpoints()
        self.test_payment_endpoints()
        self.test_order_endpoints()
        self.test_error_handling()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"❌ {result['test']}: {result['details']}")
        
        return passed_tests, failed_tests, self.test_results

if __name__ == "__main__":
    tester = JewelleryAPITester()
    passed, failed, results = tester.run_all_tests()
    
    # Save results to file
    with open('/app/test_results_backend.json', 'w') as f:
        json.dump({
            'summary': {
                'total': len(results),
                'passed': passed,
                'failed': failed,
                'success_rate': f"{(passed/len(results))*100:.1f}%"
            },
            'results': results
        }, f, indent=2)
    
    print(f"\nDetailed results saved to: /app/test_results_backend.json")