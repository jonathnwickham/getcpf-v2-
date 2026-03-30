import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCpfCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c ?? 0));
  }, []);

  return count;
};
