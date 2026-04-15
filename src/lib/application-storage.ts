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
  cep: string | null;
  street_address: string | null;
  address_number: string | null;
  complement: string | null;
  neighbourhood: string | null;
  city: string | null;
  nationality: string | null;
  gender: string | null;
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
  cep: application?.cep ?? "",
  streetAddress: application?.street_address ?? "",
  addressNumber: application?.address_number ?? "",
  complement: application?.complement ?? "",
  neighbourhood: application?.neighbourhood ?? "",
  city: application?.city ?? "",
  nationality: application?.nationality ?? "",
  gender: application?.gender ?? "",
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
  const allFields = "id, status, cpf_number, full_name, mother_name, no_mother, mother_alternative, father_name, passport_number, state_code, state_name, cep, street_address, address_number, complement, neighbourhood, city, nationality, gender, email, staying_with_friend, host_name, host_cpf, host_address, host_city";
  const baseFields = "id, status, cpf_number, full_name, mother_name, no_mother, mother_alternative, father_name, passport_number, state_code, state_name, street_address, city, nationality, email, staying_with_friend, host_name, host_cpf, host_address, host_city";

  const fetchWithFields = async (fields: string) => {
    // First try non-draft
    const { data: active, error: activeErr } = await supabase
      .from("applications")
      .select(fields)
      .eq("user_id", userId)
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1);

    if (activeErr) throw activeErr;
    if (active && active.length > 0) return active[0] as ApplicationSnapshot;

    // Fallback to latest draft
    const { data, error } = await supabase
      .from("applications")
      .select(fields)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return (data?.[0] as ApplicationSnapshot | null) ?? null;
  };

  try {
    return await fetchWithFields(allFields);
  } catch {
    // New columns may not exist yet — fall back to base fields
    return await fetchWithFields(baseFields);
  }
};

export const saveLatestApplication = async (userId: string, data: OnboardingData, status = "prepared") => {
  // New columns that may not exist yet in Supabase — added via Claude Code, DB migration pending
  const newFields = {
    cep: optionalText(data.cep),
    address_number: optionalText(data.addressNumber),
    complement: optionalText(data.complement),
    neighbourhood: optionalText(data.neighbourhood),
    gender: optionalText(data.gender),
  };

  const basePayload = {
    user_id: userId,
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

  // Try with all fields first; fall back to base fields if new columns don't exist yet
  const payload = { ...basePayload, ...newFields };

  const existing = await fetchLatestApplication(userId);

  // Sync nationality to profile for admin visibility
  if (data.nationality.trim()) {
    await supabase.from("profiles").update({ country_code: data.nationality.trim() }).eq("id", userId);
  }

  if (existing?.id) {
    let { error } = await supabase.from("applications").update(payload).eq("id", existing.id);
    // Fallback: if new columns don't exist yet, retry with base fields only
    if (error && error.message?.includes("column")) {
      ({ error } = await supabase.from("applications").update(basePayload).eq("id", existing.id));
    }
    if (error) throw error;
    // `as any` required: Supabase codegen doesn't include custom RPC names in its type map.
    await supabase.rpc("transition_application_status" as any, { _application_id: existing.id, _new_status: status });
    return existing.id;
  }

  let { data: inserted, error } = await supabase
    .from("applications")
    .insert({ ...payload, status })
    .select("id")
    .limit(1);

  // Fallback: if new columns don't exist yet, retry with base fields only
  if (error && error.message?.includes("column")) {
    ({ data: inserted, error } = await supabase
      .from("applications")
      .insert({ ...basePayload, status })
      .select("id")
      .limit(1));
  }

  if (error) throw error;
  const newId = inserted?.[0]?.id ?? null;
  if (newId && status !== "draft") {
    // `as any` required: Supabase codegen doesn't include custom RPC names in its type map.
    await supabase.rpc("transition_application_status" as any, { _application_id: newId, _new_status: status });
  }
  return newId;
};
