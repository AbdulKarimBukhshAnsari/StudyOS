
import { pgTable, uuid, text, varchar, boolean, date, integer, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user as betterAuthUser } from "./auth-schema";

// Enum for topic status
export const topicStatusEnum = pgEnum('topic_status', ['Not Clear', 'Somewhat Clear', 'Clear']);

// User profile table - 1-1 relationship with Better Auth user table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  better_auth_user_id: text('better_auth_user_id').notNull().unique().references(() => betterAuthUser.id, { onDelete: 'cascade' }),
  is_onboarded: boolean('is_onboarded').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Semester table
export const semesters = pgTable('semesters', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id').notNull().references(() => betterAuthUser.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Subject table
export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  semester_id: uuid('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  priority: integer('priority').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Topic table
export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  subject_id: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  status: topicStatusEnum('status').default('Not Clear').notNull(),
  order_index: integer('order_index').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Test table
export const tests = pgTable('tests', {
  id: uuid('id').defaultRandom().primaryKey(),
  subject_id: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  date: date('date').notNull(),
  linked_topic_ids: jsonb('linked_topic_ids').$type<string[]>().default([]),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Note table
export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic_name: varchar('topic_name', { length: 255 }).notNull(),
  topic_id: uuid('topic_id').notNull().references(() => topics.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  ai_refined: boolean('ai_refined').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Flashcard table
export const flashcards = pgTable('flashcards', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic_id: uuid('topic_id').notNull().references(() => topics.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Types for JSON fields
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type QuizAnswer = {
  questionId: string;
  selectedAnswer: number;
};

// Quiz table
export const quizzes = pgTable('quizzes', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic_id: uuid('topic_id').notNull().references(() => topics.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  notes_ids : jsonb('notes_ids').$type<string[]>().default([]),
  questions: jsonb('questions').$type<QuizQuestion[]>().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// QuizResult table
export const quizResults = pgTable('quiz_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  quiz_id: uuid('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  user_id: text('user_id').notNull().references(() => betterAuthUser.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  answers: jsonb('answers').$type<QuizAnswer[]>().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  betterAuthUser: one(betterAuthUser, {
    fields: [users.better_auth_user_id],
    references: [betterAuthUser.id],
  }),
}));

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  user: one(betterAuthUser, {
    fields: [semesters.user_id],
    references: [betterAuthUser.id],
  }),
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [subjects.semester_id],
    references: [semesters.id],
  }),
  topics: many(topics),
  tests: many(tests),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [topics.subject_id],
    references: [subjects.id],
  }),
  notes: many(notes),
  flashcards: many(flashcards),
  quizzes: many(quizzes),
}));

export const testsRelations = relations(tests, ({ one }) => ({
  subject: one(subjects, {
    fields: [tests.subject_id],
    references: [subjects.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  topic: one(topics, {
    fields: [notes.topic_id],
    references: [topics.id],
  }),
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  topic: one(topics, {
    fields: [flashcards.topic_id],
    references: [topics.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  topic: one(topics, {
    fields: [quizzes.topic_id],
    references: [topics.id],
  }),
  quizResults: many(quizResults),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizResults.quiz_id],
    references: [quizzes.id],
  }),
  user: one(betterAuthUser, {
    fields: [quizResults.user_id],
    references: [betterAuthUser.id],
  }),
}));
        