"use client";

import { useState, useEffect, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, ShoppingBag, Loader2, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Script from "next/script";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Check for return from payment (if redirected, though Razorpay is usually modal)
  useEffect(() => {
    const orderId = searchParams.get("order_id");
    // Razorpay usually handles success via callback, but if we used a redirect flow:
    if (orderId) {
      setIsOrderPlaced(true);
      clearCart();
    }
  }, [searchParams, clearCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    // Basic Validation
    if (!formData.firstName || !formData.phone || !formData.email) {
      toast({
        title: "Missing Details",
        description: "Please fill in your name, email, and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "cod") {
      setIsProcessing(true);
      // Simulate API delay
      setTimeout(() => {
        setIsOrderPlaced(true);
        clearCart();
        setIsProcessing(false);
      }, 1500);
      return;
    }

    // Online Payment (Razorpay)
    setIsProcessing(true);

    try {
      // 1. Create Order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Anu's Handmade Store",
        description: "Purchase Order",
        order_id: data.id,
        handler: function (response) {
          // Success Callback
          console.log("Payment Success:", response);
          setIsOrderPlaced(true);
          clearCart();
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000", // Customize color to match theme if needed
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment.",
              variant: "default",
            });
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        console.error("Payment Failed:", response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || "Something went wrong.",
          variant: "destructive",
        });
        setIsProcessing(false);
      });

      rzp1.open();
      
    } catch (error) {
      console.error("Payment Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background animate-fade-in">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We will contact you shortly to confirm
            your order details.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <h1 className="font-display text-2xl font-bold">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground">
            Add some items to your cart to proceed with checkout.
          </p>
          <Button asChild>
            <Link href="/">Browse Collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Shop</span>
          </Link>
          <div className="ml-auto font-display text-xl font-semibold">
            Checkout
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column: Forms */}
          <div className="space-y-8 animate-fade-in">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Section */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">
                Payment Method
              </h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-8">
                <div className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1 flex items-center cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Online Payment</div>
                      <div className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking (Razorpay)</div>
                    </div>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 flex items-center cursor-pointer">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Banknote className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'online' && (
                <p className="text-muted-foreground mb-6 text-sm">
                  You will be redirected to Razorpay securely to complete your payment.
                </p>
              )}
              
              <Button 
                onClick={handlePayment} 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  paymentMethod === 'online' ? `Pay ₹${totalPrice}` : 'Place Order'
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div
            className="lg:sticky lg:top-24 h-fit animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold mb-4">
                Order Summary
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imagePath}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  ₹{totalPrice}
                </span>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                <p>Secured by Razorpay.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
