import { mutation } from "./_generated/server";

// Migration to remove initialQuantity field from existing prizes
export const removeInitialQuantityFromPrizes = mutation({
  handler: async (ctx) => {
    // Get all prizes
    const prizes = await ctx.db.query("prizes").collect();
    
    let updatedCount = 0;
    
    for (const prize of prizes) {
      // Check if the prize has the initialQuantity field
      if ('initialQuantity' in prize) {
        // Create a new object without the initialQuantity field
        const { initialQuantity, ...prizeWithoutInitialQuantity } = prize;
        
        // Replace the document
        await ctx.db.replace(prize._id, prizeWithoutInitialQuantity);
        updatedCount++;
      }
    }
    
    return `Migration completed. Updated ${updatedCount} prize documents.`;
  },
}); 