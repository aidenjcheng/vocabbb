interface InactivityWarningProps {
  inactivitySeconds: number;
}

export default function InactivityWarning({
  inactivitySeconds,
}: InactivityWarningProps) {
  // Calculate inactivity warning opacity
  const getInactivityWarningOpacity = (): number => {
    if (inactivitySeconds < 5) return 0;
    // Scale from 0 to 1 between 5 and 10 seconds
    return (inactivitySeconds - 5) / 5;
  };

  if (inactivitySeconds < 5) return null;

  return (
    <div>
      <div
        className="fixed inset-0 bg-red-500/75 pointer-events-none z-30 transition-opacity duration-100 backdrop-blur-[4px]"
        style={{
          opacity: getInactivityWarningOpacity(),
        }}
      />
      {/* <div
        className="fixed inset-0  pointer-events-none z-30 transition-opacity duration-100  "
        style={{
          opacity: getInactivityWarningOpacity(),
        }}
      /> */}
    </div>
  );
}
