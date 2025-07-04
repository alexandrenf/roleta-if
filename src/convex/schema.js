import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    prizeWon: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_email", ["email"]),
  
  prizes: defineTable({
    name: v.string(),
    displayName: v.string(),
    quantity: v.number(),
    initialQuantity: v.optional(v.number()),
  }).index("by_name", ["name"]),
  
  prizeHistory: defineTable({
    userId: v.id("users"),
    prizeName: v.string(),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
}); 