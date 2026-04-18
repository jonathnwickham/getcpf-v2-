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
  cep: string;
  streetAddress: string;
  addressNumber: string;
  complement: string;
  neighbourhood: string;
  city: string;
  nationality: string;
  gender: "" | "m" | "f" | "unspecified";
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
  cep: "",
  streetAddress: "",
  addressNumber: "",
  complement: "",
  neighbourhood: "",
  city: "",
  nationality: "",
  gender: "",
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
  googleMapsUrl?: string;
}

// Verified offices from official Receita Federal SAGA system (scraped 17 Apr 2026)
// Source: gov.br/receitafederal → InformacoesDasUnidades.aspx
export const STATE_OFFICES: Record<string, OfficeInfo[]> = {
  AC: [
    { name: "CAC Rio Branco", address: "Rua Marechal Deodoro, nº 340, Centro, Rio Branco, AC, 69900-903", phone: "", email: "", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Rio%20Branco%20Rio%20Branco" },
  ],
  AL: [
    { name: "CAC Maceió", address: "Rua Sá e Albuquerque, nº 541, Prédio Anexo, Jaraguá, Maceió, AL, 57025-902", phone: "(82) 98173-3666", email: "atendimentorfb.04@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Macei%C3%B3%20Macei%C3%B3" },
  ],
  AM: [
    { name: "CAC Manaus", address: "Avenida Governador Danilo de Matos Areosa, nº 1530, Distrito Industrial, Manaus, AM, 69075-351", phone: "(92) 3133-9001", email: "atendimentorfb.02@rfb.gov.br", hours: "Das 08:00 às 12:00 e das 13:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Manaus%20Manaus" },
    { name: "CAC Alfândega do Porto de Manaus", address: "Rua Emilio Moreira, nº 470, Praça 14 de Janeiro, Centro, Manaus, AM, 69020-040", phone: "(92) 3231-1101", email: "", hours: "", recommended: false, tip: "", waitTime: "" },
  ],
  AP: [
    { name: "CAC Macapá", address: "Rua Eliezer Levy, nº 1350, Térreo, Central, Macapá, AP, 68900-083", phone: "", email: "atendimentorfb.02@rfb.gov.br", hours: "Das 08:00 às 12:00 e das 12:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Macap%C3%A1%20Macap%C3%A1" },
  ],
  BA: [
    { name: "CAC Salvador", address: "Avenida Luis Viana Filho, nº 3329, Térreo, Paralela, Salvador, BA, 41730-101", phone: "", email: "atendimentorfb.05@rfb.gov.br", hours: "Das 07:00 às 15:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Salvador%20Salvador" },
    { name: "CAC Alfândega do Porto de Salvador", address: "Avenida da França, s/n, Comércio, Salvador, BA, 40010-000", phone: "(71) 3186-2600", email: "", hours: "Das 09:00 às 12:00 e das 14:00 às 17:00", recommended: false, tip: "", waitTime: "" },
  ],
  CE: [
    { name: "CAC Fortaleza", address: "Rua Barão de Aracati, nº 909, 1ª Sobreloja, Aldeota, Fortaleza, CE, 60115-090", phone: "(85) 3878-3200", email: "atendimentorfb.03@rfb.gov.br", hours: "Das 07:30 às 11:30 e das 11:30 às 15:30", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Fortaleza%20Fortaleza" },
  ],
  DF: [
    { name: "CAC Brasília", address: "SAS Qd. 06, Bloco O - Ed. Órgãos Centrais, Asa Sul, Brasília, DF, 70070-917", phone: "(61) 3412-5011", email: "", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Bras%C3%ADlia%20Bras%C3%ADlia" },
    { name: "CAC Aeroporto Internacional", address: "Terminal Carga Aérea, 2º Andar, Lago Sul, Brasília, DF, 71608-900", phone: "(61) 3364-9531", email: "cac.alfbsb@rfb.gov.br", hours: "Das 09:00 às 12:00 e das 14:00 às 17:00", recommended: false, tip: "", waitTime: "" },
  ],
  ES: [
    { name: "CAC Vitória", address: "Avenida Marechal Mascarenhas de Moraes, nº 1333, Térreo, Ilha de Santa Maria, Vitória, ES, 29051-015", phone: "", email: "atendimentorfb.07@rfb.gov.br", hours: "Das 09:00 às 13:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Vit%C3%B3ria%20Vit%C3%B3ria" },
    { name: "CAC ALF do Porto de Vitória", address: "Avenida Marechal Mascarenhas, nº 1333, 5º Andar, Ilha de Santa Maria, Vitória, ES, 29051-015", phone: "(27) 3232-3522", email: "cac.alfvit@rfb.gov.br", hours: "Das 12:00 às 18:00", recommended: false, tip: "", waitTime: "" },
  ],
  GO: [
    { name: "CAC Goiânia", address: "Avenida Nona Avenida, QD. A 34, LT 01/11, Leste Universitário, Goiânia, GO, 74603-010", phone: "(62) 3416-0500", email: "atendimentorfb.01@rfb.gov.br", hours: "Das 08:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Goi%C3%A2nia%20Goi%C3%A2nia" },
  ],
  MA: [
    { name: "CAC São Luís", address: "Rua Osvaldo Cruz, nº 1618, Canto Fabril, São Luís, MA, 65020-902", phone: "(98) 3218-7117", email: "atendimentorfb.03@rfb.gov.br", hours: "Das 07:30 às 13:30 e das 13:30 às 15:30", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20S%C3%A3o%20Lu%C3%ADs%20S%C3%A3o%20Lu%C3%ADs" },
  ],
  MG: [
    { name: "CAC Belo Horizonte", address: "Avenida Olegário Maciel, nº 2360, Santo Agostinho, Belo Horizonte, MG, 30180-122", phone: "(31) 9711-9464", email: "atendimentorfb.06@rfb.gov.br", hours: "Das 09:00 às 17:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Belo%20Horizonte%20Belo%20Horizonte" },
  ],
  MS: [
    { name: "CAC Campo Grande", address: "Rua Desembargador Leão Neto Do Carmo, nº 3, Jardim Veraneio, Campo Grande, MS, 79037-902", phone: "(67) 3318-7200", email: "", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Campo%20Grande%20Campo%20Grande" },
  ],
  MT: [
    { name: "CAC Cuiabá", address: "Avenida Vereador Juliano da Costa Marques, nº 99, Centro Político Adm, Cuiabá, MT, 78049-937", phone: "(65) 3911-7217", email: "", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Cuiab%C3%A1%20Cuiab%C3%A1" },
  ],
  PA: [
    { name: "CAC Belém", address: "Av. Nossa Senhora de Nazaré, nº 220, Nazaré, Belém, PA, 66035-115", phone: "", email: "atendimentorfb.02@rfb.gov.br", hours: "Das 08:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Bel%C3%A9m%20Bel%C3%A9m" },
    { name: "CAC Aeroporto Internacional de Belém", address: "Av. Júlio César, S/N, Val-de-Cães, Belém, PA, 66613-010", phone: "(91) 3210-6305", email: "", hours: "", recommended: false, tip: "", waitTime: "" },
  ],
  PB: [
    { name: "CAC João Pessoa", address: "Avenida Epitácio Pessoa, nº 1705, Térreo, dos Estados, João Pessoa, PB, 58030-900", phone: "(83) 3216-4526", email: "atendimentorfb.04@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Jo%C3%A3o%20Pessoa%20Jo%C3%A3o%20Pessoa" },
  ],
  PE: [
    { name: "CAC Recife - Centro", address: "Av. Alfredo Lisboa, nº 1152, Térreo, Recife Antigo, Recife, PE, 50030-150", phone: "(81) 3797-5204", email: "atendimentorfb.04@rfb.gov.br", hours: "Das 07:00 às 15:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Recife%20-%20Centro%20Recife" },
    { name: "CAC Alfândega de Recife", address: "TECA 1 Terminal de Cargas 1 do Aeroporto Internacional do Recife, Imbiribeira, Recife, PE, 51210-010", phone: "(81) 3322-5127", email: "", hours: "Das 08:00 às 18:00", recommended: false, tip: "", waitTime: "" },
  ],
  PI: [
    { name: "CAC Teresina", address: "Praça Marechal Deodoro, s/n, Centro, Teresina, PI, 64000-160", phone: "", email: "atendimentorfb.03@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Teresina%20Teresina" },
  ],
  PR: [
    { name: "CAC Curitiba - Centro", address: "Rua Marechal Deodoro, nº 555, Térreo, Centro, Curitiba, PR, 80020-911", phone: "(41) 99197-8359", email: "atendimentorfb.09@rfb.gov.br", hours: "Das 08:00 às 12:00 e das 12:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Curitiba%20-%20Centro%20Curitiba" },
  ],
  RJ: [
    { name: "CAC RJO I - Centro Cidadão", address: "Avenida Presidente Antônio Carlos, nº 375, Centro, Rio de Janeiro, RJ, 20020-001", phone: "", email: "atendimentorfb.07@rfb.gov.br", hours: "Das 09:00 às 13:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20RJO%20I%20-%20Centro%20Cidad%C3%A3o%20Rio%20de%20Janeiro" },
    { name: "CAC RJO I - Ipanema", address: "Rua Barão da Torre, nº 296, Ipanema, Rio de Janeiro, RJ, 22411-000", phone: "(21) 97487-8702", email: "atendimentorfb.07@rfb.gov.br", hours: "Das 09:00 às 13:00", recommended: false, tip: "", waitTime: "" },
  ],
  RN: [
    { name: "CAC Natal", address: "Av. Engenheiro Roberto Freire, nº 3132, Praia Shopping, Ponta Negra, Natal, RN, 59082-972", phone: "", email: "atendimentorfb.04@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Natal%20Natal" },
  ],
  RO: [
    { name: "CAC Porto Velho", address: "Av. Rogério Weber, nº 1752, Centro, Porto Velho, RO, 76801-030", phone: "(69) 99978-3216", email: "atendimentorfb.02@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Porto%20Velho%20Porto%20Velho" },
  ],
  RR: [
    { name: "CAC Boa Vista", address: "Av. Governador Anchieta, nº 618, Prédio de 2 andares, Cacari, Boa Vista, RR, 69307-775", phone: "(95) 99127-3843", email: "atendimentorfb.02@rfb.gov.br", hours: "Das 08:00 às 12:00 e das 12:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Boa%20Vista%20Boa%20Vista" },
  ],
  RS: [
    { name: "CAC Porto Alegre", address: "Avenida Loureiro da Silva, nº 445, Sobreloja, Centro, Porto Alegre, RS, 90013-900", phone: "(51) 4040-4123", email: "atendimentorfb.10@rfb.gov.br", hours: "Das 08:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Porto%20Alegre%20Porto%20Alegre" },
  ],
  SC: [
    { name: "CAC Florianópolis", address: "Rua Claudino Bento da Silva, nº 11, Centro, Florianópolis, SC, 88010-135", phone: "", email: "atendimentorfb.09@rfb.gov.br", hours: "Das 08:00 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Florian%C3%B3polis%20Florian%C3%B3polis" },
    { name: "CAC Alfândega de Florianópolis", address: "Rua Claudino Bento da Silva, nº 11, Centro, Florianópolis, SC, 88010-130", phone: "", email: "cac_aduaneiro_fpolis@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: false, tip: "", waitTime: "" },
  ],
  SE: [
    { name: "CAC Aracaju", address: "Av. Mário Jorge Menezes Vieira, 3028, Nexus Empresarial, Coroa do Meio, Aracaju, SE, 49035-100", phone: "(79) 2105-3100", email: "atendimentorfb.05@rfb.gov.br", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Aracaju%20Aracaju" },
  ],
  SP: [
    { name: "CAC São Paulo - Bela Vista", address: "Rua Avanhandava, nº 55, 1° Andar, Bela Vista, São Paulo, SP, 01306-001", phone: "", email: "atendimentorfb.08@rfb.gov.br", hours: "Das 08:00 às 13:00 e das 13:01 às 16:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/place/Receita+Federal+-+CAC+Bela+Vista/@-23.550051,-46.6448043,17z/data=!3m1!5s0x94ce584cede6ae27:0xb918cc51e10c2599!4m6!3m5!1s0x94ce59d12daf284b:0x9e63a4cb96e94836!8m2!3d-23.550051!4d-46.6448043!16s%2Fg%2F11pyl5dbv3" },
    { name: "CAC São Paulo - Itaquera", address: "Avenida Celso Garcia, nº 3580, Térreo, Tatuapé, São Paulo, SP, 03064-000", phone: "", email: "atendimentorfb.01@rfb.gov.br", hours: "Das 08:00 às 16:00", recommended: false, tip: "", waitTime: "" },
  ],
  TO: [
    { name: "CAC Palmas", address: "Rua NE 13, Conjunto 03, Lotes 05 e 06, 202 Norte, Palmas, TO, 77054-010", phone: "(63) 3901-1175", email: "", hours: "Das 08:00 às 12:00", recommended: true, tip: "", waitTime: "", googleMapsUrl: "https://www.google.com/maps/search/Receita%20Federal%20CAC%20Palmas%20Palmas" },
  ],
};
