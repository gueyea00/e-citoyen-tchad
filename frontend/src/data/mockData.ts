export interface Service {
  id: string;
  slug: string;
  title: { fr: string; ar: string; en: string };
  description: { fr: string; ar: string; en: string };
  descriptionLong: { fr: string; ar: string; en: string };
  direction: Direction;
  icon: string;
  steps: ProcessStep[];
  documents: Document[];
  videoUrl: { fr: string; ar: string; en: string };
}

export interface Direction {
  id: string;
  name: { fr: string; ar: string; en: string };
  address: { fr: string; ar: string; en: string };
  phone: string;
  email: string;
  hours: { fr: string; ar: string; en: string };
}

export interface ProcessStep {
  id: string;
  order: number;
  title: { fr: string; ar: string; en: string };
  description: { fr: string; ar: string; en: string };
  duration?: { fr: string; ar: string; en: string };
  requiredDocs?: { fr: string; ar: string; en: string };
}

export interface Document {
  id: string;
  title: { fr: string; ar: string; en: string };
  format: "PDF" | "DOCX";
  size: string;
  serviceId: string;
  type: "form" | "guide" | "decree" | "template";
  languages: string[];
  updatedAt: string;
}

const directions: Direction[] = [
  {
    id: "d1",
    name: { fr: "Direction de l'Urbanisme", ar: "مديرية التعمير", en: "Urban Planning Department" },
    address: { fr: "Avenue Charles de Gaulle, N'Djamena", ar: "شارع شارل ديغول، نجامينا", en: "Avenue Charles de Gaulle, N'Djamena" },
    phone: "+235 22 51 XX XX",
    email: "urbanisme@matuh.td",
    hours: { fr: "Lun-Ven : 8h-15h30", ar: "الاثنين-الجمعة: 8:00-15:30", en: "Mon-Fri: 8am-3:30pm" },
  },
  {
    id: "d2",
    name: { fr: "Direction de l'Habitat", ar: "مديرية الإسكان", en: "Housing Department" },
    address: { fr: "Quartier Administratif, N'Djamena", ar: "الحي الإداري، نجامينا", en: "Administrative Quarter, N'Djamena" },
    phone: "+235 22 52 XX XX",
    email: "habitat@matuh.td",
    hours: { fr: "Lun-Ven : 8h-15h30", ar: "الاثنين-الجمعة: 8:00-15:30", en: "Mon-Fri: 8am-3:30pm" },
  },
  {
    id: "d3",
    name: { fr: "Direction de l'Aménagement du Territoire", ar: "مديرية تهيئة الإقليم", en: "Territorial Planning Department" },
    address: { fr: "Boulevard de la Liberté, N'Djamena", ar: "شارع الحرية، نجامينا", en: "Boulevard de la Liberté, N'Djamena" },
    phone: "+235 22 53 XX XX",
    email: "amenagement@matuh.td",
    hours: { fr: "Lun-Ven : 8h-15h30", ar: "الاثنين-الجمعة: 8:00-15:30", en: "Mon-Fri: 8am-3:30pm" },
  },
];

export const services: Service[] = [
  {
    id: "s1",
    slug: "permis-de-construire",
    title: { fr: "Permis de Construire", ar: "رخصة البناء", en: "Building Permit" },
    description: {
      fr: "Obtenez votre permis de construire pour tout projet de construction neuve ou de rénovation majeure.",
      ar: "احصل على رخصة البناء لأي مشروع بناء جديد أو تجديد كبير.",
      en: "Obtain your building permit for any new construction or major renovation project.",
    },
    descriptionLong: {
      fr: "Le permis de construire est un document administratif obligatoire pour toute construction neuve, extension ou modification importante d'un bâtiment existant. Cette procédure garantit la conformité du projet aux règles d'urbanisme en vigueur.",
      ar: "رخصة البناء هي وثيقة إدارية إلزامية لأي بناء جديد أو توسعة أو تعديل كبير لمبنى قائم. يضمن هذا الإجراء مطابقة المشروع لقواعد التعمير المعمول بها.",
      en: "The building permit is a mandatory administrative document for any new construction, extension, or significant modification of an existing building. This procedure ensures the project complies with current urban planning regulations.",
    },
    direction: directions[0],
    icon: "building",
    steps: [
      { id: "st1", order: 1, title: { fr: "Dépôt du dossier", ar: "إيداع الملف", en: "File submission" }, description: { fr: "Déposez votre dossier complet au guichet de la Direction de l'Urbanisme.", ar: "قم بإيداع ملفك الكامل في مكتب مديرية التعمير.", en: "Submit your complete file at the Urban Planning Department counter." }, duration: { fr: "1 jour", ar: "يوم واحد", en: "1 day" }, requiredDocs: { fr: "Plan architectural, titre foncier, formulaire de demande", ar: "المخطط المعماري، سند الملكية، استمارة الطلب", en: "Architectural plan, land title, application form" } },
      { id: "st2", order: 2, title: { fr: "Étude technique", ar: "الدراسة التقنية", en: "Technical review" }, description: { fr: "Les services techniques examinent la conformité du projet.", ar: "تقوم الأقسام التقنية بفحص مطابقة المشروع.", en: "Technical services review project compliance." }, duration: { fr: "15 jours", ar: "15 يومًا", en: "15 days" } },
      { id: "st3", order: 3, title: { fr: "Visite de terrain", ar: "زيارة ميدانية", en: "Site visit" }, description: { fr: "Une visite du site est effectuée par un agent assermenté.", ar: "يتم إجراء زيارة للموقع من قبل وكيل معتمد.", en: "A site visit is conducted by a sworn agent." }, duration: { fr: "7 jours", ar: "7 أيام", en: "7 days" } },
      { id: "st4", order: 4, title: { fr: "Délivrance du permis", ar: "إصدار الرخصة", en: "Permit issuance" }, description: { fr: "Le permis est délivré après validation complète du dossier.", ar: "تُصدر الرخصة بعد التحقق الكامل من الملف.", en: "The permit is issued after full validation of the file." }, duration: { fr: "7 jours", ar: "7 أيام", en: "7 days" } },
    ],
    documents: [],
    videoUrl: { fr: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", ar: "", en: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  },
  {
    id: "s2",
    slug: "certificat-urbanisme",
    title: { fr: "Certificat d'Urbanisme", ar: "شهادة التعمير", en: "Urban Planning Certificate" },
    description: {
      fr: "Demandez un certificat d'urbanisme pour connaître les règles applicables à votre terrain.",
      ar: "اطلب شهادة التعمير لمعرفة القواعد المطبقة على أرضك.",
      en: "Request an urban planning certificate to know the rules applicable to your land.",
    },
    descriptionLong: {
      fr: "Le certificat d'urbanisme est un document informatif qui vous renseigne sur les règles d'urbanisme applicables à un terrain donné. Il indique les possibilités de construction et les limitations éventuelles.",
      ar: "شهادة التعمير هي وثيقة إعلامية تُطلعك على قواعد التعمير المطبقة على أرض معينة. تشير إلى إمكانيات البناء والقيود المحتملة.",
      en: "The urban planning certificate is an informative document that tells you about the urban planning rules applicable to a given piece of land.",
    },
    direction: directions[0],
    icon: "file-text",
    steps: [
      { id: "st5", order: 1, title: { fr: "Demande en ligne ou au guichet", ar: "طلب عبر الإنترنت أو في المكتب", en: "Online or counter request" }, description: { fr: "Soumettez votre demande avec les coordonnées cadastrales du terrain.", ar: "قدم طلبك مع الإحداثيات المساحية للأرض.", en: "Submit your request with the land's cadastral coordinates." }, duration: { fr: "1 jour", ar: "يوم واحد", en: "1 day" } },
      { id: "st6", order: 2, title: { fr: "Instruction du dossier", ar: "دراسة الملف", en: "File processing" }, description: { fr: "Vérification des données cadastrales et des règles d'urbanisme.", ar: "التحقق من البيانات المساحية وقواعد التعمير.", en: "Verification of cadastral data and urban planning rules." }, duration: { fr: "10 jours", ar: "10 أيام", en: "10 days" } },
      { id: "st7", order: 3, title: { fr: "Délivrance du certificat", ar: "إصدار الشهادة", en: "Certificate issuance" }, description: { fr: "Retrait du certificat au guichet ou envoi par courrier.", ar: "سحب الشهادة من المكتب أو إرسالها بالبريد.", en: "Pick up the certificate at the counter or receive it by mail." }, duration: { fr: "5 jours", ar: "5 أيام", en: "5 days" } },
    ],
    documents: [],
    videoUrl: { fr: "", ar: "", en: "" },
  },
  {
    id: "s3",
    slug: "lotissement",
    title: { fr: "Autorisation de Lotissement", ar: "ترخيص التجزئة", en: "Subdivision Authorization" },
    description: {
      fr: "Procédure d'autorisation pour la division d'un terrain en lots destinés à la construction.",
      ar: "إجراء الترخيص لتقسيم أرض إلى قطع مخصصة للبناء.",
      en: "Authorization procedure for dividing land into lots intended for construction.",
    },
    descriptionLong: {
      fr: "L'autorisation de lotissement est nécessaire pour tout projet de division d'une propriété foncière en lots destinés à recevoir des constructions. Elle assure la conformité du projet avec le plan d'aménagement.",
      ar: "ترخيص التجزئة ضروري لأي مشروع تقسيم ملكية عقارية إلى قطع مخصصة لاستقبال المباني.",
      en: "The subdivision authorization is required for any project to divide a property into lots intended to receive constructions.",
    },
    direction: directions[2],
    icon: "map",
    steps: [
      { id: "st8", order: 1, title: { fr: "Constitution du dossier", ar: "إعداد الملف", en: "File preparation" }, description: { fr: "Préparez le plan de lotissement, l'étude d'impact et les documents fonciers.", ar: "قم بإعداد مخطط التجزئة ودراسة التأثير والوثائق العقارية.", en: "Prepare the subdivision plan, impact study, and land documents." }, duration: { fr: "Variable", ar: "متغير", en: "Variable" } },
      { id: "st9", order: 2, title: { fr: "Enquête publique", ar: "تحقيق عام", en: "Public inquiry" }, description: { fr: "Une enquête publique est menée pour recueillir les observations.", ar: "يُجرى تحقيق عام لجمع الملاحظات.", en: "A public inquiry is conducted to gather observations." }, duration: { fr: "30 jours", ar: "30 يومًا", en: "30 days" } },
      { id: "st10", order: 3, title: { fr: "Décision administrative", ar: "القرار الإداري", en: "Administrative decision" }, description: { fr: "La commission émet un avis favorable ou défavorable.", ar: "تصدر اللجنة رأيًا إيجابيًا أو سلبيًا.", en: "The commission issues a favorable or unfavorable opinion." }, duration: { fr: "15 jours", ar: "15 يومًا", en: "15 days" } },
    ],
    documents: [],
    videoUrl: { fr: "", ar: "", en: "" },
  },
  {
    id: "s4",
    slug: "titre-foncier",
    title: { fr: "Titre Foncier", ar: "سند الملكية", en: "Land Title" },
    description: {
      fr: "Procédure d'obtention d'un titre foncier pour sécuriser la propriété de votre terrain.",
      ar: "إجراء الحصول على سند الملكية لتأمين ملكية أرضك.",
      en: "Procedure for obtaining a land title to secure ownership of your land.",
    },
    descriptionLong: {
      fr: "Le titre foncier est le document officiel qui atteste de votre droit de propriété sur un terrain. Il constitue la preuve légale la plus forte en matière de propriété immobilière.",
      ar: "سند الملكية هو الوثيقة الرسمية التي تثبت حقك في ملكية أرض. يُعد الدليل القانوني الأقوى في مجال الملكية العقارية.",
      en: "The land title is the official document that certifies your right of ownership over a piece of land. It constitutes the strongest legal proof in real estate matters.",
    },
    direction: directions[2],
    icon: "landmark",
    steps: [
      { id: "st11", order: 1, title: { fr: "Demande d'immatriculation", ar: "طلب التسجيل", en: "Registration request" }, description: { fr: "Déposez une demande d'immatriculation foncière.", ar: "قدم طلب تسجيل عقاري.", en: "Submit a land registration request." }, duration: { fr: "1 jour", ar: "يوم واحد", en: "1 day" } },
      { id: "st12", order: 2, title: { fr: "Bornage du terrain", ar: "تحديد الأرض", en: "Land surveying" }, description: { fr: "Un géomètre procède au bornage officiel du terrain.", ar: "يقوم مساح بتحديد حدود الأرض رسميًا.", en: "A surveyor carries out the official land survey." }, duration: { fr: "14 jours", ar: "14 يومًا", en: "14 days" } },
      { id: "st13", order: 3, title: { fr: "Publication et opposition", ar: "النشر والاعتراض", en: "Publication and opposition" }, description: { fr: "Publication de la demande pour permettre les oppositions éventuelles.", ar: "نشر الطلب للسماح بالاعتراضات المحتملة.", en: "Publication of the request to allow possible oppositions." }, duration: { fr: "60 jours", ar: "60 يومًا", en: "60 days" } },
      { id: "st14", order: 4, title: { fr: "Délivrance du titre", ar: "إصدار السند", en: "Title issuance" }, description: { fr: "Le titre foncier est délivré par le conservateur foncier.", ar: "يصدر سند الملكية من قبل أمين السجل العقاري.", en: "The land title is issued by the land registrar." }, duration: { fr: "30 jours", ar: "30 يومًا", en: "30 days" } },
    ],
    documents: [],
    videoUrl: { fr: "", ar: "", en: "" },
  },
  {
    id: "s5",
    slug: "permis-demolir",
    title: { fr: "Permis de Démolir", ar: "رخصة الهدم", en: "Demolition Permit" },
    description: {
      fr: "Autorisation nécessaire pour la démolition partielle ou totale d'un bâtiment existant.",
      ar: "ترخيص ضروري للهدم الجزئي أو الكلي لمبنى قائم.",
      en: "Authorization required for partial or total demolition of an existing building.",
    },
    descriptionLong: {
      fr: "Le permis de démolir est requis pour toute opération de démolition d'un bâtiment. Il garantit que la démolition est conforme aux règles de sécurité et d'environnement.",
      ar: "رخصة الهدم مطلوبة لأي عملية هدم لمبنى. تضمن أن الهدم يتوافق مع قواعد السلامة والبيئة.",
      en: "A demolition permit is required for any building demolition operation. It ensures compliance with safety and environmental regulations.",
    },
    direction: directions[0],
    icon: "trash-2",
    steps: [
      { id: "st15", order: 1, title: { fr: "Dépôt de la demande", ar: "إيداع الطلب", en: "Submit request" }, description: { fr: "Déposez votre demande avec les plans du bâtiment à démolir.", ar: "قدم طلبك مع مخططات المبنى المراد هدمه.", en: "Submit your request with the plans of the building to be demolished." }, duration: { fr: "1 jour", ar: "يوم واحد", en: "1 day" } },
      { id: "st16", order: 2, title: { fr: "Évaluation technique", ar: "التقييم التقني", en: "Technical evaluation" }, description: { fr: "Expertise technique et évaluation des risques.", ar: "الخبرة التقنية وتقييم المخاطر.", en: "Technical expertise and risk assessment." }, duration: { fr: "10 jours", ar: "10 أيام", en: "10 days" } },
      { id: "st17", order: 3, title: { fr: "Délivrance de l'autorisation", ar: "إصدار الترخيص", en: "Authorization issuance" }, description: { fr: "Délivrance ou refus motivé du permis de démolir.", ar: "إصدار أو رفض مسبب لرخصة الهدم.", en: "Issuance or reasoned refusal of the demolition permit." }, duration: { fr: "15 jours", ar: "15 يومًا", en: "15 days" } },
    ],
    documents: [],
    videoUrl: { fr: "", ar: "", en: "" },
  },
  {
    id: "s6",
    slug: "permis-habiter",
    title: { fr: "Permis d'Habiter", ar: "رخصة السكن", en: "Occupancy Permit" },
    description: {
      fr: "Certificat de conformité permettant l'occupation d'un bâtiment nouvellement construit.",
      ar: "شهادة مطابقة تسمح بإشغال مبنى حديث البناء.",
      en: "Compliance certificate allowing occupation of a newly constructed building.",
    },
    descriptionLong: {
      fr: "Le permis d'habiter atteste que la construction achevée est conforme au permis de construire délivré et aux normes de sécurité en vigueur.",
      ar: "رخصة السكن تشهد بأن البناء المكتمل مطابق لرخصة البناء الصادرة ومعايير السلامة المعمول بها.",
      en: "The occupancy permit certifies that the completed construction complies with the issued building permit and current safety standards.",
    },
    direction: directions[1],
    icon: "home",
    steps: [
      { id: "st18", order: 1, title: { fr: "Déclaration d'achèvement", ar: "إعلان الإنجاز", en: "Completion declaration" }, description: { fr: "Déclarez l'achèvement des travaux auprès de la Direction de l'Habitat.", ar: "أعلن إنجاز الأعمال لدى مديرية الإسكان.", en: "Declare the completion of works to the Housing Department." }, duration: { fr: "1 jour", ar: "يوم واحد", en: "1 day" } },
      { id: "st19", order: 2, title: { fr: "Inspection finale", ar: "التفتيش النهائي", en: "Final inspection" }, description: { fr: "Visite de conformité par les inspecteurs habilités.", ar: "زيارة مطابقة من قبل المفتشين المعتمدين.", en: "Compliance visit by authorized inspectors." }, duration: { fr: "15 jours", ar: "15 يومًا", en: "15 days" } },
      { id: "st20", order: 3, title: { fr: "Délivrance du permis", ar: "إصدار الرخصة", en: "Permit issuance" }, description: { fr: "Si conforme, le permis d'habiter est délivré.", ar: "إذا كان مطابقًا، تُصدر رخصة السكن.", en: "If compliant, the occupancy permit is issued." }, duration: { fr: "7 jours", ar: "7 أيام", en: "7 days" } },
    ],
    documents: [],
    videoUrl: { fr: "", ar: "", en: "" },
  },
];

export const documents: Document[] = [
  { id: "doc1", title: { fr: "Formulaire de demande de permis de construire", ar: "استمارة طلب رخصة البناء", en: "Building permit application form" }, format: "PDF", size: "245 Ko", serviceId: "s1", type: "form", languages: ["fr", "ar", "en"], updatedAt: "2026-03-15" },
  { id: "doc2", title: { fr: "Guide des pièces à fournir — Permis de construire", ar: "دليل الوثائق المطلوبة — رخصة البناء", en: "Required documents guide — Building permit" }, format: "PDF", size: "1.2 Mo", serviceId: "s1", type: "guide", languages: ["fr", "en"], updatedAt: "2026-02-20" },
  { id: "doc3", title: { fr: "Arrêté réglementant les constructions en zone urbaine", ar: "قرار تنظيم البناء في المنطقة الحضرية", en: "Decree regulating construction in urban areas" }, format: "PDF", size: "890 Ko", serviceId: "s1", type: "decree", languages: ["fr", "ar"], updatedAt: "2025-11-10" },
  { id: "doc4", title: { fr: "Formulaire de demande de certificat d'urbanisme", ar: "استمارة طلب شهادة التعمير", en: "Urban planning certificate application form" }, format: "PDF", size: "180 Ko", serviceId: "s2", type: "form", languages: ["fr", "ar", "en"], updatedAt: "2026-01-05" },
  { id: "doc5", title: { fr: "Modèle de courrier — Demande de titre foncier", ar: "نموذج مراسلة — طلب سند الملكية", en: "Letter template — Land title request" }, format: "DOCX", size: "85 Ko", serviceId: "s4", type: "template", languages: ["fr"], updatedAt: "2026-03-01" },
  { id: "doc6", title: { fr: "Guide de la procédure de lotissement", ar: "دليل إجراءات التجزئة", en: "Subdivision procedure guide" }, format: "PDF", size: "2.1 Mo", serviceId: "s3", type: "guide", languages: ["fr", "ar", "en"], updatedAt: "2025-12-18" },
  { id: "doc7", title: { fr: "Formulaire de déclaration d'achèvement des travaux", ar: "استمارة إعلان إنجاز الأعمال", en: "Works completion declaration form" }, format: "PDF", size: "150 Ko", serviceId: "s6", type: "form", languages: ["fr", "ar"], updatedAt: "2026-02-28" },
  { id: "doc8", title: { fr: "Formulaire de demande de permis de démolir", ar: "استمارة طلب رخصة الهدم", en: "Demolition permit application form" }, format: "PDF", size: "195 Ko", serviceId: "s5", type: "form", languages: ["fr", "en"], updatedAt: "2026-01-20" },
];

// Link documents to services
services.forEach((s) => {
  s.documents = documents.filter((d) => d.serviceId === s.id);
});
