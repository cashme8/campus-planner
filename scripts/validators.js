export const patterns = {
  title: /^\S(?:.*\S)?$/,
  duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
};

export function validate(task) {
  const errors = [];
  if (!patterns.title.test(task.title)) errors.push('Invalid title');
  if (!patterns.duration.test(task.duration)) errors.push('Invalid duration');
  if (!patterns.date.test(task.dueDate)) errors.push('Invalid date');
  if (!patterns.tag.test(task.tag)) errors.push('Invalid tag');
  return errors;
}
