const SeekerLoadingPage = () => {
  return (
    <div className="space-y-3 p-6">
      <p className="text-sm text-muted-foreground">Loading seeker dashboard...</p>
      <div className="h-24 animate-pulse rounded-md bg-muted" />
      <div className="h-24 animate-pulse rounded-md bg-muted" />
    </div>
  );
};

export default SeekerLoadingPage;
