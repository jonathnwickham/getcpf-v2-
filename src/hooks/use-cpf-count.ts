import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MINIMUM_DISPLAY = 200;

export const useCpfCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .then(({ count: c }) => setCount(Math.max(c ?? 0, MINIMUM_DISPLAY)));
  }, []);

  return count;
};
