// Simple fallback responses for common questions
const FALLBACK_RESPONSES = {
    skills: "I specialize in full-stack development with React, Blazor WebAssembly, ASP.NET Core, C#, and modern web technologies. I have experience with databases like SQLite and SQL Server, plus authentication systems like Auth0.",
    projects: "I've built several key projects: an e-commerce platform with ASP.NET Core, an authentication system with Auth0 and React, and a Blazor WebAssembly SPA. Each showcases different aspects of modern web development.",
    experience: "I'm a Full Stack Developer focused on the .NET ecosystem, with expertise in building secure, scalable web applications and strong experience in authentication systems and responsive design.",
    contact: "Thanks for your interest! Please use the contact form on this website to reach out directly. I'd love to discuss potential opportunities or answer any specific questions about my work.",
    default: "Thanks for visiting my portfolio! I'm a full-stack developer specializing in .NET technologies. Feel free to explore my projects or use the contact form to get in touch."
};

function getFallbackResponse(prompt) {
    const lowercasePrompt = prompt.toLowerCase();
    
    if (lowercasePrompt.includes('skill') || lowercasePrompt.includes('technology') || lowercasePrompt.includes('tech stack')) {
        return FALLBACK_RESPONSES.skills;
    }
    if (lowercasePrompt.includes('project') || lowercasePrompt.includes('work') || lowercasePrompt.includes('portfolio')) {
        return FALLBACK_RESPONSES.projects;
    }
    if (lowercasePrompt.includes('experience') || lowercasePrompt.includes('background') || lowercasePrompt.includes('career')) {
        return FALLBACK_RESPONSES.experience;
    }
    if (lowercasePrompt.includes('contact') || lowercasePrompt.includes('hire') || lowercasePrompt.includes('email')) {
        return FALLBACK_RESPONSES.contact;
    }
    
    return FALLBACK_RESPONSES.default;
}

// Rate limiting
const requestLog = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = requestLog.get(ip) || [];
    const recentRequests = userRequests.filter(time => (now - time) < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    
    recentRequests.push(now);
    requestLog.set(ip, recentRequests);
    return true;
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    const prompt = req.body.prompt || req.body.input || '';
    
    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    const fallbackText = getFallbackResponse(prompt);
    res.status(200).json({ 
        text: fallbackText,
        fallback: true,
        message: 'Basic chat response (AI service unavailable)'
    });
}
