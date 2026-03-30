export const detectIdentifierType = (identifier) => {
  if (identifier.includes("@")) return "email";
  if (/^\d{10,15}$/.test(identifier)) return "phone";
  return "username";
};