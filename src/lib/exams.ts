export type ExamCategoryId = 'administration' | 'development' | 'ai';

export interface Exam {
  slug: string;
  name: string;
  description?: string;
  /** Section the exam is listed under on the dashboard. */
  category: ExamCategoryId;
}

export interface ExamCategory {
  id: ExamCategoryId;
  title: string;
  description: string;
}

/** Dashboard sections, in the order they are shown. */
export const examCategories: ExamCategory[] = [
  {
    id: 'administration',
    title: 'Administration and Architecture',
    description: 'Run, secure and design Azure infrastructure.'
  },
  {
    id: 'development',
    title: 'Development and DevOps',
    description: 'Build cloud apps and ship them with pipelines.'
  },
  {
    id: 'ai',
    title: 'AI and Machine Learning',
    description: 'Build, deploy and operate AI apps, agents and models.'
  }
];

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
    category: 'administration',
    name: 'AZ‑104: Microsoft Azure Administrator',
    description: 'Identities, governance, storage, compute and virtual networking.'
  },
  {
    slug: 'az-204',
    category: 'development',
    name: 'AZ‑204: Developing Solutions for Microsoft Azure',
    description: 'App Service, Functions, storage, security and messaging for developers.'
  },
  {
    slug: 'az-400',
    category: 'development',
    name: 'AZ‑400: Designing and Implementing Microsoft DevOps Solutions',
    description: 'Source control, pipelines, release strategy, security and monitoring.'
  },
  {
    slug: 'az-304',
    category: 'administration',
    name: 'AZ‑304: Microsoft Azure Architect Design',
    description: 'Designing reliable, secure and cost-effective Azure architectures.'
  },
  {
    slug: 'ai-103',
    category: 'ai',
    name: 'AI‑103: Developing AI Apps and Agents on Azure',
    description: 'Foundry models and agents, RAG, vision, speech and document extraction.'
  },
  {
    slug: 'ai-200',
    category: 'ai',
    name: 'AI‑200: Developing AI Cloud Solutions on Azure',
    description: 'Containers, vector data in Cosmos DB, PostgreSQL and Redis, messaging and monitoring.'
  },
  {
    slug: 'ai-300',
    category: 'ai',
    name: 'AI‑300: Operationalizing Machine Learning and Generative AI Solutions',
    description: 'MLOps and GenAIOps: training, deployment, evaluation and RAG tuning.'
  }
];

/** The exams of one dashboard section, in list order. */
export function examsInCategory(id: ExamCategoryId): Exam[] {
  return exams.filter((exam) => exam.category === id);
}

/** Splits 'AZ‑104: Microsoft Azure Administrator' into its code and title. */
export function splitExamName(exam: Exam): { code: string; title: string } {
  const [code, ...rest] = exam.name.split(':');
  return rest.length
    ? { code: code.trim(), title: rest.join(':').trim() }
    : { code: exam.slug.toUpperCase(), title: exam.name };
}
