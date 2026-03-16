import { Loader2 } from "lucide-react";

const RootLoadingPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};

export default RootLoadingPage;
