import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyClMZEIIFTfwZX1p3l8oxWRx2rx-xaGmog";

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

// AI Chat Support System Prompt
const SYSTEM_PROMPT = `You are an AI chat support assistant for a portfolio website. Your primary role is to help visitors learn about the developer's skills, projects, and experience, but you can also provide general assistance and engage in friendly conversation.

PORTFOLIO INFORMATION:
SKILLS:
- Frontend: React, Blazor WebAssembly, HTML5, CSS3, JavaScript, TailwindCSS
- Backend: ASP.NET Core, C#, Entity Framework Core
- Databases: SQLite, Microsoft SQL Server
- Authentication: Auth0, ASP.NET Core Identity
- Tools: Git, VS Code, Visual Studio, Azure

PROJECTS:
1. E-commerce Platform
   - Built with ASP.NET Core MVC
   - Integrates with international platforms for domestic delivery
   - Features: secure auth, database management, payment systems
   - Tech: C#, .NET, Entity Framework Core, TailwindCSS

2. Authentication & Authorization System
   - Implements Auth0 with OAuth, JWT, MFA
   - Role-based access control (RBAC)
   - React frontend with TailwindCSS
   - SQLite database integration

3. Blazor Web App
   - Single Page Application using Blazor WebAssembly
   - .NET Core backend with API integration
   - Responsive UI with TailwindCSS
   - Client-side SQLite storage

EXPERIENCE:
- Full Stack Developer with focus on .NET ecosystem
- Expertise in building secure, scalable web applications
- Strong background in authentication and authorization systems
- Experience with modern frontend frameworks and responsive design

CHAT SUPPORT GUIDELINES:
1. Prioritize questions about the portfolio, skills, projects, and experience
2. For portfolio-related questions, provide detailed, technical information
3. For general questions, be helpful and engaging while steering back to portfolio topics when appropriate
4. Be friendly, professional, and conversational
5. If someone asks about hiring or collaboration, encourage them to reach out via contact information
6. Keep responses concise but informative
7. Use a warm, approachable tone that reflects well on the developer`;

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

    try {
        const prompt = req.body.prompt || req.body.input || '';

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt in request body' });
        }

        if (!GEMINI_API_KEY) {
            const fallbackText = getFallbackResponse(prompt);
            return res.status(200).json({ 
                text: fallbackText,
                fallback: true,
                message: 'Basic chat response (AI service unavailable)'
            });
        }

        // Configure Gemini chat with portfolio context
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${prompt}`;
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 500,
            },
        });

        const response = await result.response;
        const text = response.text() || 'Sorry, no response text.';
        res.status(200).json({ text });
    } catch (err) {
        console.error('Gemini API Error:', err);
        
        // Handle Gemini API errors - use fallback for quota/rate limit issues
        if (err?.message?.includes('quota') || err?.message?.includes('rate limit') || err?.status === 429) {
            const fallbackText = getFallbackResponse(req.body.prompt || req.body.input || '');
            return res.status(200).json({ 
                text: fallbackText,
                fallback: true,
                message: 'Response generated using basic chat (AI temporarily unavailable)'
            });
        }
        
        if (err?.status === 401 || err?.message?.includes('API key')) {
            return res.status(500).json({ 
                error: 'AI service configuration issue. Please contact support.',
                fallback: 'Please use the contact form to reach out directly for any questions.'
            });
        }
        
        const message = err?.message || 'An error occurred while processing your request.';
        res.status(500).json({ 
            error: message,
            fallback: 'AI chat is temporarily unavailable. Please use the contact form for direct communication.'
        });
    }
}
