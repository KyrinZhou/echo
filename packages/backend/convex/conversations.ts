import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("ended"))
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("status"), args.status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("conversations").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      title: args.title,
      status: "active",
      customerName: args.customerName,
      customerEmail: args.customerEmail,
    });
  },
});

export const end = mutation({
  args: {
    id: v.id("conversations"),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "ended",
      duration: args.duration,
      endedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.id))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    await ctx.db.delete(args.id);
  },
});
