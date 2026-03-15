import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with authentication fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"), // free, premium, premium_plus
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  premiumExpiresAt: timestamp("premium_expires_at"),
  welcomeEmailSent: boolean("welcome_email_sent").default(false),
  lastDripEmailDay: integer("last_drip_email_day").default(0),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
  totalTimeOnApp: integer("total_time_on_app").default(0), // minutes
  loginCount: integer("login_count").default(0),
  conversationsGenerated: integer("conversations_generated").default(0),
  messagesSentByAI: integer("messages_sent_by_ai").default(0),
  feedbackGiven: boolean("feedback_given").default(false),
  subscriptionStartDate: timestamp("subscription_start_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  originalMessage: text("original_message").notNull(),
  tone: text("tone").notNull(),
  generatedReplies: text("generated_replies").array().notNull(),
  selectedReply: text("selected_reply"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedReplies = pgTable("saved_replies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  replyText: text("reply_text").notNull(),
  tone: text("tone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support chat messages for Romeo AI
export const supportChats = pgTable("support_chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertReplySchema = createInsertSchema(replies).omit({
  id: true,
  createdAt: true,
});

export const insertSavedReplySchema = createInsertSchema(savedReplies).omit({
  id: true,
  createdAt: true,
});

export const insertSupportChatSchema = createInsertSchema(supportChats).omit({
  id: true,
  createdAt: true,
});

export const generateReplySchema = z.object({
  message: z.string().min(1, "Message is required"),
  tone: z.enum(["confident", "funny", "flirty", "creative"]),
  language: z.enum(["en", "hi"]).default("en"),
});

export const supportChatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Reply = typeof replies.$inferSelect;
export type SavedReply = typeof savedReplies.$inferSelect;
export type SupportChat = typeof supportChats.$inferSelect;
export type InsertReply = z.infer<typeof insertReplySchema>;
export type InsertSavedReply = z.infer<typeof insertSavedReplySchema>;
export type InsertSupportChat = z.infer<typeof insertSupportChatSchema>;
export type GenerateReplyRequest = z.infer<typeof generateReplySchema>;
export type SupportChatRequest = z.infer<typeof supportChatSchema>;
