import "@/index.css";
import "@/App.css";
import "@/components/LoadingSpinner/LoadingSpinner.css";
import "@/components/SelectView/SelectView.css";
import "@/components/Standings/Standings.css";
import "@/components/Matches/Matches.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
        <Analytics />
      </AuthProvider>
    </QueryClientProvider>
  );
}
