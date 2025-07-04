import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Initialize prizes with default values
export const initializePrizes = mutation({
  handler: async (ctx) => {
    // Check if prizes already exist
    const existingPrizes = await ctx.db.query("prizes").collect();
    
    if (existingPrizes.length > 0) {
      return "Prizes already initialized";
    }
    
    // Default prizes based on the original PrizeContext
    const defaultPrizes = [
      { name: "bag", displayName: "Bolsa", quantity: 10 },
      { name: "copo", displayName: "Copo", quantity: 5 },
      { name: "caneta", displayName: "Caneta", quantity: 15 },
      { name: "caderno", displayName: "Caderno", quantity: 7 },
      { name: "kit", displayName: "Kit", quantity: 3 },
      { name: "tentenovamente", displayName: "Tente Novamente", quantity: 0 },
    ];
    
    // Insert all prizes
    for (const prize of defaultPrizes) {
      await ctx.db.insert("prizes", prize);
    }
    
    return "Prizes initialized successfully";
  },
});

// Get all prizes
export const getAllPrizes = query({
  handler: async (ctx) => {
    return await ctx.db.query("prizes").collect();
  },
});

// Get prize by name
export const getPrizeByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prizes")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

// Add a new prize
export const addPrize = mutation({
  args: {
    name: v.string(),
    displayName: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if prize already exists
    const existingPrize = await ctx.db
      .query("prizes")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    
    if (existingPrize) {
      throw new Error("Prize with this name already exists");
    }
    
    // Validate inputs
    if (!args.name.trim() || !args.displayName.trim()) {
      throw new Error("Name and display name are required");
    }
    
    if (args.quantity < 0) {
      throw new Error("Quantity must be non-negative");
    }
    
    // Create new prize
    const prizeId = await ctx.db.insert("prizes", {
      name: args.name.toLowerCase().trim(),
      displayName: args.displayName.trim(),
      quantity: args.quantity,
    });
    
    return prizeId;
  },
});

// Remove a prize
export const removePrize = mutation({
  args: { prizeId: v.id("prizes") },
  handler: async (ctx, args) => {
    // Check if prize exists
    const prize = await ctx.db.get(args.prizeId);
    
    if (!prize) {
      throw new Error("Prize not found");
    }
    
    // Don't allow removing "tentenovamente" as it's a special case
    if (prize.name === "tentenovamente") {
      throw new Error("Cannot remove 'Tente Novamente' prize");
    }
    
    // Remove the prize
    await ctx.db.delete(args.prizeId);
    
    return "Prize removed successfully";
  },
});

// Decrease prize quantity when won
export const decreasePrizeQuantity = mutation({
  args: { prizeName: v.string() },
  handler: async (ctx, args) => {
    const prize = await ctx.db
      .query("prizes")
      .withIndex("by_name", (q) => q.eq("name", args.prizeName))
      .first();
    
    if (!prize) {
      throw new Error("Prize not found");
    }
    
    if (prize.quantity > 0) {
      await ctx.db.patch(prize._id, {
        quantity: prize.quantity - 1,
      });
    }
    
    return prize.quantity - 1;
  },
});

// Update prize quantity (admin function)
export const updatePrizeQuantity = mutation({
  args: {
    prizeName: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const prize = await ctx.db
      .query("prizes")
      .withIndex("by_name", (q) => q.eq("name", args.prizeName))
      .first();
    
    if (!prize) {
      throw new Error("Prize not found");
    }
    
    await ctx.db.patch(prize._id, {
      quantity: args.quantity,
    });
    
    return args.quantity;
  },
});

// Reset all prizes to default quantities
export const resetPrizes = mutation({
  handler: async (ctx) => {
    // Default quantities for reset
    const defaultQuantities = {
      bag: 10,
      copo: 5,
      caneta: 15,
      caderno: 7,
      kit: 3,
      tentenovamente: 0,
    };
    
    const prizes = await ctx.db.query("prizes").collect();
    
    for (const prize of prizes) {
      const defaultQuantity = defaultQuantities[prize.name] || 0;
      await ctx.db.patch(prize._id, {
        quantity: defaultQuantity,
      });
    }
    
    return "Prizes reset successfully";
  },
});

// Get prizes formatted for the wheel
export const getPrizesForWheel = query({
  handler: async (ctx) => {
    const prizes = await ctx.db.query("prizes").collect();
    
    // Filter out prizes with 0 quantity except "tentenovamente"
    const availablePrizes = prizes.filter(
      (prize) => prize.quantity > 0 || prize.name === "tentenovamente"
    );
    
    // Sort prizes by name to ensure consistent order
    availablePrizes.sort((a, b) => a.name.localeCompare(b.name));
    
    return availablePrizes.map((prize, index) => ({
      option: prize.displayName,
      style: getAlternatingColor(index),
      quantity: prize.quantity,
      name: prize.name,
    }));
  },
});

// Helper function to get alternating colors (consistent across sessions)
function getAlternatingColor(index) {
  const colors = [
    { backgroundColor: "#00963C", textColor: "#FFFFFF" }, // Green
    { backgroundColor: "#FAC800", textColor: "#000000" }, // Yellow
    { backgroundColor: "#014F8C", textColor: "#FFFFFF" }, // Blue
    { backgroundColor: "#FF6B6B", textColor: "#FFFFFF" }, // Red
    { backgroundColor: "#4ECDC4", textColor: "#FFFFFF" }, // Teal
    { backgroundColor: "#96CEB4", textColor: "#FFFFFF" }, // Mint
    { backgroundColor: "#DDA0DD", textColor: "#FFFFFF" }, // Plum
    { backgroundColor: "#F7DC6F", textColor: "#2C3E50" }, // Light Yellow
  ];
  
  return colors[index % colors.length];
} 