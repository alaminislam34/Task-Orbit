const SeekerHomePage = () => {
  const hasData = false;
  const hasError = false;

  if (hasError) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">Unable to load seeker dashboard right now.</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Seeker Dashboard</h2>
        <p className="text-sm text-muted-foreground">No data yet. Start by applying to a job.</p>
      </div>
    );
  }

  return <div className="p-6">Seeker dashboard ready.</div>;
};

export default SeekerHomePage;
