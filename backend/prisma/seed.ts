import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Démarrage du seed de la base de données...');

  // 1. Création d'un SUPER_ADMIN par défaut
  const defaultPassword = 'admin';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@ministere.gov' },
    update: {},
    create: {
      email: 'admin@ministere.gov',
      mot_de_passe: hashedPassword,
      role: 'SUPER_ADMIN',
      actif: true,
    },
  });
  console.log('✅ Super Admin créé : admin@ministere.gov / Mdp:', defaultPassword);

  // 2. Traductions FR par défaut dans le CMS
  const defaultFR = {
    platformName: "e-Citoyen",
    ministryName: "Ministère de l'Aménagement du Territoire, de l'Urbanisme et de l'Habitat",
    ministryShort: "Ministère MATUH",
    nav: { home: "Accueil", informations: "Informations", documentation: "Documentation" },
    hero: {
      title: "Portail d'Information Citoyen",
      subtitle: "Accédez à l'ensemble des services et procédures du\nMinistère de l'Aménagement du Territoire, de l'Urbanisme et de l'Habitat",
      cta: "S'informer sur les services"
    },
    informations: {
      title: "Nos Services & Procédures",
      subtitle: "Découvrez l'ensemble des services proposés par le ministère",
      searchPlaceholder: "Rechercher un service ou une procédure...",
      noResults: "Aucun service trouvé pour votre recherche",
      learnMore: "En savoir plus",
      loadMore: "Voir plus de services"
    },
    footer: {
      contact: "Contact",
      quickLinks: "Liens Rapides",
      followUs: "Suivez-nous",
      address: "N'Djamena, Tchad",
      phone: "+235 22 XX XX XX",
      email: "contact@matuh.td",
      legalNotice: "Mentions légales",
      privacy: "Politique de confidentialité",
      copyright: "Tous droits réservés"
    },
    chatbot: {
      title: "Assistant Virtuel",
      welcome: "Bonjour ! Je suis l'assistant virtuel du Ministère. Comment puis-je vous aider ?",
      placeholder: "Posez votre question...",
      suggestion1: "Quels sont les services disponibles ?",
      suggestion2: "Comment obtenir un permis de construire ?",
      suggestion3: "Où trouver les formulaires ?"
    }
  };

  const defaultAR = {
    platformName: "المواطن الإلكتروني",
    ministryName: "وزارة تهيئة الإقليم والتعمير والإسكان",
    ministryShort: "وزارة ت.إ.ت.إ",
    nav: { home: "الرئيسية", informations: "المعلومات", documentation: "الوثائق" },
    hero: {
      title: "بوابة المعلومات المواطنية",
      subtitle: "الوصول إلى جميع الخدمات والإجراءات الخاصة\nبوزارة تهيئة الإقليم والتعمير والإسكان",
      cta: "الاطلاع على الخدمات"
    },
    footer: {
      contact: "اتصل بنا",
      quickLinks: "روابط سريعة",
      followUs: "تابعونا",
      address: "نجامينا، تشاد",
      phone: "+235 22 XX XX XX",
      email: "contact@matuh.td",
      legalNotice: "إشعار قانوني",
      privacy: "سياسة الخصوصية",
      copyright: "جميع الحقوق محفوظة"
    }
  };

  const defaultEN = {
    platformName: "e-Citizen",
    ministryName: "Ministry of Territorial Planning, Urban Development and Housing",
    ministryShort: "Ministry TPUDH",
    nav: { home: "Home", informations: "Information", documentation: "Documentation" },
    hero: {
      title: "Citizen Information Portal",
      subtitle: "Access all services and procedures of the\nMinistry of Territorial Planning, Urban Development and Housing",
      cta: "Explore our services"
    },
    footer: {
      contact: "Contact",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      address: "N'Djamena, Chad",
      phone: "+235 22 XX XX XX",
      email: "contact@matuh.td",
      legalNotice: "Legal Notice",
      privacy: "Privacy Policy",
      copyright: "All rights reserved"
    }
  };

  for (const [locale, content] of [["fr", defaultFR], ["ar", defaultAR], ["en", defaultEN]] as const) {
    await prisma.cmsConfig.upsert({
      where: { cle: `translations_${locale}` },
      update: {},
      create: {
        cle: `translations_${locale}`,
        valeur: JSON.stringify(content)
      }
    });
  }
  console.log('✅ Traductions CMS initialisées (FR, AR, EN).');

  console.log('🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
