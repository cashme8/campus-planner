export const patterns = {
  title: /^\S(?:.*\S)?$/, // no leading/trailing spaces
  duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // numeric
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
  tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/ // letters, spaces, hyphens
};

// Advanced regex: detect duplicate consecutive words (back-reference)
const duplicateWords = /\b(\w+)\s+\1\b/i;

export function validate(task) {
  const errors = [];

  // Basic validations
  if (!patterns.title.test(task.title)) errors.push('Invalid title: remove leading/trailing spaces');
  if (!patterns.duration.test(task.duration)) errors.push('Invalid duration: must be numeric');
  if (!patterns.date.test(task.dueDate)) errors.push('Invalid date: format YYYY-MM-DD');
  if (!patterns.tag.test(task.tag)) errors.push('Invalid tag: letters, spaces, hyphens only');

  // Advanced regex validation
  if (duplicateWords.test(task.title)) errors.push('Title contains duplicate words');

  return errors;
}

