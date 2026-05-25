const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post('/', async (req, res) => {
  try {
    const { query, db_type, explanation_level = 'Intermediate' } = req.body;

    if (!query || !db_type) {
      return res.status(400).json({ error: 'Missing query or db_type' });
    }

    const systemPrompt = `You are an expert database engineer specializing in SQL query optimization. Analyze the given SQL query and return a JSON response only, no markdown, with this exact structure:
{
  "optimized_query": "string (the improved SQL query)",
  "issues_found": ["string (e.g. Missing WHERE clause, Full table scan)"],
  "index_suggestions": ["string (explanation of what index to create)"],
  "index_sql": ["string (actual CREATE INDEX statements)"],
  "performance_gain": "string (e.g. 50x faster)",
  "explanation": "string (explain the changes tailored to a ${explanation_level} audience)",
  "complexity_score": number (1-100),
  "estimated_execution_time_before": "string (e.g. 1.5s)",
  "estimated_execution_time_after": "string (e.g. 0.02s)",
  "query_risk_level": "string (Low, Medium, High, Critical)",
  "detected_risks": ["string (specific risks detected like potential SQL injection or Cartesian join)"]
}`;

    const userMessage = `Database type: ${db_type}\nSQL Query: ${query}\nAnalyze and optimize this query. Tailor your explanation to a ${explanation_level} level.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
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
         throw new Error("Failed to parse Groq response as JSON");
      }
    }

    // Default missing fields for safety
    parsedResult.index_sql = parsedResult.index_sql || [];
    parsedResult.detected_risks = parsedResult.detected_risks || [];
    parsedResult.complexity_score = parsedResult.complexity_score || 50;
    parsedResult.query_risk_level = parsedResult.query_risk_level || "Medium";

    res.json(parsedResult);
  } catch (error) {
    console.error('Error optimizing query:', error);
    res.status(500).json({ error: 'Failed to optimize query. Please try again.' });
  }
});

module.exports = router;
