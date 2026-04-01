"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientProfileDetails from "../../_components/module/clients/ClientProfileDetails";
import { ClientUser } from "@/types/data.types";

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Fetching the same JSON used in the main table
        const response = await fetch("/data/users.json");
        const data: ClientUser[] = await response.json();

        // Find the specific client based on the URL ID
        const foundClient = data.find((u) => u.id === params.id);

        if (foundClient) {
          setClient(foundClient);
        } else {
          console.error("Client not found");
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClientData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Client Not Found
        </h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-slate-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>
      </div>

      <ClientProfileDetails client={client} />
    </div>
  );
}
