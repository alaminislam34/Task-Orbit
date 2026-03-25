import { Loader2 } from "lucide-react";

const PublicLoadingPage = () => {
  return (
    <div>
      <div className="h-screen max-w-screen flex items-center justify-center">
        <div>
          <Loader2 className="animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default PublicLoadingPage;
