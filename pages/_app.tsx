import "../src/index.css";
import "../src/App.css";
import "../src/components/LoadingSpinner/LoadingSpinner.css";
import "../src/components/SelectView/SelectView.css";
import "../src/components/Standings/Standings.css";
import "../src/components/Matches/Matches.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Analytics />
    </QueryClientProvider>
  );
}
