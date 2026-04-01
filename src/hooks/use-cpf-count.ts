import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MINIMUM_DISPLAY = 200;

export const useCpfCount = () => {
  const { data: count } = useQuery({
    queryKey: ["cpf-count"],
    queryFn: async () => {
      const { count: c } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true });
      return Math.max(c ?? 0, MINIMUM_DISPLAY);
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return count ?? null;
};
