const formatTime = (date: Date): string => `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

export const formatDateTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInDays === 0) {
    return `today at ${formatTime(date)}`;
  } else if (diffInDays === 1) {
    return `yesterday at ${formatTime(date)}`;
  } else if (diffInDays < 7) {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];
    return `${dayName} at ${formatTime(date)}`;
  } else if (diffInWeeks === 1) {
    return `last week on ${formatTime(date)}`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  } else if (diffInWeeks === 4) {
    return `last month`;
  } else if (now.getFullYear() === date.getFullYear()) {
    return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${formatTime(date)}`;
  } else {
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at ${formatTime(date)}`;
  }
};

export const getRelativeDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const diffInDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];

  if (date.toDateString() === today.toDateString()) {
    return `today at ${formatTime(date)}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `tomorrow at ${formatTime(date)}`;
  } else if (diffInDays > 0 && diffInDays <= 7) {
    return `next ${dayName} at ${formatTime(date)}`;
  } else if (diffInDays < 0 && diffInDays >= -7) {
    return `last ${dayName} at ${formatTime(date)}`;
  } else if (diffInDays > 7 && diffInDays <= 14) {
    return `one week ago at ${formatTime(date)}`;
  } else if (diffInDays > 14 && diffInDays <= 21) {
    return `two weeks ago at ${formatTime(date)}`;
  } else {
    return `on ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${formatTime(date)}`;
  }
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
