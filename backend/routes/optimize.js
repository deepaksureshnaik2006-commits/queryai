const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VALID_LEVELS = ['beginner', 'intermediate', 'expert', 'dba expert'];

const EXPLANATION_RULES = {
  beginner: `EXPLANATION STYLE — BEGINNER:
- Write like a patient teacher talking to someone brand new to databases.
- Use simple, everyday words. Never use jargon without immediately explaining it.
- Use analogies (e.g. "a full table scan is like reading every page of a book to find one word").
- Explain WHY something is slow before explaining the fix.
- Friendly, encouraging, educational tone.
- Keep sentences short. Avoid abbreviations.`,

  intermediate: `EXPLANATION STYLE — INTERMEDIATE:
- Write for a working software engineer who understands basic SQL.
- Use technical terms naturally: indexes, joins, WHERE filters, ORDER BY, subqueries, scans.
- Explain the optimization decisions clearly with cause-and-effect reasoning.
- Mention trade-offs briefly where relevant.
- Professional, developer-focused tone.`,

  expert: `EXPLANATION STYLE — EXPERT / DBA:
- Write for a senior database administrator or principal engineer.
- Use advanced query-planner terminology: sequential scans, index selectivity, cardinality estimation, predicate pushdown, I/O amplification, buffer pool pressure, optimizer cost model, covering indexes, partial indexes, MVCC overhead.
- Be concise but highly precise — no hand-holding.
- Reference execution plan implications where relevant.
- Assume deep knowledge of the specific database engine.`,

  'dba expert': `EXPLANATION STYLE — EXPERT / DBA:
- Write for a senior database administrator or principal engineer.
- Use advanced query-planner terminology: sequential scans, index selectivity, cardinality estimation, predicate pushdown, I/O amplification, buffer pool pressure, optimizer cost model, covering indexes, partial indexes, MVCC overhead.
- Be concise but highly precise — no hand-holding.
- Reference execution plan implications where relevant.
- Assume deep knowledge of the specific database engine.`,
};

router.post('/', async (req, res) => {
  try {
    const { query, db_type } = req.body;
    let { explanation_level } = req.body;

    if (!query || !db_type) {
      return res.status(400).json({ error: 'Missing query or db_type' });
    }

    const normalized = (explanation_level || 'intermediate').toLowerCase().trim();
    if (!VALID_LEVELS.includes(normalized)) {
      return res.status(400).json({ error: `Invalid explanation_level. Must be one of: beginner, intermediate, expert, dba expert` });
    }
    explanation_level = normalized;

    const explanationRule = EXPLANATION_RULES[explanation_level];

    const systemPrompt = `You are an elite database performance engineer specializing in SQL query optimization.

Your job:
1. Analyze the provided SQL query for the given database type.
2. Detect all performance bottlenecks.
3. Identify security and logic risks.
4. Produce an optimized version of the query.
5. Write the explanation according to the EXPLANATION STYLE rules below.

${explanationRule}

CRITICAL: The explanation field MUST clearly reflect the explanation level above. Each level must produce noticeably different language and depth.

Return ONLY valid JSON — no markdown, no code fences, no extra text.

Required JSON structure:
{
  "optimized_query": "string — the improved SQL query",
  "issues_found": ["string — each detected bottleneck, one per item"],
  "detected_risks": ["string — each security or logic risk, one per item"],
  "index_suggestions": ["string — plain-language description of each recommended index"],
  "index_sql": ["string — actual CREATE INDEX SQL statements"],
  "performance_gain": "string — e.g. 40x faster",
  "complexity_score": number — integer 1–100,
  "estimated_execution_time_before": "string — e.g. 2.1s",
  "estimated_execution_time_after": "string — e.g. 0.05s",
  "query_risk_level": "Low | Medium | High | Critical",
  "explanation": "string — full explanation written strictly according to the explanation level rules above"
}`;

    const userMessage = `Database type: ${db_type}
Explanation level: ${explanation_level}
SQL Query:
${query}

Analyze and optimize this query. Adapt your explanation strictly to the ${explanation_level} level rules.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.15,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0]?.message?.content;

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseError) {
      const match = responseText.match(/```json\n([\s\S]*)\n```/) || responseText.match(/```([\s\S]*)```/);
      if (match && match[1]) {
        parsedResult = JSON.parse(match[1]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    parsedResult.index_sql         = parsedResult.index_sql         || [];
    parsedResult.detected_risks    = parsedResult.detected_risks    || [];
    parsedResult.index_suggestions = parsedResult.index_suggestions || [];
    parsedResult.complexity_score  = parsedResult.complexity_score  || 50;
    parsedResult.query_risk_level  = parsedResult.query_risk_level  || 'Medium';
    parsedResult.explanation_level = explanation_level;

    res.json(parsedResult);
  } catch (error) {
    console.error('Error optimizing query:', error);
    res.status(500).json({ error: 'Failed to optimize query. Please try again.' });
  }
});

module.exports = router;
