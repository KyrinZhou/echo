import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMany = query({
  args: {},
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const addUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", args);
    return userId;
  },
});
