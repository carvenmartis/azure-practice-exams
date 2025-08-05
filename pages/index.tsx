import Link from 'next/link';

/**
 * Home page renders a dashboard of available practice exams. The exams
 * are presented in a responsive grid. Selecting a card navigates to
 * the corresponding exam page.
 */
export default function Home() {
  const exams = [
    {
      slug: 'az-104',
      name: 'AZ‑104: Microsoft Azure Administrator'
    },
    {
      slug: 'az-204',
      name: 'AZ‑204: Developing Solutions for Microsoft Azure'
    },
    {
      slug: 'az-400',
      name: 'AZ‑400: Designing and Implementing Microsoft DevOps Solutions'
    },
    {
      slug: 'az-304',
      name: 'AZ‑304: Microsoft Azure Architect Design'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Practice Exams Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full">
          {exams.map((exam) => (
            <Link key={exam.slug} href={`/exams/${exam.slug}`}> 
              <div className="cursor-pointer rounded-xl shadow-md bg-white p-6 hover:shadow-lg transition-shadow flex flex-col justify-between items-center h-full min-h-[180px]">
                <div className="w-full flex flex-col items-center flex-1 justify-center">
                  <h2 className="text-xl font-semibold mb-2 text-center">{exam.name}</h2>
                  <p className="text-sm text-gray-600 text-center">
                    Start the {exam.slug.toUpperCase()} practice exam
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}