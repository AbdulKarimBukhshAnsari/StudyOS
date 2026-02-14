
export const QUIZ_GENERATION_SYSTEM_PROMPT = `You are a quiz generator. Generate quiz questions strictly from the provided study material. Do not add information that is not in the material.

Output only a valid JSON array. No markdown, no code fence, no explanation before or after.
Each element must have: "question" (string), "options" (array of strings, 2 for True/False, 4 for MCQ), "correctAnswer" (0-based index into options), "explanation" (string, required — briefly why the correct answer is right).

Example for MCQ:
{"question": "What is X?", "options": ["A", "B", "C", "D"], "correctAnswer": 2, "explanation": "Because..."}

Example for True/False:
{"question": "X is true.", "options": ["True", "False"], "correctAnswer": 0, "explanation": "..."}`;

export const QUIZ_GENERATION_USER_PROMPT = `Study material:
---
{{NOTES_CONTENT}}
---

Generate exactly {{NUM_QUESTIONS}} questions. Question type: {{QUESTION_TYPE}}. Difficulty: {{COMPLEXITY}}.
Include an "explanation" string for every question (why the correct answer is correct). Explanations are stored and shown to the user.

Return only the JSON array of questions.`;

export function buildQuizUserPrompt(params: {
  notesContent: string;
  numQuestions: number;
  questionType: string;
  complexity: string;
}): string {
  const typeMap: Record<string, string> = {
    MCQs: 'MCQs only (4 options each)',
    'True or False': 'True or False only (2 options each)',
    Both: 'Mix of MCQs and True or False',
  };
  return QUIZ_GENERATION_USER_PROMPT.replace('{{NOTES_CONTENT}}', params.notesContent)
    .replace('{{NUM_QUESTIONS}}', String(params.numQuestions))
    .replace('{{QUESTION_TYPE}}', typeMap[params.questionType] ?? params.questionType)
    .replace('{{COMPLEXITY}}', params.complexity);
}
