export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { keywords } = req.body;

    const prompt = `Based on the keywords "${keywords}", generate exactly 3 SaaS product ideas in JSON format.

Rules for each framework:
1. Django: Full website with admin panel, user management, database-heavy. Good for complete business platforms.
2. Flask: Lightweight tool, small API, quick prototype. Simple, focused, minimal.
3. FastAPI: High-performance API, microservice, AI/ML, real-time, async, modern cloud-native.

Return ONLY valid JSON in this exact format, no other text:
{
  "django": {"name": "Product Name", "description": "One sentence description"},
  "flask": {"name": "Product Name", "description": "One sentence description"},
  "fastapi": {"name": "Product Name", "description": "One sentence description"}
}`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
                max_tokens: 500
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate ideas' });
    }
}
