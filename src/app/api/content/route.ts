import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr'

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value_fr, value_en')

    if (!data) {
      return NextResponse.json({}, {
        headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
      })
    }

    const content = (data as { key: string; value_fr: string; value_en: string }[]).reduce<
      Record<string, string>
    >((acc, item) => {
      acc[item.key] = locale === 'en' ? item.value_en : item.value_fr
      return acc
    }, {})

    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return NextResponse.json({}, { status: 200 })
  }
}
