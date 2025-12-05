import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data } = await supabase.from("player").select("*");
  console.log("data", data);
  return (
    <div>
      <h1>Instruments</h1>
      <ul>
        {data?.map((p) => (
          <li key={p.id}>
            {p.first_name} {p.height}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading instruments...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}
