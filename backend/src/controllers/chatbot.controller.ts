import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import Groq from 'groq-sdk';

let groqClient: Groq | null = null;
const getGroq = () => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

export const handleChatbotMessage = async (req: Request, res: Response) => {
  try {
    const { message, locale, sessionId, history } = req.body;
    const currentLocale = locale || 'fr';

    if (!message) {
      return res.status(400).json({ error: 'Le message est requis.' });
    }

    // Récupérer le catalogue des services complet pour le contexte
    const services = await prisma.service.findMany({
      include: {
        direction: true,
        etapes: {
          orderBy: { ordre: 'asc' }
        }
      }
    });

    // Formater le contexte pour l'IA (On filtre selon la langue demandée pour économiser des tokens)
    const formattedContext = services.map(s => ({
      titre: currentLocale === 'ar' ? s.titre_ar : (currentLocale === 'en' ? s.titre_en : s.titre_fr),
      description: currentLocale === 'ar' ? s.desc_ar : (currentLocale === 'en' ? s.desc_en : s.desc_fr),
      direction: currentLocale === 'ar' ? s.direction.nom_ar : (currentLocale === 'en' ? s.direction.nom_en : s.direction.nom_fr),
      contact: {
        tel: s.direction.telephone,
        email: s.direction.email,
        adresse: s.direction.adresse
      },
      etapes: s.etapes.map(e => ({
        ordre: e.ordre,
        titre: currentLocale === 'ar' ? e.titre_ar : (currentLocale === 'en' ? e.titre_en : e.titre_fr),
        description: currentLocale === 'ar' ? e.desc_ar : (currentLocale === 'en' ? e.desc_en : e.desc_fr),
        duree: e.duree,
        documents: e.docs_requis
      }))
    }));

    // Construction du prompt système
    const systemPrompt = `Tu es l'assistant IA officiel de la plateforme "e-Citoyen" du Ministère de l'Aménagement du Territoire, de l'Urbanisme et de l'Habitat (Tchad).
    
    TON RÔLE :
    - Aider les citoyens à comprendre les procédures administratives.
    - Orienter les utilisateurs vers les services et les directions compétentes.
    - Expliquer les étapes, les durées et les documents requis pour chaque service.
    
    CONSIGNES STRICTES :
    1. Langue : Réponds exclusivement en ${currentLocale === 'ar' ? 'Arabe' : (currentLocale === 'en' ? 'Anglais' : 'Français')}.
    2. Exactitude : Utilise UNIQUEMENT les informations du contexte ci-dessous. Si une information n'est pas présente, dis poliment que tu ne sais pas et suggère de contacter le ministère.
    3. Style : Professionnel, accueillant, précis et concis.
    4. Formatage : Utilise des listes à puces pour les étapes ou les documents.
    
    CONTEXTE DES SERVICES DISPONIBLES :
    ${JSON.stringify(formattedContext, null, 2)}
    
    Identité du Ministère : République du Tchad, Ministère de l'Aménagement du Territoire, de l'Urbanisme et de l'Habitat.`;

    // Construction des messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10), // Garder les 10 derniers échanges pour le contexte de conversation
      { role: 'user', content: message }
    ];

    // Appel à Groq AI (Llama 3.3 70B Versatile)
    const chatCompletion = await getGroq().chat.completions.create({
      messages: messages as any[],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content || "Désolé, je ne peux pas répondre pour le moment.";

    // Log de la conversation
    await prisma.chatbotLog.create({
      data: {
        session_id: sessionId || 'anonymous',
        langue: currentLocale,
        messages: JSON.stringify([
          ... (history || []).slice(-2),
          { role: 'user', content: message },
          { role: 'assistant', content: aiMessage }
        ]),
      }
    });

    res.json({
      role: 'assistant',
      content: aiMessage
    });

  } catch (error) {
    console.error('Erreur Chatbot Groq:', error);
    res.status(500).json({ error: 'Erreur lors de la communication avec l\'assistant.' });
  }
};
