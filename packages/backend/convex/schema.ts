import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }),
  conversations: defineTable({
    title: v.string(),
    status: v.union(v.literal("active"), v.literal("ended")),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    duration: v.optional(v.number()),
    lastMessage: v.optional(v.string()),
    endedAt: v.optional(v.number()),
  }),
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("assistant"), v.literal("user")),
    text: v.string(),
  }).index("by_conversation", ["conversationId"]),
  files: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("article"), v.literal("faq"), v.literal("document")),
    status: v.union(v.literal("active"), v.literal("archived")),
    content: v.string(),
  }),
});
