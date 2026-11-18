import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const audienceEnum = pgEnum('lines_audience', ['rider', 'driver', 'partner']);
export const waitlist = pgTable('lines_waitlist', {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 254 }).notNull(),
  intent: audienceEnum().notNull(),
  locale: varchar({ length: 2 }).notNull(),
  city: varchar({ length: 48 }),
  source: varchar({ length: 64 }).notNull(),
  consentVersion: varchar({ length: 20 }).notNull(),
  consentAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  unsubscribeToken: uuid().defaultRandom().notNull().unique(),
  confirmationSentAt: timestamp({ withTimezone: true }),
}, (table) => [uniqueIndex('lines_waitlist_email_intent').on(table.email, table.intent)]);

export const inquiries = pgTable('lines_inquiries', {
  id: uuid().defaultRandom().primaryKey(),
  reference: uuid().notNull().unique(),
  name: varchar({ length: 180 }).notNull(),
  email: varchar({ length: 254 }).notNull(),
  kind: varchar({ length: 32 }).notNull(),
  locale: varchar({ length: 2 }).notNull(),
  message: text().notNull(),
  delivery: varchar({ length: 16 }).default('pending').notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => [index('lines_inquiries_created').on(table.createdAt)]);

export const consentLog = pgTable('lines_consent_log', {
  id: uuid().defaultRandom().primaryKey(),
  visitor: uuid().notNull(),
  analytics: boolean().notNull(),
  marketing: boolean().notNull(),
  version: varchar({ length: 20 }).notNull(),
  locale: varchar({ length: 2 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => [index('lines_consent_visitor').on(table.visitor)]);
