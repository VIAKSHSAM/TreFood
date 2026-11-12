import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const foods = [
  {
    name: "Cheese Pizza",
    category: "Pizza",
    price: 199,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
  },
  {
    name: "Classic Burger",
    category: "Burger",
    price: 149,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    name: "Chicken Biryani",
    category: "Biryani",
    price: 249,
    rating: 4.9,
    image: "https://images.deliveryhero.io/image/fd-my/LH/j8v8-listing.jpg",
  },
  {
    name: "Veg Hakka Noodles",
    category: "Chinese",
    price: 179,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
  },
  {
    name: "Chocolate Cake",
    category: "Desserts",
    price: 129,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
  },
  {
    name: "Cold Coffee",
    category: "Drinks",
    price: 99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  },
];

export async function POST() {
  try {
    await dbConnect();

    const operations = foods.map((food) => ({
      updateOne: {
        filter: { name: food.name },
        update: { $setOnInsert: food },
        upsert: true,
      },
    }));

    await Product.bulkWrite(operations);

    const products = await Product.find();

    return NextResponse.json({
      success: true,
      message: "Products inserted successfully!",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Product insertion failed",
      },
      { status: 500 }
    );
  }
}