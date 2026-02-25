import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    type: v.optional(
      v.union(v.literal("article"), v.literal("faq"), v.literal("document"))
    ),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("files")
        .filter((q) =>
          q.and(
            q.eq(q.field("type"), args.type),
            q.eq(q.field("status"), "active")
          )
        )
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("article"), v.literal("faq"), v.literal("document")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      title: args.title,
      description: args.description,
      type: args.type,
      status: "active",
      content: args.content,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("files"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal("article"), v.literal("faq"), v.literal("document"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, string> = {};
    if (fields.title !== undefined) updates.title = fields.title;
    if (fields.description !== undefined) updates.description = fields.description;
    if (fields.content !== undefined) updates.content = fields.content;
    if (fields.type !== undefined) updates.type = fields.type;
    await ctx.db.patch(id, updates);
  },
});

export const archive = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "archived" as const });
  },
});

export const remove = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
