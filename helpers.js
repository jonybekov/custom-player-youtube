export const formatDisplayTime = (duration) /** 00:00 */ => {
  const minutes = Math.floor(duration / 60);
  const hours = Math.floor(duration / 3600);
  const seconds = Math.floor(duration % 60);

  const durationParts = [
    hours ? String(hours) : undefined,
    String(minutes),
    String(seconds).padStart(2, "0"),
  ].filter(Boolean);

  const resultString = durationParts.join(":");
  return resultString;
};
