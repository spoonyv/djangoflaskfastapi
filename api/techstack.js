export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, description, framework } = req.body;

    const prompt = `You are recommending a practical 2026 tech stack for this SaaS product:

Product: ${name}
Description: ${description}
Framework: ${framework}

Rules - be opinionated, not generic:
- Frontend: Pick ONE framework with specific tooling (e.g., "React + Vite + Tailwind" not "React, Vue, Angular")
- Database: Pick ONE primary DB. Add Redis only if caching/queues needed.
- Auth: Be specific to the framework (e.g., "Django Allauth" for Django, "FastAPI-Users + JWT" for FastAPI)
- Deployment: Docker + one cloud platform (not three options)
- Payments: Always include Stripe for SaaS billing
- Extras: Match complexity to product scope. For MVPs use Celery+Redis not Airflow. For real-time use WebSockets or Pusher.

Return ONLY valid JSON:
{
  "frontend": ["one stack e.g. React + Vite + Tailwind"],
  "database": ["primary db", "cache if needed"],
  "authentication": ["specific auth solution"],
  "deployment": ["Docker", "one cloud platform"],
  "payments": ["Stripe + relevant integration"],
  "extras": ["practical tools for this scope"]
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
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate tech stack' });
    }
}
