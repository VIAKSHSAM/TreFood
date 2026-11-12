"use client";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import {
  Search,
  ShoppingCart,
  ArrowRight,
  MapPin,
  Star,
  Clock,
  Menu,
  X,
} from "lucide-react";

const categories = [
  {
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400",
  },
  {
    name: "Burger",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
  },
  {
    name: "Biryani",
    image: "https://images.pexels.com/photos/28674660/pexels-photo-28674660.jpeg?w=600",
  },
  {
    name: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
  },
  {
    name: "Drinks",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400",
  },
];

type Food = {
  _id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  available: boolean;
};



export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [foodsError, setFoodsError] = useState("");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Pizza",
    price: "",
    rating: "4.5",
    image: "",
    available: true,
  });

  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const [orders, setOrders] = useState<{
    id: string;
    items: { name: string; price: string; quantity: number }[];
    total: number;
    paymentMethod: string;
    paymentStatus?: string;
    paymentGateway?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    status: string;
    date: string;
    createdAt?: string;
    customerName: string;
    customerEmail: string;
    phone: string;
    address: string;
  }[]>([]);


  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [isSignup, setIsSignup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setFoods(data.products);
      } catch (error) {
        setFoodsError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setFoodsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/customer-session", {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setCurrentUser(data.user);
          localStorage.setItem(
            "trefood_logged_in_user",
            JSON.stringify(data.user)
          );
        } else {
          setCurrentUser(null);
          localStorage.removeItem("trefood_logged_in_user");
        }
      } catch (error) {
        console.error("Session verification error:", error);
      }
    };

    verifySession();
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders);
        localStorage.setItem("trefood_orders", JSON.stringify(data.orders));
      } catch (error) {
        console.error("Orders fetch error:", error);
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [cart, setCart] = useState<{ name: string; price: string; quantity: number }[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("trefood_cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem("trefood_cart", JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]); const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      food.category.toLowerCase() === selectedCategory.toLowerCase();

    return food.available && matchesSearch && matchesCategory;
  });


  const filteredOrders = orders.filter((order) => {
    const search = adminSearch.trim().toLowerCase();

    return (
      order.id.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search)
    );
  });

  const myOrders = orders.filter(
    (order) =>
      order.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );
  const orderStatusData = [
    { name: "Order Placed", value: orders.filter(order => order.status === "Order Placed").length, color: "#f97316" },
    { name: "Confirmed", value: orders.filter(order => order.status === "Confirmed").length, color: "#3b82f6" },
    { name: "Preparing", value: orders.filter(order => order.status === "Preparing").length, color: "#eab308" },
    { name: "Out for Delivery", value: orders.filter(order => order.status === "Out for Delivery").length, color: "#a855f7" },
    { name: "Delivered", value: orders.filter(order => order.status === "Delivered").length, color: "#22c55e" },
  ];

  const orderStatusBarData = orderStatusData.map(status => ({
    status: status.name,
    orders: status.value,
  }));
  const today = currentDate ?? new Date(0);
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt || order.date);

    return (
      !Number.isNaN(orderDate.getTime()) &&
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const monthOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt || order.date);

    return (
      !Number.isNaN(orderDate.getTime()) &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const todayRevenue = todayOrders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  const monthRevenue = monthOrders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  const dailyRevenueData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date);

      return (
        !Number.isNaN(orderDate.getTime()) &&
        orderDate.getDate() === date.getDate() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      revenue: dayOrders.reduce((total, order) => total + order.total, 0),
    };
  });
  const monthlyRevenueData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);

    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date);

      return (
        !Number.isNaN(orderDate.getTime()) &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      month: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      revenue: monthlyOrders.reduce((total, order) => total + order.total, 0),
    };
  });
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();

  startOfWeek.setDate(
    startOfWeek.getDate() - (day === 0 ? 6 : day - 1)
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt || order.date);

    return (
      !Number.isNaN(orderDate.getTime()) &&
      orderDate >= startOfWeek &&
      orderDate <= today
    );
  });

  const weeklyRevenue = weeklyOrders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  const codRevenue = orders
    .filter((order) => order.paymentMethod === "COD" && order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  const onlineRevenue = orders
    .filter((order) => order.paymentMethod === "Online" && order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  const sortedFoods = [...filteredFoods].sort((a, b) => {
    if (sortOrder === "low-high") return a.price - b.price;
    if (sortOrder === "high-low") return b.price - a.price;
    return 0;
  });

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Invalid admin credentials!");
        return;
      }

      setIsAdminLoggedIn(true);
      setIsAdminLoginOpen(false);
      setIsAdminOpen(true);
      setAdminEmail("");
      setAdminPassword("");

      alert("Admin login successful!");
    } catch (error) {
      alert("Unable to connect to server!");
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status");
      }

      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      );

      setOrders(updatedOrders);
      localStorage.setItem("trefood_orders", JSON.stringify(updatedOrders));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          paymentStatus: "Paid",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update payment status");
      }

      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus: "Paid" }
          : order
      );

      setOrders(updatedOrders);
      localStorage.setItem("trefood_orders", JSON.stringify(updatedOrders));

      alert("COD payment marked as Paid successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      alert("Please enter product name!");
      return;
    }

    if (!productForm.price || Number(productForm.price) <= 0) {
      alert("Please enter a valid product price!");
      return;
    }

    if (
      !productForm.rating ||
      Number(productForm.rating) < 0 ||
      Number(productForm.rating) > 5
    ) {
      alert("Rating must be between 0 and 5!");
      return;
    }

    if (!productForm.image.trim()) {
      alert("Please enter product image URL!");
      return;
    }
    try {
      const imageUrl = new URL(productForm.image);

      if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
        throw new Error();
      }
    } catch {
      alert("Please enter a valid image URL!");
      return;
    }

    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        rating: Number(productForm.rating),
      };

      const response = await fetch("/api/products", {
        method: editingProductId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingProductId
            ? { id: editingProductId, ...productData }
            : productData
        ),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save product");
      }

      const productsResponse = await fetch("/api/products", {
        cache: "no-store",
      });

      const productsData = await productsResponse.json();

      if (!productsResponse.ok || !productsData.success) {
        throw new Error("Failed to refresh products");
      }

      setFoods(productsData.products);
      setProductForm({
        name: "",
        category: "Pizza",
        price: "",
        rating: "4.5",
        image: "",
        available: true,
      });

      setEditingProductId(null);
      setIsProductFormOpen(false);

      alert(data.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");

    if (!confirmed) return;

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      setFoods((prevFoods) =>
        prevFoods.filter((food) => food._id !== productId)
      );

      alert("Product deleted successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleEditProduct = (food: Food) => {
    setProductForm({
      name: food.name,
      category: food.category,
      price: String(food.price),
      rating: String(food.rating),
      image: food.image,
      available: food.available,
    });

    setEditingProductId(food._id);
    setIsProductFormOpen(true);
  };



  const handleCheckout = async () => {
    if (!customerName || !phone || !address || !city || !pincode) {
      alert("Please fill all checkout details!");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode!");
      return;
    }

    const total = cart.reduce(
      (total, item) =>
        total + Number(item.price.replace("₹", "")) * item.quantity,
      0
    );

    const newOrder = {
      id: "TF" + Date.now(),
      items: [...cart],
      total,
      paymentMethod,
      status: "Order Placed",
      date: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      customerName,
      customerEmail: currentUser?.email || "",
      phone,
      address: `${address}, ${city} - ${pincode}`,
    };

    const saveOrder = async (
      paymentDetails: Record<string, string> = {}
    ) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newOrder,
          ...paymentDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      const updatedOrders = [...orders, data.order];

      setOrders(updatedOrders);
      localStorage.setItem("trefood_orders", JSON.stringify(updatedOrders));

      setIsOrderPlaced(true);
      setIsCheckoutOpen(false);
    };

    try {
      if (paymentMethod === "COD") {
        await saveOrder();
        return;
      }

      const scriptLoaded = await new Promise<boolean>((resolve) => {
        if ((window as any).Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || "Unable to create payment order");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TreFood",
        description: "Food Order Payment",
        order_id: orderData.order_id,
        prefill: {
          name: customerName,
          email: currentUser?.email || "",
          contact: phone,
        },
        theme: {
          color: "#ea580c",
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error("Payment verification failed");
            }

            await saveOrder({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (error) {
            alert(
              error instanceof Error
                ? error.message
                : "Payment verification failed"
            );
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", (response: any) => {
        alert(response.error.description || "Payment failed");
      });

      razorpay.open();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };



  return (

    <main className="min-h-screen bg-[#fffdf8] text-gray-900">

      <nav className="relative flex items-center justify-between px-3 sm:px-6 md:px-16 py-5 bg-white shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600">          TreFood<span className="text-green-600">.</span>
        </h1>

        <div className="hidden xl:flex gap-9 font-medium">
          <a href="#" className="text-orange-600">Home</a>
          <a href="#menu" className="hover:text-orange-600">Menu</a>
          <a href="#about" className="hover:text-orange-600">About</a>
          <a href="#contact" className="hover:text-orange-600">Contact</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">          <div className="relative">
          <Search className="hidden xl:block absolute left-3 top-3 text-gray-400" size={18} />          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hidden xl:block w-48 border border-gray-300 rounded-full py-2 pl-10 pr-3 outline-none focus:border-orange-500" />
        </div>          <div className="relative">
            <ShoppingCart
              className="cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            />

            <span className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>

          {currentUser ? (
            <div className="hidden xl:flex items-center gap-3">
              <span className="font-semibold text-gray-700">
                Hi, {currentUser.name}
              </span>

              <button
                onClick={() => setIsOrdersOpen(true)}
                className="bg-orange-500 text-white px-5 py-2.5 rounded-full hover:bg-orange-600"
              >
                My Orders
              </button>

              <button
                onClick={async () => {
                  try {
                    await fetch("/api/customer-logout", {
                      method: "POST",
                    });

                    localStorage.removeItem("trefood_logged_in_user");
                    setCurrentUser(null);
                    alert("Logged out successfully!");
                  } catch {
                    alert("Unable to logout. Please try again.");
                  }
                }}
                className="bg-red-500 text-white px-5 py-2.5 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsAuthOpen(true);
                setIsSignup(false);
              }}
              className="hidden xl:block bg-orange-600 text-white px-6 py-2.5 rounded-full hover:bg-orange-700"
            >
              Login
            </button>
          )}

          {isAdminLoggedIn ? (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hidden xl:block bg-gray-800 text-white px-5 py-2.5 rounded-full hover:bg-gray-900"
            >
              Admin Panel
            </button>
          ) : (
            <button
              onClick={() => setIsAdminLoginOpen(true)}
              className="hidden xl:block bg-gray-800 text-white px-5 py-2.5 rounded-full hover:bg-gray-900"
            >
              Admin Login
            </button>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 z-50 flex w-full flex-col gap-5 bg-white p-6 shadow-lg xl:hidden">
            <a href="#" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>

            {currentUser ? (
              <>
                <p className="border-t pt-4 font-semibold text-gray-700">
                  Hi, {currentUser.name}
                </p>

                <button
                  onClick={() => {
                    setIsOrdersOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-orange-600 font-medium"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("trefood_logged_in_user");
                    setCurrentUser(null);
                    setIsMenuOpen(false);
                  }}
                  className="text-left font-medium text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsSignup(false);
                  setIsMenuOpen(false);
                }}
                className="text-left font-medium"
              >
                Login
              </button>
            )}

            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setIsMenuOpen(false);
                }}
                className="text-left font-medium"
              >
                Admin Panel
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAdminLoginOpen(true);
                  setIsMenuOpen(false);
                }}
                className="text-left font-medium"
              >
                Admin Login
              </button>
            )}


          </div>
        )}

      </nav>
      <div className="px-4 py-3 bg-white xl:hidden">
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search your favourite food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <section className="px-4 sm:px-6 md:px-10 xl:px-16 py-12 md:py-16 xl:py-20 flex flex-col xl:flex-row items-center gap-10 xl:gap-12">
        <div className="flex-1">

          <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold text-sm">
            Delicious Food, Happy Moments
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mt-7 leading-tight">
            Enjoy Your
            <span className="text-orange-600"> Favourite </span>
            Food Anytime.
          </h1>

          <p className="text-gray-500 text-lg mt-6 leading-relaxed max-w-xl">
            Discover amazing flavours, explore delicious meals
            and get your favourite food delivered fresh to your doorstep
            with TreFood.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">

            <a
              href="#menu"
              className="bg-orange-600 text-white px-8 py-4 rounded-full flex items-center gap-3 font-semibold hover:bg-orange-700"
            >
              Explore Menu <ArrowRight size={20} />
            </a>

            <button className="border border-gray-300 px-8 py-4 rounded-full font-semibold hover:bg-gray-100">
              Learn More
            </button>

          </div>

          <div className="flex items-center gap-3 mt-9 text-gray-500">
            <MapPin className="text-orange-600" />
            Fresh food delivered to your location
          </div>

        </div>

        <div className="flex-1 relative">

          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900"
            alt="Fresh delicious food"
            className="w-full rounded-3xl shadow-2xl"
          />

          <div className="absolute bottom-5 left-5 bg-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold">4.9/5</span>
            </div>
            <p className="text-sm text-gray-500">Customer Rating</p>
          </div>

        </div>

      </section>

      <section className="px-4 sm:px-6 md:px-10 xl:px-16 py-10 md:py-12 bg-white" id="menu">

        <div className="text-center mb-10">
          <p className="text-orange-600 font-semibold">EXPLORE MENU</p>
          <h2 className="text-4xl font-bold mt-3">
            Popular Categories
          </h2>
          <p className="text-gray-500 mt-3">
            Choose your favourite food category.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === category.name ? "" : category.name
                );
                setSearchTerm("");
              }}
              className={`bg-[#fff8ef] rounded-2xl p-7 text-center hover:bg-orange-100 hover:-translate-y-1 transition cursor-pointer ${selectedCategory === category.name
                ? "border-2 border-orange-500 bg-orange-100"
                : ""
                }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 object-cover rounded-xl mx-auto"
              />

              <h3 className="font-bold mt-4">{category.name}</h3>

            </div>
          ))}

        </div>

      </section>

      <section className="px-4 sm:px-6 md:px-10 xl:px-16 py-12 md:py-14 xl:py-16" id="about">

        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10">

          <div >
            <p className="text-orange-600 font-semibold">OUR SPECIALS</p>
            <h2 className="text-4xl font-bold mt-3">
              Popular Dishes
            </h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 mt-5 py-2 outline-none focus:border-orange-500"
            >
              <option value="default">Sort By Price</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
            <p className="text-gray-500 mt-3">
              Freshly prepared and loved by our customers.
            </p>
          </div>

          <a href="#menu" className="text-orange-600 font-semibold flex items-center gap-2">
            View All <ArrowRight size={18} />
          </a>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {!foodsLoading && !foodsError && filteredFoods.length === 0 && (<p className="col-span-3 text-center text-gray-500 text-lg">
            No food found! 😔
          </p>
          )}
          {foodsLoading && (
            <p className="col-span-full py-10 text-center text-gray-500">
              Loading products...
            </p>
          )}

          {foodsError && (
            <p className="col-span-full py-10 text-center text-red-500">
              {foodsError}
            </p>
          )}

          {sortedFoods.map((food) => (
            <div
              key={food.name}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"            >

              <img
                src={food.image}
                alt={food.name}
                className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500" />

              <div className="p-6">

                <p className="text-orange-600 text-sm font-medium">
                  {food.category}
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {food.name}
                </h3>

                <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  {food.rating}
                  <Clock size={16} className="ml-3" />
                  25-30 min
                </div>

                <div className="flex justify-between items-center mt-6">

                  <span className="text-2xl font-bold text-orange-600">
                    ₹{food.price}
                  </span>

                  <button
                    onClick={() => {
                      if (!food.available) {
                        alert("This product is currently unavailable!");
                        return;
                      }

                      setCart((prevCart) => {
                        const existingItem = prevCart.find((item) => item.name === food.name);

                        if (existingItem) {
                          return prevCart.map((item) =>
                            item.name === food.name
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                          );
                        }

                        return [...prevCart, { name: food.name, price: `₹${food.price}`, quantity: 1 }];
                      });
                    }} className="bg-orange-600 text-white px-5 py-2.5 rounded-full hover:bg-orange-700 hover:scale-105 transition-all duration-300 shadow-md"                  >

                    Add +
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">

            <div className="flex justify-between items-center border-b pb-5">
              <h2 className="text-2xl font-bold">My Cart 🛒</h2>

              <button onClick={() => setIsCartOpen(false)}>
                <X size={25} />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-20">
                Your cart is empty!
              </p>
            ) : (
              <div className="mt-6 space-y-5">

                {cart.map((item) => (
                  <div key={item.name} className="flex justify-between items-center border-b pb-4">

                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {item.price} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCart((prevCart) =>
                            prevCart
                              .map((cartItem) =>
                                cartItem.name === item.name
                                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                  : cartItem
                              )
                              .filter((cartItem) => cartItem.quantity > 0)
                          );
                        }}
                        className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        −
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => {
                          setCart((prevCart) =>
                            prevCart.map((cartItem) =>
                              cartItem.name === item.name
                                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                : cartItem
                            )
                          );
                        }}
                        className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
                      >
                        +
                      </button>

                      <p className="font-bold text-orange-600 ml-2">
                        ₹{Number(item.price.replace("₹", "")) * item.quantity}
                      </p>
                    </div>

                  </div>
                ))}

                <div className="flex justify-between text-xl font-bold pt-5">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ₹{cart.reduce(
                      (total, item) =>
                        total + Number(item.price.replace("₹", "")) * item.quantity,
                      0
                    )}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      alert("Please login before checkout!");
                      setIsCartOpen(false);
                      setIsAuthOpen(true);
                      return;
                    }

                    setCustomerName(currentUser.name);
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-orange-600 text-white py-3 rounded-full font-semibold hover:bg-orange-700"
                >
                  Checkout
                </button>

              </div>
            )}

          </div>
        </div>
      )}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Checkout Details
              </h2>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>

            <form className="space-y-4">

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Select Payment Method
                </h3>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:border-orange-500">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-orange-600"
                    />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">
                        Pay when your order arrives
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:border-orange-500">
                    <input
                      type="radio"
                      name="payment"
                      value="Online"
                      checked={paymentMethod === "Online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-orange-600"
                    />
                    <div>
                      <p className="font-semibold">Online Payment</p>
                      <p className="text-sm text-gray-500">
                        UPI, Credit Card or Debit Card
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Continue to Payment
              </button>

            </form>
          </div>
        </div>
      )}

      {isOrderPlaced && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">

            <div className="mb-4 text-6xl">

            </div>

            <h2 className="mb-3 text-2xl font-bold text-green-600">
              Order Placed Successfully!
            </h2>

            <p className="mb-6 text-gray-600">
              Thank you for ordering with TreFood.
              Your delicious food will arrive soon!
            </p>

            <div className="mb-6 rounded-lg bg-orange-50 p-4">
              <p className="font-semibold text-gray-800">
                Payment Method
              </p>
              <p className="text-orange-600">
                {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>

            <button
              onClick={() => {
                setIsOrderPlaced(false);
                setCart([]);
                setCustomerName("");
                setPhone("");
                setAddress("");
                setCity("");
                setPincode("");
                setPaymentMethod("COD");
              }}
              className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Continue Shopping
            </button>

          </div>
        </div>
      )}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                My Orders
              </h2>

              <button
                onClick={() => setIsOrdersOpen(false)}
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>

            {myOrders.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart
                  size={52}
                  className="mx-auto text-orange-500"
                  strokeWidth={1.4}
                />

                <h3 className="mt-4 text-xl font-bold text-gray-800">
                  No Orders Yet!
                </h3>

                <p className="mt-2 text-gray-500">
                  Your orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => {
                  const trackingSteps = [
                    "Order Placed",
                    "Confirmed",
                    "Preparing",
                    "Out for Delivery",
                    "Delivered",
                  ];

                  const currentStep = trackingSteps.indexOf(order.status);

                  return (
                    <div
                      key={order.id}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-800">
                          Order #{order.id}
                        </h3>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        {order.date}
                      </p>

                      <div className="my-5">
                        <h4 className="mb-4 font-semibold text-gray-800">
                          Order Tracking
                        </h4>

                        <div className="flex items-center justify-between gap-1">
                          {[
                            "Placed",
                            "Confirmed",
                            "Preparing",
                            "On the Way",
                            "Delivered",
                          ].map((step, index) => (
                            <div
                              key={step}
                              className="flex flex-1 flex-col items-center"
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index <= currentStep
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                                  }`}
                              >
                                {index <= currentStep ? "✓" : index + 1}
                              </div>

                              <span className="mt-2 text-center text-[10px] text-gray-600 sm:text-xs">
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 h-1 rounded-full bg-gray-200">
                          <div
                            className="h-1 rounded-full bg-green-500 transition-all duration-500"
                            style={{
                              width: `${Math.max(0, currentStep) * 25}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="my-4 space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4 text-gray-700"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>

                            <span>{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm text-gray-600">
                          Customer: {order.customerName}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Address: {order.address}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Payment: {order.paymentMethod}
                        </p>

                        <p className="mt-3 text-lg font-bold text-orange-600">
                          Total: ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setIsOrdersOpen(false)}
              className="mt-6 w-full rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Close
            </button>

          </div>
        </div>
      )}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Admin Login
              </h2>

              <button
                onClick={() => setIsAdminLoginOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdminLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Admin Email
                </label>

                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Login as Admin
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              Authorized administrators only.
            </p>
          </div>
        </div>
      )}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Admin Order Management
                </h2>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setIsAdminOpen(false);
                  }}
                  className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Admin Logout
                </button>
                <p className="mt-1 text-sm text-gray-500">
                  Manage customer orders and update their status.
                </p>
              </div>

              <button
                onClick={() => setIsAdminOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">              <div className="rounded-xl bg-orange-50 p-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="mt-1 text-2xl font-bold text-orange-600">
                {orders.length}
              </h3>
            </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">Delivered</p>
                <h3 className="mt-1 text-2xl font-bold text-green-600">
                  {orders.filter(order => order.status === "Delivered").length}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="mt-1 text-2xl font-bold text-blue-600">
                  {orders.filter(order => order.status !== "Delivered").length}
                </h3>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-sm text-gray-500">Total Order Value</p>
                <h3 className="mt-1 text-2xl font-bold text-purple-600">
                  ₹{orders
                    .reduce((total, order) => total + order.total, 0)
                    .toFixed(2)}
                </h3>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-gray-500">Delivered Revenue</p>
                <h3 className="mt-1 text-2xl font-bold text-emerald-600">
                  ₹{orders
                    .filter(order => order.status === "Delivered" && order.paymentStatus === "Paid")
                    .reduce((total, order) => total + order.total, 0)
                    .toFixed(2)}
                </h3>
              </div>

            </div>
            <div className="mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                  <p className="text-sm text-gray-500">Today's Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    {todayOrders.length}
                  </h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                  <p className="text-sm text-gray-500">Today's Revenue</p>
                  <h3 className="text-2xl font-bold text-green-600 mt-2">
                    ₹{todayRevenue.toFixed(2)}
                  </h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                  <p className="text-sm text-gray-500">This Month's Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    {monthOrders.length}
                  </h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                  <p className="text-sm text-gray-500">This Month's Revenue</p>
                  <h3 className="text-2xl font-bold text-blue-600 mt-2">
                    ₹{monthRevenue.toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Revenue Analytics
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Weekly Revenue</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-2">
                      ₹{weeklyRevenue.toFixed(2)}
                    </h3>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">COD Revenue</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-2">
                      ₹{codRevenue.toFixed(2)}
                    </h3>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Online Revenue</p>
                    <h3 className="text-2xl font-bold text-purple-600 mt-2">
                      ₹{onlineRevenue.toFixed(2)}
                    </h3>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-2">
                      ₹{totalRevenue.toFixed(2)}                    </h3>
                  </div>
                </div>
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-800">
                Order Status Analytics
              </h3>


              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  { name: "Order Placed", bg: "bg-orange-50", text: "text-orange-600" },
                  { name: "Confirmed", bg: "bg-blue-50", text: "text-blue-600" },
                  { name: "Preparing", bg: "bg-yellow-50", text: "text-yellow-600" },
                  { name: "Out for Delivery", bg: "bg-purple-50", text: "text-purple-600" },
                  { name: "Delivered", bg: "bg-green-50", text: "text-green-600" },
                ].map((status) => (
                  <div
                    key={status.name}
                    className={`rounded-xl ${status.bg} p-4`}
                  >
                    <p className="text-sm text-gray-500">{status.name}</p>
                    <h3 className={`mt-1 text-2xl font-bold ${status.text}`}>
                      {orders.filter(order => order.status === status.name).length}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Product Management
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add, edit and delete food products.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm({
                      name: "",
                      category: "Pizza",
                      price: "",
                      rating: "4.5",
                      image: "",
                      available: true,
                    });
                    setIsProductFormOpen(true);
                  }}
                  className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
                >
                  + Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {foods.map((food) => (
                  <div
                    key={food._id}
                    className="overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-40 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{food.name}</h3>
                      <p className="text-sm text-gray-500">{food.category}</p>
                      <p className="mt-2 font-semibold text-orange-600">
                        ₹{food.price}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleEditProduct(food)}
                          className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(food._id)}
                          className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {isProductFormOpen && (
              <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold text-gray-800">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="rounded-lg border p-3 outline-none focus:border-orange-500"
                  />

                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    className="rounded-lg border p-3 outline-none focus:border-orange-500"
                  >
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Price"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="rounded-lg border p-3 outline-none focus:border-orange-500"
                  />

                  <input
                    type="number"
                    placeholder="Rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={productForm.rating}
                    onChange={(e) =>
                      setProductForm({ ...productForm, rating: e.target.value })
                    }
                    className="rounded-lg border p-3 outline-none focus:border-orange-500"
                  />

                  <input
                    type="text"
                    placeholder="Product Image URL"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="rounded-lg border p-3 outline-none focus:border-orange-500 sm:col-span-2"
                  />

                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={productForm.available}
                      onChange={(e) =>
                        setProductForm({ ...productForm, available: e.target.checked })
                      }
                    />
                    Product Available
                  </label>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={handleSaveProduct}
                    className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
                  >
                    {editingProductId ? "Update Product" : "Save Product"}
                  </button>

                  <button
                    onClick={() => {
                      setIsProductFormOpen(false);
                      setEditingProductId(null);
                    }}
                    className="rounded-lg bg-gray-200 px-5 py-2.5 font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Daily Revenue Trend
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Daily earnings overview for the last 7 days
                    </p>
                  </div>

                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                    Last 7 Days
                  </span>
                </div>

                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyRevenueData}
                      margin={{ top: 15, right: 10, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                      />

                      <Tooltip
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#revenueGradient)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>



              <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Monthly Revenue Trend
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Revenue overview for the last 6 months
                    </p>
                  </div>

                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                    Monthly Report
                  </span>
                </div>

                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenueData}
                      margin={{ top: 15, right: 10, left: 5, bottom: 5 }}
                      barCategoryGap="35%"
                    >
                      <CartesianGrid
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                      />

                      <Tooltip
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        }}
                      />

                      <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <h3 className="mb-4 text-lg font-bold text-gray-800">
                Graphical Order Analytics
              </h3>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <h4 className="mb-4 font-semibold text-gray-700">
                    Order Status Distribution
                  </h4>

                  {orders.length === 0 ? (
                    <p className="py-16 text-center text-gray-500">No order data available</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={95}
                          paddingAngle={4}
                          cornerRadius={5}
                          stroke="none"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                          }}
                        />

                        <Legend
                          verticalAlign="bottom"
                          height={35}
                          iconType="circle"
                          iconSize={9}
                          formatter={(value) => (
                            <span className="text-sm text-gray-600">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <h4 className="mb-4 font-semibold text-gray-700">
                    Orders by Status
                  </h4>

                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={orderStatusBarData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        horizontal={false}
                      />

                      <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        type="category"
                        dataKey="status"
                        width={110}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        }}
                      />

                      <Bar
                        dataKey="orders"
                        name="Total Orders"
                        fill="#6366f1"
                        radius={[0, 8, 8, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                </div>
              </div>
            </div>

            <div className="mb-5">
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
            {orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No customer orders available.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    No matching orders found.
                  </p>
                ) : (
                  filteredOrders.map(order => (

                    <div key={order.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <h3 className="font-bold text-gray-800">{order.id}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Customer: {order.customerName}
                          </p>

                          <p className="text-sm text-gray-500">
                            Phone: {order.phone}
                          </p>

                          <p className="text-sm text-gray-500">
                            Address: {order.address}
                          </p>

                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-700">
                              Ordered Items:
                            </p>

                            {order.items.map((item, index) => (
                              <p key={index} className="text-sm text-gray-500">
                                {item.name} × {item.quantity}
                              </p>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>

                        <div className="sm:text-right">
                          <p className="font-bold text-orange-600">
                            ₹{order.total.toFixed(2)}
                          </p>

                          <p className="text-sm text-gray-500">
                            Payment Method: {order.paymentMethod}
                          </p>

                          <p className={`mt-1 text-sm font-semibold ${order.paymentStatus === "Paid"
                            ? "text-green-600"
                            : order.paymentStatus === "Pending"
                              ? "text-orange-600"
                              : "text-red-600"
                            }`}>
                            Payment Status: {order.paymentStatus || "Pending"}
                          </p>

                          <p className="text-sm text-gray-500">
                            Gateway: {order.paymentGateway || "COD"}
                          </p>

                          {order.razorpayPaymentId && (
                            <p className="mt-1 text-xs text-gray-500 break-all">
                              Payment ID: {order.razorpayPaymentId}
                            </p>
                          )}
                          {order.paymentMethod === "COD" &&
                            order.paymentStatus === "Pending" &&
                            order.status === "Delivered" && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Have you received the COD payment?")) {
                                    handleMarkAsPaid(order.id);
                                  }
                                }}
                                className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                              >
                                Mark as Paid
                              </button>
                            )}
                        </div>

                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Order Status: {order.status}
                        </span>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value)
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute right-5 top-5 text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-orange-600">
                TreFood<span className="text-green-600">.</span>
              </h2>

              <h3 className="mt-5 text-2xl font-bold">
                {isSignup ? "Create Account" : "Welcome Back!"}
              </h3>

              <p className="mt-2 text-gray-500">
                {isSignup
                  ? "Create your account to enjoy delicious food."
                  : "Login to continue your food journey."}
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  if (isSignup) {
                    const response = await fetch("/api/signup", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: authName,
                        email: authEmail,
                        password: authPassword,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                      alert(data.message || "Signup failed");
                      return;
                    }

                    alert(data.message);
                    setIsSignup(false);
                    setAuthName("");
                    setAuthEmail("");
                    setAuthPassword("");
                  } else {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: authEmail,
                        password: authPassword,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                      alert(data.message || "Invalid email or password");
                      return;
                    }

                    alert(data.message);
                    setCurrentUser({ ...data.user, password: "" });
                    localStorage.setItem(
                      "trefood_logged_in_user",
                      JSON.stringify(data.user)
                    );
                    setIsAuthOpen(false);
                    setAuthName("");
                    setAuthEmail("");
                    setAuthPassword("");
                  }
                } catch {
                  alert("Unable to connect to server!");
                }
              }}
              className="mt-8 space-y-5"
            >

              {isSignup && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                  minLength={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />

              <button
                type="submit"
                className="w-full rounded-full bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700 transition"
              >
                {isSignup ? "Create Account" : "Login"}
              </button>

            </form>

            <p className="mt-6 text-center text-gray-600">
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setAuthName("");
                  setAuthEmail("");
                  setAuthPassword("");
                }}
                className="ml-2 font-semibold text-orange-600 hover:text-orange-700"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>

          </div>
        </div>
      )}
      <footer id="contact" className="bg-gray-950 text-white px-8 md:px-16 py-12">

        <h2 className="text-3xl font-bold text-orange-500">
          TreFood.
        </h2>

        <p className="text-gray-400 mt-4">
          Good Food. Great Mood. Delivered Fresh.
        </p>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          © 2026 TreFood. All rights reserved.
        </div>

      </footer>

    </main>
  );
}