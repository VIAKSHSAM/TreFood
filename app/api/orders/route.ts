import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";
import { verifyCustomer } from "@/lib/customerAuth";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const customer = verifyCustomer(request);

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to place an order",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(customer.userId).select("name email");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );
    }

    const orderData = await request.json();
    if (orderData.paymentMethod === "Online") {
      if (
        !orderData.razorpayPaymentId ||
        !orderData.razorpayOrderId
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Razorpay payment details are missing",
          },
          { status: 400 }
        );
      }
    }

    let paymentStatus = "Pending";
    let paymentGateway = "COD";

    if (orderData.paymentMethod === "Online") {
      const secret = process.env.RAZORPAY_KEY_SECRET;

      if (
        !secret ||
        !orderData.razorpayOrderId ||
        !orderData.razorpayPaymentId ||
        !orderData.razorpaySignature
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Payment verification details are missing",
          },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(
          `${orderData.razorpayOrderId}|${orderData.razorpayPaymentId}`
        )
        .digest("hex");

      const isAuthentic =
        /^[a-f0-9]{64}$/i.test(orderData.razorpaySignature) &&
        crypto.timingSafeEqual(
          Buffer.from(generatedSignature, "hex"),
          Buffer.from(orderData.razorpaySignature, "hex")
        );

      if (!isAuthentic) {
        return NextResponse.json(
          {
            success: false,
            message: "Payment verification failed",
          },
          { status: 400 }
        );
      }

      paymentStatus = "Paid";
      paymentGateway = "Razorpay";
    }


    const order = await Order.create({

      ...orderData,
      customerName: user.name,
      customerEmail: user.email,
      paymentStatus,
      paymentGateway,
      razorpayPaymentId: orderData.razorpayPaymentId || "",
      razorpayOrderId: orderData.razorpayOrderId || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order saved successfully!",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = verifyAdmin(request);
    const customer = verifyCustomer(request);

    if (!isAdmin && !customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    let orders;

    if (isAdmin) {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      if (!customer) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized access",
          },
          { status: 401 }
        );
      }

      const user = await User.findById(customer.userId).select("email");

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Customer not found",
          },
          { status: 404 }
        );
      }

      orders = await Order.find({
        customerEmail: user.email,
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id, status, paymentStatus } = await request.json();

    const allowedStatuses = [
      "Order Placed",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (
      !id ||
      (status && !allowedStatuses.includes(status)) ||
      (paymentStatus && paymentStatus !== "Paid") ||
      (!status && !paymentStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID, status or payment status",
        },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ id });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    if (paymentStatus === "Paid") {
      if (
        order.paymentMethod !== "COD" ||
        order.paymentGateway !== "COD" ||
        order.status !== "Delivered"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Only delivered COD orders can be marked as paid",
          },
          { status: 400 }
        );
      }

      order.paymentStatus = "Paid";
    }

    if (status) {
      order.status = status;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully!",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}