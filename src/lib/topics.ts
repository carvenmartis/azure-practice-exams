import { getExamGuide } from './exam-guides';
import type { SkillArea } from './exam-guides';

/** Used for questions that match none of the exam's skill areas. */
export const otherTopic = 'Other topics';

/** Questions in a topic drill: a short round from one skill area. */
export const drillSize = 10;

/** The exam page link for a topic drill on one skill area. */
export function drillHref(slug: string, topic: string) {
  return `/exams/${slug}?mode=drill&topic=${encodeURIComponent(topic)}`;
}

const patternCache = new Map<SkillArea, RegExp[]>();

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keywordPatterns(area: SkillArea) {
  let patterns = patternCache.get(area);
  if (!patterns) {
    patterns = area.keywords.map((keyword) => new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}`, 'g'));
    patternCache.set(area, patterns);
  }
  return patterns;
}

/**
 * Places a question in one skill area of its exam's official outline. The
 * questions carry no topic of their own, so this counts how often each area's
 * keywords appear in the question, its answers, its explanation and its docs
 * link, and picks the area with the most matches (the question text counts
 * double). Falls back to 'Other topics'.
 */
export function topicFor(
  slug: string,
  question: { question: string; options: string[]; explanation: string; link?: string }
): string {
  const guide = getExamGuide(slug);
  if (!guide) return otherTopic;
  const stem = question.question.toLowerCase();
  const rest = [...question.options, question.explanation, (question.link ?? '').replace(/[/-]/g, ' ')]
    .join(' ')
    .toLowerCase();

  let best = otherTopic;
  let bestScore = 0;
  for (const area of guide.areas) {
    let score = 0;
    for (const pattern of keywordPatterns(area)) {
      score += 2 * (stem.match(pattern)?.length ?? 0) + (rest.match(pattern)?.length ?? 0);
    }
    if (score > bestScore) {
      best = area.name;
      bestScore = score;
    }
  }
  return best;
}
