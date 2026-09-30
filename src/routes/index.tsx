import HeroSection from '#/components/hero'
import RegisterSection from '#/components/register'
import SiteFooter from '#/components/footer'
import { createFileRoute } from '@tanstack/react-router'
import { getCountriesFn, getQuizFn } from '#/data/engagements'

const QUIZ_ID = '24'

const SITE_NAME = 'SportPesa Racing'
const DEFAULT_TITLE = 'SportPesa Racing | Mall Tour'
const DEFAULT_DESCRIPTION =
  'Register for your chance to see the SportPesa Racing car on tour at Kenyan malls. Take photos with the legend.'
const OG_IMAGE = '/racing-car.jpg'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [quiz, countries] = await Promise.all([
      getQuizFn({ data: { quizId: QUIZ_ID } }),
      getCountriesFn(),
    ])
    return { quiz, countries }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.quiz?.title
      ? `${loaderData.quiz.title} | Mall Tour`
      : DEFAULT_TITLE
    const description =
      loaderData?.quiz?.description?.trim() || DEFAULT_DESCRIPTION

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        {
          name: 'keywords',
          content:
            'SportPesa Racing, SportPesa, F1, racing car, Kenya malls, mall tour, fan registration',
        },
        { name: 'author', content: SITE_NAME },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0c1345' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: OG_IMAGE },
        { property: 'og:locale', content: 'en_KE' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: OG_IMAGE },
      ],
    }
  },
  component: Home,
})

function Home() {
  const { quiz, countries } = Route.useLoaderData()

  return (
    <main>
      <HeroSection />
      <RegisterSection
        quizId={String(quiz.id)}
        questions={quiz.questions ?? []}
        countries={countries}
      />
      <SiteFooter />
    </main>
  )
}
