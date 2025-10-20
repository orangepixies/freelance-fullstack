import crypto from "crypto";

console.log("🔐 Generate Random Secrets untuk Environment Variables\n");
console.log("Copy & paste ke Vercel Environment Variables:\n");
console.log("─".repeat(60));

const jwt = crypto.randomBytes(32).toString("hex");
const authJwt = crypto.randomBytes(32).toString("hex");
const nextauth = crypto.randomBytes(32).toString("hex");

console.log(`JWT_SECRET=${jwt}`);
console.log(`AUTH_JWT_SECRET=${authJwt}`);
console.log(`NEXTAUTH_SECRET=${nextauth}`);

console.log("─".repeat(60));
console.log("\n✅ Secrets berhasil di-generate!");
console.log("📋 Copy secrets di atas ke Vercel Environment Variables\n");
