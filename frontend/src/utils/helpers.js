// Utility functions
export const createSlug = (text) => {
  if (!text) return "item";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const truncateText = (text, length = 50) => {
  return text?.length > length ? text.substring(0, length) + "..." : text;
};
