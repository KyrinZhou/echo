import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("assistant"), v.literal("user")),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      text: args.text,
    });
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.text,
    });
    return id;
  },
});
