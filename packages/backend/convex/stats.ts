import { query } from "./_generated/server";

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const allConversations = await ctx.db.query("conversations").collect();
    const activeConversations = allConversations.filter(
      (c) => c.status === "active"
    );
    const endedConversations = allConversations.filter(
      (c) => c.status === "ended"
    );
    const allFiles = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const recentConversations = allConversations.slice(0, 5);

    const totalDuration = endedConversations.reduce(
      (sum, c) => sum + (c.duration || 0),
      0
    );
    const avgDuration =
      endedConversations.length > 0
        ? Math.round(totalDuration / endedConversations.length)
        : 0;

    return {
      totalConversations: allConversations.length,
      activeConversations: activeConversations.length,
      endedConversations: endedConversations.length,
      knowledgeBaseEntries: allFiles.length,
      avgDuration,
      recentConversations,
    };
  },
});
