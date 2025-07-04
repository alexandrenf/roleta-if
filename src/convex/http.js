import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// HTTP action to initialize prizes (can be called from external services)
http.route({
  path: "/initialize-prizes",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const result = await ctx.runMutation(api.prizes.initializePrizes);
      return new Response(JSON.stringify({ success: true, message: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// HTTP action to get all prizes (public endpoint)
http.route({
  path: "/prizes",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const prizes = await ctx.runQuery(api.prizes.getAllPrizes);
      return new Response(JSON.stringify({ success: true, data: prizes }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// HTTP action to submit user data (can be used for form submissions)
http.route({
  path: "/submit-user",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { name, email } = body;
      
      if (!name || !email) {
        return new Response(JSON.stringify({ success: false, error: "Name and email are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      const userId = await ctx.runMutation(api.users.createUser, {
        name,
        email,
      });
      
      return new Response(JSON.stringify({ success: true, userId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// HTTP action to reset prizes (admin endpoint)
http.route({
  path: "/reset-prizes",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const result = await ctx.runMutation(api.prizes.resetPrizes);
      return new Response(JSON.stringify({ success: true, message: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http; 