import {
  users,
  replies,
  savedReplies,
  supportChats,
  type User,
  type UpsertUser,
  type Reply,
  type InsertReply,
  type SavedReply,
  type InsertSavedReply,
  type SupportChat,
  type InsertSupportChat
} from "./schema.ts";
import { db } from "./db.ts";
import { eq, sql, and, or, gte, isNotNull } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createReply(reply: InsertReply): Promise<Reply>;
  getRepliesByUserId(userId: string): Promise<Reply[]>;
  getRepliesByUserIdAndDate(userId: string, date: string): Promise<Reply[]>;
  createSavedReply(savedReply: InsertSavedReply): Promise<SavedReply>;
  getSavedRepliesByUserId(userId: string): Promise<SavedReply[]>;
  deleteSavedReply(id: number, userId: string): Promise<boolean>;
  createSupportChat(chat: InsertSupportChat): Promise<SupportChat>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  updateSubscriptionStatus(userId: string, status: string): Promise<User>;
  activatePremiumSubscription(userId: string, data: {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
    subscriptionStartDate?: Date;
  }): Promise<User>;
  getUserByStripeCustomerId(customerId: string): Promise<User[]>;
  getUserByEmail(email: string): Promise<User[]>;
  generateReferralCode(userId: string): Promise<User>;
  applyReferralReward(userId: string, referredUserId: string): Promise<void>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  updateUserActivity(userId: string, data: { lastActiveDate?: Date; totalTimeOnApp?: number; loginCount?: number }): Promise<User>;
  incrementUserStats(userId: string, data: { conversationsGenerated?: number; messagesSentByAI?: number }): Promise<User>;
  markFeedbackGiven(userId: string): Promise<User>;
  getAdminMetrics(): Promise<{
    totalUsers: number;
    premiumSubscribers: number;
    premiumPlusSubscribers: number;
    cancelledSubscriptions: number;
    weeklyGrowth: { users: number; subscriptions: number };
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createReply(insertReply: InsertReply): Promise<Reply> {
    const [reply] = await db
      .insert(replies)
      .values({
        ...insertReply,
        userId: insertReply.userId || null,
      })
      .returning();
    return reply;
  }

  async getRepliesByUserId(userId: string): Promise<Reply[]> {
    return await db.select().from(replies).where(eq(replies.userId, userId));
  }

  async getRepliesByUserIdAndDate(userId: string, date: string): Promise<Reply[]> {
    const userReplies = await db.select().from(replies).where(eq(replies.userId, userId));
    return userReplies.filter(reply => 
      reply.createdAt && reply.createdAt.toISOString().split('T')[0] === date
    );
  }

  async createSavedReply(insertSavedReply: InsertSavedReply): Promise<SavedReply> {
    const [savedReply] = await db
      .insert(savedReplies)
      .values({
        ...insertSavedReply,
        userId: insertSavedReply.userId || null,
      })
      .returning();
    return savedReply;
  }

  async getSavedRepliesByUserId(userId: string): Promise<SavedReply[]> {
    return await db.select().from(savedReplies).where(eq(savedReplies.userId, userId));
  }

  async deleteSavedReply(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(savedReplies)
      .where(eq(savedReplies.id, id) && eq(savedReplies.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  async createSupportChat(chat: InsertSupportChat): Promise<SupportChat> {
    const [supportChat] = await db
      .insert(supportChats)
      .values({
        ...chat,
        userId: chat.userId || null,
      })
      .returning();
    return supportChat;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "active",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateSubscriptionStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async activatePremiumSubscription(userId: string, data: {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
    subscriptionStartDate?: Date;
  }): Promise<User> {
    const updateData: any = {
      subscriptionStatus: data.subscriptionStatus ?? "premium",
      subscriptionStartDate: data.subscriptionStartDate ?? new Date(),
      updatedAt: new Date(),
    };

    if (data.stripeCustomerId !== undefined) {
      updateData.stripeCustomerId = data.stripeCustomerId;
    }

    if (data.stripeSubscriptionId !== undefined) {
      updateData.stripeSubscriptionId = data.stripeSubscriptionId;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId));
  }

  async getUserByEmail(email: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.email, email));
  }

  async generateReferralCode(userId: string): Promise<User> {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [user] = await db
      .update(users)
      .set({ referralCode })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async applyReferralReward(userId: string, referredUserId: string): Promise<void> {
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 7); // 7 days free premium
    
    await db
      .update(users)
      .set({ 
        subscriptionStatus: "premium",
        premiumExpiresAt,
        referredBy: referredUserId
      })
      .where(eq(users.id, userId));
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
    return user;
  }

  async updateUserActivity(userId: string, data: { lastActiveDate?: Date; totalTimeOnApp?: number; loginCount?: number }): Promise<User> {
    const updateData: any = { updatedAt: new Date() };
    if (data.lastActiveDate) updateData.lastActiveDate = data.lastActiveDate;
    if (data.totalTimeOnApp !== undefined) updateData.totalTimeOnApp = data.totalTimeOnApp;
    if (data.loginCount !== undefined) updateData.loginCount = data.loginCount;

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async incrementUserStats(userId: string, data: { conversationsGenerated?: number; messagesSentByAI?: number }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const updateData: any = { updatedAt: new Date() };
    if (data.conversationsGenerated) {
      updateData.conversationsGenerated = (user.conversationsGenerated || 0) + data.conversationsGenerated;
    }
    if (data.messagesSentByAI) {
      updateData.messagesSentByAI = (user.messagesSentByAI || 0) + data.messagesSentByAI;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async markFeedbackGiven(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ feedbackGiven: true, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAdminMetrics(): Promise<{
    totalUsers: number;
    premiumSubscribers: number;
    premiumPlusSubscribers: number;
    cancelledSubscriptions: number;
    weeklyGrowth: { users: number; subscriptions: number };
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get total users
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get premium subscribers
    const premiumResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionStatus, 'premium'));
    const premiumSubscribers = premiumResult[0]?.count || 0;

    // Get premium plus subscribers
    const premiumPlusResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionStatus, 'premium_plus'));
    const premiumPlusSubscribers = premiumPlusResult[0]?.count || 0;

    // Get cancelled subscriptions (users who had premium but now free)
    const cancelledResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(
        eq(users.subscriptionStatus, 'free'),
        isNotNull(users.stripeCustomerId)
      ));
    const cancelledSubscriptions = cancelledResult[0]?.count || 0;

    // Get weekly growth - new users
    const weeklyUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, oneWeekAgo));
    const weeklyUsers = weeklyUsersResult[0]?.count || 0;

    // Get weekly growth - new subscriptions
    const weeklySubsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(
        gte(users.subscriptionStartDate, oneWeekAgo),
        or(eq(users.subscriptionStatus, 'premium'), eq(users.subscriptionStatus, 'premium_plus'))
      ));
    const weeklySubscriptions = weeklySubsResult[0]?.count || 0;

    return {
      totalUsers,
      premiumSubscribers,
      premiumPlusSubscribers,
      cancelledSubscriptions,
      weeklyGrowth: {
        users: weeklyUsers,
        subscriptions: weeklySubscriptions
      }
    };
  }
}

export const storage = new DatabaseStorage();
