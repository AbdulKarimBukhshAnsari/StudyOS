-- RLS Policies for users table
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON "users" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON "users" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON "users" FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for semesters table
-- Users can only access their own semesters
CREATE POLICY "Users can view own semesters" ON "semesters" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own semesters" ON "semesters" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own semesters" ON "semesters" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own semesters" ON "semesters" FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for subjects table
-- Users can only access subjects in their own semesters
CREATE POLICY "Users can view own subjects" ON "subjects" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can insert own subjects" ON "subjects" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can update own subjects" ON "subjects" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can delete own subjects" ON "subjects" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "semesters" 
    WHERE "semesters"."id" = "subjects"."semester_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);

-- RLS Policies for topics table
-- Users can only access topics in their own subjects
CREATE POLICY "Users can view own topics" ON "topics" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can insert own topics" ON "topics" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can update own topics" ON "topics" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can delete own topics" ON "topics" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "topics"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);

-- RLS Policies for tests table
-- Users can only access tests in their own subjects
CREATE POLICY "Users can view own tests" ON "tests" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can insert own tests" ON "tests" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can update own tests" ON "tests" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can delete own tests" ON "tests" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "subjects" 
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "subjects"."id" = "tests"."subject_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);

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
);
CREATE POLICY "Users can insert own notes" ON "notes" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can update own notes" ON "notes" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can delete own notes" ON "notes" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "notes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);

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
);
CREATE POLICY "Users can insert own flashcards" ON "flashcards" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can update own flashcards" ON "flashcards" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can delete own flashcards" ON "flashcards" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "flashcards"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);

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
);
CREATE POLICY "Users can insert own quizzes" ON "quizzes" FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can update own quizzes" ON "quizzes" FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);
CREATE POLICY "Users can delete own quizzes" ON "quizzes" FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "topics" 
    INNER JOIN "subjects" ON "topics"."subject_id" = "subjects"."id"
    INNER JOIN "semesters" ON "subjects"."semester_id" = "semesters"."id"
    WHERE "topics"."id" = "quizzes"."topic_id" 
    AND "semesters"."user_id" = auth.uid()
  )
);

-- RLS Policies for quiz_results table
-- Users can only access their own quiz results
CREATE POLICY "Users can view own quiz results" ON "quiz_results" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON "quiz_results" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quiz results" ON "quiz_results" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quiz results" ON "quiz_results" FOR DELETE USING (auth.uid() = user_id);

