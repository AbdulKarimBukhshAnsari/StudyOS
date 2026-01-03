CREATE TYPE "public"."topic_status" AS ENUM('Not Clear', 'Somewhat Clear', 'Clear');--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"content" text NOT NULL,
	"ai_refined" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"questions" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "semesters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"semester_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"date" date NOT NULL,
	"linked_topic_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "topic_status" DEFAULT 'Not Clear' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_semester_id_semesters_id_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."semesters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Enable Row Level Security on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "semesters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subjects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "topics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "flashcards" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "quizzes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "quiz_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- RLS Policies for users table
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON "users" FOR SELECT USING (auth.uid() = id);--> statement-breakpoint
CREATE POLICY "Users can insert own profile" ON "users" FOR INSERT WITH CHECK (auth.uid() = id);--> statement-breakpoint
CREATE POLICY "Users can update own profile" ON "users" FOR UPDATE USING (auth.uid() = id);--> statement-breakpoint
-- RLS Policies for semesters table
-- Users can only access their own semesters
CREATE POLICY "Users can view own semesters" ON "semesters" FOR SELECT USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Users can insert own semesters" ON "semesters" FOR INSERT WITH CHECK (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Users can update own semesters" ON "semesters" FOR UPDATE USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Users can delete own semesters" ON "semesters" FOR DELETE USING (auth.uid() = user_id);--> statement-breakpoint
-- RLS Policies for subjects table
-- Users can only access subjects in their own semesters
CREATE POLICY "Users can view own subjects" ON "subjects" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can insert own subjects" ON "subjects" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can update own subjects" ON "subjects" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can delete own subjects" ON "subjects" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
-- RLS Policies for topics table
-- Users can only access topics in their own subjects
CREATE POLICY "Users can view own topics" ON "topics" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can insert own topics" ON "topics" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can update own topics" ON "topics" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can delete own topics" ON "topics" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
-- RLS Policies for tests table
-- Users can only access tests in their own subjects
CREATE POLICY "Users can view own tests" ON "tests" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can insert own tests" ON "tests" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can update own tests" ON "tests" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can delete own tests" ON "tests" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
-- RLS Policies for notes table
-- Users can only access notes in their own topics
CREATE POLICY "Users can view own notes" ON "notes" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can insert own notes" ON "notes" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can update own notes" ON "notes" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can delete own notes" ON "notes" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
-- RLS Policies for flashcards table
-- Users can only access flashcards in their own topics
CREATE POLICY "Users can view own flashcards" ON "flashcards" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can insert own flashcards" ON "flashcards" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can update own flashcards" ON "flashcards" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can delete own flashcards" ON "flashcards" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
-- RLS Policies for quizzes table
-- Users can only access quizzes in their own topics
CREATE POLICY "Users can view own quizzes" ON "quizzes" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can insert own quizzes" ON "quizzes" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can update own quizzes" ON "quizzes" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
CREATE POLICY "Users can delete own quizzes" ON "quizzes" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);--> statement-breakpoint
-- RLS Policies for quiz_results table
-- Users can only access their own quiz results
CREATE POLICY "Users can view own quiz results" ON "quiz_results" FOR SELECT USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Users can insert own quiz results" ON "quiz_results" FOR INSERT WITH CHECK (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Users can update own quiz results" ON "quiz_results" FOR UPDATE USING (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Users can delete own quiz results" ON "quiz_results" FOR DELETE USING (auth.uid() = user_id);