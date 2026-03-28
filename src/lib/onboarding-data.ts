export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
] as const;

export interface OnboardingData {
  fullName: string;
  motherName: string;
  noMotherName: boolean;
  motherAlternative: string;
  fatherName: string;
  passportNumber: string;
  state: string;
  streetAddress: string;
  city: string;
  nationality: string;
  email: string;
  stayingWithFriend: boolean;
  hostName: string;
  hostCpf: string;
  hostAddress: string;
  hostCity: string;
}

export const INITIAL_DATA: OnboardingData = {
  fullName: "",
  motherName: "",
  noMotherName: false,
  motherAlternative: "",
  fatherName: "",
  passportNumber: "",
  state: "",
  streetAddress: "",
  city: "",
  nationality: "",
  email: "",
  stayingWithFriend: false,
  hostName: "",
  hostCpf: "",
  hostAddress: "",
  hostCity: "",
};

export interface OfficeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  recommended: boolean;
  tip: string;
  waitTime: string;
  rating: number;
  reviewCount: number;
}

// Multiple offices per state — recommended first, then alternatives
export const STATE_OFFICES: Record<string, OfficeInfo[]> = {
  SP: [
    { name: "Receita Federal — Consolação", address: "Rua Luís Coelho, 197 — Consolação, São Paulo, SP, 01309-001", phone: "(11) 3003-0146", email: "atendimentorfb.sp01@rfb.gov.br", hours: "Mon–Fri, 7:00–19:00", recommended: true, tip: "Largest office in SP. Arrive before 8 AM to avoid queues. Bring a number ticket from the lobby machine.", waitTime: "30–90 min", rating: 3.8, reviewCount: 1247 },
    { name: "Receita Federal — Av. Paulista", address: "Av. Paulista, 1842 — Bela Vista, São Paulo, SP, 01310-200", phone: "(11) 3003-0146", email: "atendimentorfb.sp08@rfb.gov.br", hours: "Mon–Fri, 8:00–18:00", recommended: false, tip: "Smaller office, often less crowded than Consolação. Near metro Consolação.", waitTime: "20–60 min", rating: 4.0, reviewCount: 432 },
    { name: "Receita Federal — Santo Amaro", address: "Rua Amador Bueno, 474 — Santo Amaro, São Paulo, SP, 04752-005", phone: "(11) 3003-0146", email: "atendimentorfb.sp03@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: false, tip: "Good option if you're in the south zone. Usually shorter wait times.", waitTime: "15–45 min", rating: 4.1, reviewCount: 289 },
  ],
  RJ: [
    { name: "Receita Federal — Centro", address: "Av. Presidente Antônio Carlos, 375 — Centro, Rio de Janeiro, RJ, 20020-010", phone: "(21) 3003-0146", email: "atendimentorfb.rj01@rfb.gov.br", hours: "Mon–Fri, 7:00–19:00", recommended: true, tip: "Main RJ office. Very busy. Arrive at 7 AM sharp. The CPF desk is on the 2nd floor.", waitTime: "45–120 min", rating: 3.5, reviewCount: 892 },
    { name: "Receita Federal — Barra da Tijuca", address: "Av. Ayrton Senna, 2150 — Barra da Tijuca, Rio de Janeiro, RJ, 22775-003", phone: "(21) 3003-0146", email: "atendimentorfb.rj04@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "Much less crowded than Centro. Great option if you're staying in Barra or Recreio.", waitTime: "15–40 min", rating: 4.2, reviewCount: 156 },
    { name: "Receita Federal — Niterói", address: "Rua Dr. Paulo Alves, 26 — Ingá, Niterói, RJ, 24210-445", phone: "(21) 3003-0146", email: "atendimentorfb.rj05@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "If you're on the east side of Guanabara Bay, this is faster than crossing to Centro.", waitTime: "10–30 min", rating: 4.3, reviewCount: 98 },
  ],
  MG: [
    { name: "Receita Federal — Belo Horizonte Centro", address: "Rua Tupis, 149 — Centro, Belo Horizonte, MG, 30190-060", phone: "(31) 3003-0146", email: "atendimentorfb.mg01@rfb.gov.br", hours: "Mon–Fri, 7:00–19:00", recommended: true, tip: "Main BH office. Can get busy mid-morning. Try to arrive before 8 AM.", waitTime: "30–60 min", rating: 3.9, reviewCount: 567 },
    { name: "Receita Federal — Contagem", address: "Rua Padre José Maria Dalvit, 100 — Eldorado, Contagem, MG, 32315-000", phone: "(31) 3003-0146", email: "atendimentorfb.mg03@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "Less crowded alternative to the Centro office.", waitTime: "15–40 min", rating: 4.0, reviewCount: 134 },
  ],
  BA: [
    { name: "Receita Federal — Salvador Comércio", address: "Rua Visconde de Itaparica, 1 — Comércio, Salvador, BA, 40015-170", phone: "(71) 3003-0146", email: "atendimentorfb.ba01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main Salvador office in the Comércio district. Best reached by Elevador Lacerda.", waitTime: "30–75 min", rating: 3.7, reviewCount: 445 },
    { name: "Receita Federal — Lauro de Freitas", address: "Estrada do Coco, km 7 — Lauro de Freitas, BA, 42700-000", phone: "(71) 3003-0146", email: "atendimentorfb.ba03@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "Good option if you're near the airport or staying in beach areas north of Salvador.", waitTime: "15–40 min", rating: 4.1, reviewCount: 87 },
  ],
  PR: [
    { name: "Receita Federal — Curitiba Centro", address: "Rua Marechal Deodoro, 500 — Centro, Curitiba, PR, 80010-010", phone: "(41) 3003-0146", email: "atendimentorfb.pr01@rfb.gov.br", hours: "Mon–Fri, 7:00–19:00", recommended: true, tip: "Central location, well-organized. Staff often speaks basic English.", waitTime: "20–50 min", rating: 4.1, reviewCount: 389 },
    { name: "Receita Federal — São José dos Pinhais", address: "Rua Joinville, 1418 — Centro, São José dos Pinhais, PR, 83005-210", phone: "(41) 3003-0146", email: "atendimentorfb.pr04@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "Near the airport. Very quiet compared to the city center office.", waitTime: "10–25 min", rating: 4.4, reviewCount: 67 },
  ],
  RS: [
    { name: "Receita Federal — Porto Alegre Centro", address: "Rua General Câmara, 181 — Centro Histórico, Porto Alegre, RS, 90010-230", phone: "(51) 3003-0146", email: "atendimentorfb.rs01@rfb.gov.br", hours: "Mon–Fri, 7:00–19:00", recommended: true, tip: "Main POA office. Well-organized with numbered queuing system.", waitTime: "25–60 min", rating: 4.0, reviewCount: 312 },
    { name: "Receita Federal — Canoas", address: "Rua Mathias Velho, 320 — Centro, Canoas, RS, 92310-000", phone: "(51) 3003-0146", email: "atendimentorfb.rs03@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "Smaller but efficient. Good if you're staying outside Porto Alegre.", waitTime: "10–30 min", rating: 4.2, reviewCount: 89 },
  ],
  SC: [
    { name: "Receita Federal — Florianópolis", address: "Rua Nunes Machado, 192 — Centro, Florianópolis, SC, 88010-460", phone: "(48) 3003-0146", email: "atendimentorfb.sc01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Only office on the island. Can get busy in tourist season (Dec–Mar).", waitTime: "20–50 min", rating: 4.0, reviewCount: 234 },
  ],
  PE: [
    { name: "Receita Federal — Recife", address: "Rua do Imperador, 75 — Santo Antônio, Recife, PE, 50010-240", phone: "(81) 3003-0146", email: "atendimentorfb.pe01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main Recife office. Located in the historic center. Arrive early.", waitTime: "30–60 min", rating: 3.8, reviewCount: 278 },
  ],
  CE: [
    { name: "Receita Federal — Fortaleza", address: "Rua Barão de Aracati, 909 — Aldeota, Fortaleza, CE, 60115-080", phone: "(85) 3003-0146", email: "atendimentorfb.ce01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main Fortaleza office in Aldeota. Relatively modern building. Bring water.", waitTime: "25–60 min", rating: 3.9, reviewCount: 198 },
  ],
  DF: [
    { name: "Receita Federal — Asa Sul", address: "SAS Quadra 3, Bloco O — Asa Sul, Brasília, DF, 70070-030", phone: "(61) 3003-0146", email: "atendimentorfb.df01@rfb.gov.br", hours: "Mon–Fri, 7:00–19:00", recommended: true, tip: "The main national headquarters. Very organized but can be busy. The CPF section is clearly signed.", waitTime: "20–45 min", rating: 4.2, reviewCount: 567 },
    { name: "Receita Federal — Taguatinga", address: "QNA 01, Área Especial A — Taguatinga, Brasília, DF, 72110-601", phone: "(61) 3003-0146", email: "atendimentorfb.df02@rfb.gov.br", hours: "Mon–Fri, 8:00–17:00", recommended: false, tip: "Satellite city office, much less crowded than Asa Sul.", waitTime: "10–30 min", rating: 4.3, reviewCount: 123 },
  ],
  GO: [
    { name: "Receita Federal — Goiânia", address: "Rua 2, 47 — Setor Central, Goiânia, GO, 74013-020", phone: "(62) 3003-0146", email: "atendimentorfb.go01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Central location. Moderately busy.", waitTime: "20–50 min", rating: 3.9, reviewCount: 167 },
  ],
  ES: [
    { name: "Receita Federal — Vitória", address: "Rua Pietrângelo de Biase, 56 — Centro, Vitória, ES, 29010-190", phone: "(27) 3003-0146", email: "atendimentorfb.es01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Small but efficient office. Usually not too crowded.", waitTime: "15–40 min", rating: 4.1, reviewCount: 134 },
  ],
  PA: [
    { name: "Receita Federal — Belém", address: "Av. Presidente Vargas, 1100 — Campina, Belém, PA, 66017-000", phone: "(91) 3003-0146", email: "atendimentorfb.pa01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main Belém office. Arrive early due to heat and queues.", waitTime: "30–60 min", rating: 3.7, reviewCount: 189 },
  ],
  AM: [
    { name: "Receita Federal — Manaus", address: "Rua da Instalação, 257 — Centro, Manaus, AM, 69010-080", phone: "(92) 3003-0146", email: "atendimentorfb.am01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "The only major office in Manaus. Bring water and arrive early.", waitTime: "30–75 min", rating: 3.6, reviewCount: 145 },
  ],
  MA: [
    { name: "Receita Federal — São Luís", address: "Av. dos Portugueses, s/n — Bacanga, São Luís, MA, 65085-580", phone: "(98) 3003-0146", email: "atendimentorfb.ma01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main office. Relatively straightforward process.", waitTime: "20–50 min", rating: 3.8, reviewCount: 112 },
  ],
  PB: [
    { name: "Receita Federal — João Pessoa", address: "Rua Duque de Caxias, 459 — Centro, João Pessoa, PB, 58010-820", phone: "(83) 3003-0146", email: "atendimentorfb.pb01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Central location, manageable queues.", waitTime: "15–40 min", rating: 4.0, reviewCount: 89 },
  ],
  RN: [
    { name: "Receita Federal — Natal", address: "Av. Deodoro da Fonseca, 743 — Petrópolis, Natal, RN, 59012-600", phone: "(84) 3003-0146", email: "atendimentorfb.rn01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Well-located in Petrópolis. Usually efficient.", waitTime: "15–40 min", rating: 4.0, reviewCount: 97 },
  ],
  AL: [
    { name: "Receita Federal — Maceió", address: "Rua Sá e Albuquerque, 541 — Jaraguá, Maceió, AL, 57022-180", phone: "(82) 3003-0146", email: "atendimentorfb.al01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Located in the historic Jaraguá district.", waitTime: "15–35 min", rating: 4.1, reviewCount: 76 },
  ],
  SE: [
    { name: "Receita Federal — Aracaju", address: "Rua de Propriá, 32 — Centro, Aracaju, SE, 49010-020", phone: "(79) 3003-0146", email: "atendimentorfb.se01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Small and efficient. Rarely crowded.", waitTime: "10–30 min", rating: 4.2, reviewCount: 65 },
  ],
  PI: [
    { name: "Receita Federal — Teresina", address: "Rua 1º de Maio, 234 — Centro, Teresina, PI, 64001-430", phone: "(86) 3003-0146", email: "atendimentorfb.pi01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Bring plenty of water — Teresina is extremely hot.", waitTime: "15–40 min", rating: 3.8, reviewCount: 54 },
  ],
  MT: [
    { name: "Receita Federal — Cuiabá", address: "Av. Hist. Rubens de Mendonça, 3000 — CPA, Cuiabá, MT, 78050-000", phone: "(65) 3003-0146", email: "atendimentorfb.mt01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main office for the state. Moderate queues.", waitTime: "20–45 min", rating: 3.9, reviewCount: 98 },
  ],
  MS: [
    { name: "Receita Federal — Campo Grande", address: "Rua Pedro Celestino, 2655 — Centro, Campo Grande, MS, 79002-370", phone: "(67) 3003-0146", email: "atendimentorfb.ms01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Well-organized office. Staff generally helpful.", waitTime: "15–40 min", rating: 4.0, reviewCount: 87 },
  ],
  AC: [
    { name: "Receita Federal — Rio Branco", address: "Rua Marechal Deodoro, 340 — Centro, Rio Branco, AC, 69900-210", phone: "(68) 3003-0146", email: "atendimentorfb.ac01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Small office, rarely crowded. Usually very fast.", waitTime: "10–25 min", rating: 4.2, reviewCount: 34 },
  ],
  AP: [
    { name: "Receita Federal — Macapá", address: "Rua Cândido Mendes, 270 — Centro, Macapá, AP, 68900-100", phone: "(96) 3003-0146", email: "atendimentorfb.ap01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "The only office in Amapá. Come early.", waitTime: "15–40 min", rating: 3.7, reviewCount: 42 },
  ],
  RO: [
    { name: "Receita Federal — Porto Velho", address: "Av. Rogério Weber, 1862 — Centro, Porto Velho, RO, 76801-030", phone: "(69) 3003-0146", email: "atendimentorfb.ro01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Main Rondônia office. Manageable queues.", waitTime: "15–35 min", rating: 3.9, reviewCount: 56 },
  ],
  RR: [
    { name: "Receita Federal — Boa Vista", address: "Av. Ville Roy, 5573 — São Pedro, Boa Vista, RR, 69306-665", phone: "(95) 3003-0146", email: "atendimentorfb.rr01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Small and quiet office. Usually done within 30 minutes.", waitTime: "10–25 min", rating: 4.3, reviewCount: 28 },
  ],
  TO: [
    { name: "Receita Federal — Palmas", address: "Quadra 103 Norte, Av. LO-2 — Plano Diretor Norte, Palmas, TO, 77001-020", phone: "(63) 3003-0146", email: "atendimentorfb.to01@rfb.gov.br", hours: "Mon–Fri, 7:00–18:00", recommended: true, tip: "Modern office. Generally quick processing.", waitTime: "10–30 min", rating: 4.1, reviewCount: 45 },
  ],
};
