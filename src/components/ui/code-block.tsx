import * as React from 'react'
import { getSingletonHighlighter } from 'shiki'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'tsx',
  className,
}: CodeBlockProps) {
  const [html, setHtml] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCopied, setIsCopied] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted) return

    let mounted = true

    async function loadHighlighter() {
      try {
        const highlighter = await getSingletonHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: ['tsx', 'ts', 'jsx', 'js', 'bash', 'json'],
        })

        if (!mounted) return

        const theme =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'github-dark'
            : 'github-light'

        const highlighted = highlighter.codeToHtml(code, {
          lang: language,
          theme,
        })

        setHtml(highlighted)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load highlighter:', error)
        setIsLoading(false)
      }
    }

    loadHighlighter()

    return () => {
      mounted = false
    }
  }, [code, language, isMounted])

  React.useEffect(() => {
    if (!isMounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = async () => {
      try {
        const highlighter = await getSingletonHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: ['tsx', 'ts', 'jsx', 'js', 'bash', 'json'],
        })

        const theme = mediaQuery.matches ? 'github-dark' : 'github-light'
        const highlighted = highlighter.codeToHtml(code, {
          lang: language,
          theme,
        })
        setHtml(highlighted)
      } catch (error) {
        console.error('Failed to update theme:', error)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [code, language, isMounted])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (isLoading) {
    return (
      <div className={cn('relative rounded-md border bg-muted p-4', className)}>
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className={cn('relative group', className)}>
      <div className="absolute right-2 top-2 z-10">
        <Button
          size="icon-xs"
          variant="outline"
          onClick={handleCopy}
          className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {isCopied ? (
            <CheckIcon className="size-3" />
          ) : (
            <CopyIcon className="size-3" />
          )}
          <span className="sr-only">コピー</span>
        </Button>
      </div>
      <div
        className="rounded-md border bg-muted overflow-hidden [&_pre]:m-0! [&_pre]:p-4! [&_pre]:overflow-x-auto [&_pre]:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
