export interface Exam {
  slug: string;
  name: string;
  description?: string;
}

/** Site name shown in the header when no exam is open. */
export const siteName = 'Azure Practice Exams';

/**
 * Every practice exam on the site. The dashboard cards, the exam page header
 * and the static exam paths are all built from this list, so a new exam only
 * needs a `data/<slug>.json` file and an entry here.
 */
export const exams: Exam[] = [
  {
    slug: 'az-104',
    name: 'AZ‑104: Microsoft Azure Administrator',
    description: 'Identities, governance, storage, compute and virtual networking.'
  },
  {
    slug: 'az-204',
    name: 'AZ‑204: Developing Solutions for Microsoft Azure',
    description: 'App Service, Functions, storage, security and messaging for developers.'
  },
  {
    slug: 'az-400',
    name: 'AZ‑400: Designing and Implementing Microsoft DevOps Solutions',
    description: 'Source control, pipelines, release strategy, security and monitoring.'
  },
  {
    slug: 'az-304',
    name: 'AZ‑304: Microsoft Azure Architect Design',
    description: 'Designing reliable, secure and cost-effective Azure architectures.'
  }
];

/** Splits 'AZ‑104: Microsoft Azure Administrator' into its code and title. */
export function splitExamName(exam: Exam): { code: string; title: string } {
  const [code, ...rest] = exam.name.split(':');
  return rest.length
    ? { code: code.trim(), title: rest.join(':').trim() }
    : { code: exam.slug.toUpperCase(), title: exam.name };
}
