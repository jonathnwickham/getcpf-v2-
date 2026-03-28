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
};

// Map states to nearest Receita Federal offices
export const STATE_OFFICES: Record<string, { name: string; address: string; phone: string; hours: string }> = {
  SP: { name: "Receita Federal — São Paulo Centro", address: "Rua Luís Coelho, 197 — Consolação, São Paulo, SP", phone: "(11) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  RJ: { name: "Receita Federal — Rio de Janeiro Centro", address: "Av. Presidente Antônio Carlos, 375 — Centro, Rio de Janeiro, RJ", phone: "(21) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  MG: { name: "Receita Federal — Belo Horizonte", address: "Rua Tupis, 149 — Centro, Belo Horizonte, MG", phone: "(31) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  BA: { name: "Receita Federal — Salvador", address: "Av. da França, 67 — Comércio, Salvador, BA", phone: "(71) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  PR: { name: "Receita Federal — Curitiba", address: "Rua Marechal Deodoro, 500 — Centro, Curitiba, PR", phone: "(41) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  RS: { name: "Receita Federal — Porto Alegre", address: "Rua General Câmara, 181 — Centro Histórico, Porto Alegre, RS", phone: "(51) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  SC: { name: "Receita Federal — Florianópolis", address: "Rua Nunes Machado, 192 — Centro, Florianópolis, SC", phone: "(48) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  PE: { name: "Receita Federal — Recife", address: "Rua do Imperador, 75 — Santo Antônio, Recife, PE", phone: "(81) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  CE: { name: "Receita Federal — Fortaleza", address: "Rua Barão de Aracati, 909 — Aldeota, Fortaleza, CE", phone: "(85) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  DF: { name: "Receita Federal — Brasília", address: "SAS Quadra 3, Bloco O — Asa Sul, Brasília, DF", phone: "(61) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  GO: { name: "Receita Federal — Goiânia", address: "Rua 2, 47 — Setor Central, Goiânia, GO", phone: "(62) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  ES: { name: "Receita Federal — Vitória", address: "Rua Pietrângelo de Biase, 56 — Centro, Vitória, ES", phone: "(27) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  PA: { name: "Receita Federal — Belém", address: "Av. Presidente Vargas, 1100 — Campina, Belém, PA", phone: "(91) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  AM: { name: "Receita Federal — Manaus", address: "Rua da Instalação, 257 — Centro, Manaus, AM", phone: "(92) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  MA: { name: "Receita Federal — São Luís", address: "Av. dos Portugueses, s/n — Centro, São Luís, MA", phone: "(98) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  PB: { name: "Receita Federal — João Pessoa", address: "Rua Duque de Caxias, 459 — Centro, João Pessoa, PB", phone: "(83) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  RN: { name: "Receita Federal — Natal", address: "Av. Deodoro da Fonseca, 743 — Petrópolis, Natal, RN", phone: "(84) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  AL: { name: "Receita Federal — Maceió", address: "Rua Sá e Albuquerque, 541 — Jaraguá, Maceió, AL", phone: "(82) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  SE: { name: "Receita Federal — Aracaju", address: "Rua de Propriá, 32 — Centro, Aracaju, SE", phone: "(79) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  PI: { name: "Receita Federal — Teresina", address: "Rua 1º de Maio, 234 — Centro, Teresina, PI", phone: "(86) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  MT: { name: "Receita Federal — Cuiabá", address: "Av. Hist. Rubens de Mendonça, 3.000 — CPA, Cuiabá, MT", phone: "(65) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  MS: { name: "Receita Federal — Campo Grande", address: "Rua Pedro Celestino, 2.655 — Centro, Campo Grande, MS", phone: "(67) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  AC: { name: "Receita Federal — Rio Branco", address: "Rua Marechal Deodoro, 340 — Centro, Rio Branco, AC", phone: "(68) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  AP: { name: "Receita Federal — Macapá", address: "Rua Cândido Mendes, 270 — Centro, Macapá, AP", phone: "(96) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  RO: { name: "Receita Federal — Porto Velho", address: "Av. Rogério Weber, 1.862 — Centro, Porto Velho, RO", phone: "(69) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  RR: { name: "Receita Federal — Boa Vista", address: "Av. Ville Roy, 5.573 — São Pedro, Boa Vista, RR", phone: "(95) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
  TO: { name: "Receita Federal — Palmas", address: "Quadra 103 Norte, Av. LO-2, Palmas, TO", phone: "(63) 3003-0146", hours: "Mon–Fri, 7:00–19:00" },
};
