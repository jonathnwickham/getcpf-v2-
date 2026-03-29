import { supabase } from "@/integrations/supabase/client";
import { INITIAL_DATA, type OnboardingData } from "@/lib/onboarding-data";

export const ONBOARDING_SESSION_KEY = "cpf-onboarding";
export const ONBOARDING_LOCAL_KEY = "cpf-onboarding-persisted";

type ApplicationSnapshot = {
  id: string;
  status: string | null;
  cpf_number: string | null;
  full_name: string | null;
  mother_name: string | null;
  no_mother: boolean | null;
  mother_alternative: string | null;
  father_name: string | null;
  passport_number: string | null;
  state_code: string | null;
  state_name: string | null;
  street_address: string | null;
  city: string | null;
  nationality: string | null;
  email: string | null;
  staying_with_friend: boolean | null;
  host_name: string | null;
  host_cpf: string | null;
  host_address: string | null;
  host_city: string | null;
};

const optionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const persistOnboardingData = (data: OnboardingData) => {
  const serialized = JSON.stringify(data);
  sessionStorage.setItem(ONBOARDING_SESSION_KEY, serialized);
  localStorage.setItem(ONBOARDING_LOCAL_KEY, serialized);
};

export const readPersistedOnboardingData = (): OnboardingData | null => {
  const raw = sessionStorage.getItem(ONBOARDING_SESSION_KEY) || localStorage.getItem(ONBOARDING_LOCAL_KEY);
  if (!raw) return null;

  try {
    return { ...INITIAL_DATA, ...JSON.parse(raw) } as OnboardingData;
  } catch {
    return null;
  }
};

export const mapApplicationToOnboardingData = (application: Partial<ApplicationSnapshot> | null): OnboardingData => ({
  ...INITIAL_DATA,
  fullName: application?.full_name ?? "",
  motherName: application?.mother_name ?? "",
  noMotherName: Boolean(application?.no_mother),
  motherAlternative: application?.mother_alternative ?? "",
  fatherName: application?.father_name ?? "",
  passportNumber: application?.passport_number ?? "",
  state: application?.state_code ?? application?.state_name ?? "",
  streetAddress: application?.street_address ?? "",
  city: application?.city ?? "",
  nationality: application?.nationality ?? "",
  email: application?.email ?? "",
  stayingWithFriend: Boolean(application?.staying_with_friend),
  hostName: application?.host_name ?? "",
  hostCpf: application?.host_cpf ?? "",
  hostAddress: application?.host_address ?? "",
  hostCity: application?.host_city ?? "",
});

export const hasReadyPackData = (data: Partial<OnboardingData> | null | undefined) => {
  if (!data) return false;

  const hasMotherData = data.noMotherName
    ? Boolean(data.motherAlternative?.trim())
    : Boolean(data.motherName?.trim());

  return Boolean(
    data.fullName?.trim() &&
      hasMotherData &&
      data.passportNumber?.trim() &&
      data.state?.trim() &&
      data.streetAddress?.trim() &&
      data.city?.trim() &&
      data.nationality?.trim() &&
      data.email?.includes("@")
  );
};

export const applicationHasReadyPack = (application: ApplicationSnapshot | null) => {
  if (!application) return false;
  if (application.cpf_number) return true;
  if (application.status && application.status !== "draft") return true;
  return hasReadyPackData(mapApplicationToOnboardingData(application));
};

export const fetchLatestApplication = async (userId: string) => {
  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, status, cpf_number, full_name, mother_name, no_mother, mother_alternative, father_name, passport_number, state_code, state_name, street_address, city, nationality, email, staying_with_friend, host_name, host_cpf, host_address, host_city"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0] as ApplicationSnapshot | null) ?? null;
};

export const saveLatestApplication = async (userId: string, data: OnboardingData, status = "prepared") => {
  const payload = {
    user_id: userId,
    status,
    full_name: optionalText(data.fullName),
    mother_name: optionalText(data.motherName),
    no_mother: data.noMotherName,
    mother_alternative: optionalText(data.motherAlternative),
    father_name: optionalText(data.fatherName),
    passport_number: optionalText(data.passportNumber),
    state_code: optionalText(data.state),
    state_name: optionalText(data.state),
    street_address: optionalText(data.streetAddress),
    city: optionalText(data.city),
    nationality: optionalText(data.nationality),
    email: optionalText(data.email),
    staying_with_friend: data.stayingWithFriend,
    host_name: optionalText(data.hostName),
    host_cpf: optionalText(data.hostCpf),
    host_address: optionalText(data.hostAddress),
    host_city: optionalText(data.hostCity),
    updated_at: new Date().toISOString(),
  };

  const existing = await fetchLatestApplication(userId);

  if (existing?.id) {
    const { error } = await supabase.from("applications").update(payload).eq("id", existing.id);
    if (error) throw error;
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("applications")
    .insert(payload)
    .select("id")
    .limit(1);

  if (error) throw error;
  return inserted?.[0]?.id ?? null;
};
