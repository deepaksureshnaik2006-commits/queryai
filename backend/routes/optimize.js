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

function detectDialectMismatch(query, selectedDbType) {
  const q = query.toUpperCase();
  const type = selectedDbType.toLowerCase().trim();

  const hasSqlServer = /\bTOP\s+\d+\b/.test(q) || /\bISNULL\s*\(/.test(q) || /\bGETDATE\s*\(/.test(q) || /\bNEWID\s*\(/.test(q) || /\bNVARCHAR\b/.test(q) || /\bDATETIME2\b/.test(q) || /\bCHARINDEX\s*\(/.test(q);
  const hasPostgres = /\bSERIAL\b/.test(q) || /\bILIKE\b/.test(q) || /\bRETURNING\b/.test(q) || /::\s*[a-zA-Z]+/.test(query);
  const hasMysql = /\bAUTO_INCREMENT\b/.test(q) || /\bIFNULL\s*\(/.test(q) || query.includes('`');

  if (type === 'postgresql') {
    if (hasSqlServer) return "Mismatch: SQL Server syntax found in PostgreSQL.";
    if (hasMysql) return "Mismatch: MySQL syntax found in PostgreSQL.";
  } else if (type === 'mysql') {
    if (hasSqlServer) return "Mismatch: SQL Server syntax found in MySQL.";
    if (hasPostgres) return "Mismatch: PostgreSQL syntax found in MySQL.";
  } else if (type === 'sql server' || type === 'tsql') {
    if (hasPostgres) return "Mismatch: PostgreSQL syntax found in SQL Server.";
    if (hasMysql) return "Mismatch: MySQL syntax found in SQL Server.";
  } else if (type === 'sqlite') {
    if (hasSqlServer) return "Mismatch: SQL Server syntax found in SQLite.";
    if (hasPostgres) return "Mismatch: PostgreSQL syntax found in SQLite.";
  }
  return null;
}

router.post('/', async (req, res) => {
  try {
    const { query, db_type } = req.body;
    let { explanation_level } = req.body;

    if (!query || !db_type) {
      return res.status(400).json({ error: 'Missing query or db_type' });
    }

    const hardDialectError = detectDialectMismatch(query, db_type);
    if (hardDialectError) {
      return res.status(400).json({ error: hardDialectError });
    }

    const normalized = (explanation_level || 'intermediate').toLowerCase().trim();
    if (!VALID_LEVELS.includes(normalized)) {
      return res.status(400).json({ error: `Invalid explanation_level. Must be one of: beginner, intermediate, expert, dba expert` });
    }
    explanation_level = normalized;

    const explanationRule = EXPLANATION_RULES[explanation_level];

    const systemPrompt = `You are an elite database performance engineer specializing in SQL query optimization.

CRITICAL FIRST STEP - DIALECT VALIDATION:
You MUST verify if the query's syntax matches the selected database type.
If you detect syntax, quotes, or functions from a DIFFERENT dialect (for example, a SQL Server query but PostgreSQL is selected):
1. You MUST set "is_dialect_mismatch" to true.
2. You MUST provide a clear "dialect_mismatch_error" (e.g. "Database Dialect Mismatch: You selected PostgreSQL, but the query uses SQL Server syntax.").
3. Leave all other fields empty/null.

Your job (if the dialect is correct):
1. Analyze the provided SQL query for the given database type.
2. Detect all performance bottlenecks.
3. Identify security and logic risks.
4. Produce an optimized version of the query.
5. Write the explanation according to the EXPLANATION STYLE rules below.
6. For ANY recommended indexes, you MUST explicitly explain WHY the index is needed (e.g., which WHERE clause, JOIN, or sort operation it speeds up). CRITICAL: Use varied, natural language for your explanations. Do NOT start every explanation with "To speed up". You MUST provide exactly ONE explanation for EVERY SQL index you suggest (the lengths of the index_suggestions and index_sql arrays MUST perfectly match).

${explanationRule}

CRITICAL DATABASE SAFETY & INTELLIGENCE RULES:
- Do NOT optimize by deleting: triggers, procedures, audit systems, logging mechanisms, business workflows, or transactional behavior.
- Before optimization:
  1. Detect whether the SQL implements business logic or auditing.
  2. Preserve all functional behavior and side effects.
  3. Never replace trigger systems with simple SELECT queries.
  4. Never remove automatic logging functionality.
  5. Only optimize safely through: indexing, formatting, scalability improvements, reducing redundancy, and performance tuning.
- Optimization must preserve complete database behavior and side effects.
- If code is already functionally correct, prioritize analysis and recommendations over aggressive rewriting.
- Distinguish between: performance inefficiencies, architectural/business requirements, and intentional procedural logic.
- If triggers, procedures, cursors, or audit systems are necessary for functionality:
  * Preserve them.
  * Explain tradeoffs.
  * Suggest maintainability or scalability improvements instead of removal.
- Prefer: set-based optimizations, indexing improvements, reusable abstractions, query planner optimization, and reduced redundancy.
- Never reduce functionality for the sake of shorter code.

CRITICAL: The explanation field MUST clearly reflect the explanation level above. Each level must produce noticeably different language and depth.

Return ONLY valid JSON — no markdown, no code fences, no extra text.

Required JSON structure (MUST start with validation fields):
{
  "is_dialect_mismatch": boolean — true if the query syntax doesn't match the selected database type, false otherwise,
  "dialect_mismatch_error": "string or null" — the error message if is_dialect_mismatch is true,
  "optimized_query": "string or null — the improved SQL query. CRITICAL: MUST be formatted beautifully with newlines (\\n). DO NOT RETURN IT ON A SINGLE LINE.",
  "issues_found": ["string — each detected bottleneck, one per item"],
  "detected_risks": ["string — each security or logic risk, one per item"],
  "index_suggestions": ["string — plain-language description of each recommended index. You MUST explicitly explain exactly WHY the index is needed and what it speeds up. CRITICAL: Do NOT start every reason with 'To speed up...'. Use varied, natural phrasing."],
  "index_sql": ["string — actual CREATE INDEX SQL statements. Format beautifully with newlines (\\n)."],
  "performance_gain": "string or null — e.g. 40x faster. Keep it extremely concise (max 3 words).",
  "complexity_score": number or null — integer 1–100,
  "estimated_execution_time_before": "string or null — e.g. 2.1s",
  "estimated_execution_time_after": "string or null — e.g. 0.05s",
  "query_risk_level": "Low | Medium | High | Critical | null",
  "explanation": "string or null — full explanation written strictly according to the explanation level rules"
}`;

    const userMessage = `Database type: ${db_type}
Explanation level: ${explanation_level}
SQL Query:
${query}

CRITICAL: Evaluate "is_dialect_mismatch" first. If the query syntax is clearly for a different database (e.g. SQL Server syntax when PostgreSQL is selected), set it to true and return the error.
Otherwise, set it to false and proceed with analysis and optimization according to the rules.`;

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

    if (parsedResult.is_dialect_mismatch) {
      return res.status(400).json({ error: parsedResult.dialect_mismatch_error || 'Database Dialect Mismatch. Please check your query syntax and selected database.' });
    }

    if (parsedResult.error) {
      return res.status(400).json({ error: parsedResult.error });
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
