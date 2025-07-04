import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new user submission
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      timestamp: Date.now(),
    });
    
    return userId;
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Update user's prize
export const updateUserPrize = mutation({
  args: {
    userId: v.id("users"),
    prizeName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      prizeWon: args.prizeName,
    });
    
    // Add to prize history
    await ctx.db.insert("prizeHistory", {
      userId: args.userId,
      prizeName: args.prizeName,
      timestamp: Date.now(),
    });
  },
});

// Get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get user's prize history
export const getUserPrizeHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prizeHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
}); 