// Safely compile user-entered regex
export function compileRegex(input, flags = 'i') {
  try {
    return input ? new RegExp(input, flags) : null;
  } catch {
    return null; // Prevent crashes from invalid patterns
  }
}

// Highlight matches in text using <mark>
export function highlight(text, re) {
  if (!re) return text;
  return text.replace(re, match => `<mark>${match}</mark>`);
}
