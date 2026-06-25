import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  subject: string
  body: string
}

export function TemplatePreview({ subject, body }: Props) {
  // Reemplaza variables con valores de ejemplo
  const preview = (str: string) =>
    str
      .replace(/\{nombre\}/g, 'Juan García')
      .replace(/\{empresa\}/g, 'Acme Corp')
      .replace(/\{ciudad\}/g, 'Guatemala')

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-xs text-muted-foreground font-normal">Vista previa</CardTitle>
        <p className="text-sm font-medium mt-1">{preview(subject) || '(sin asunto)'}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
          {preview(body) || 'El contenido aparecerá aquí...'}
        </pre>
      </CardContent>
    </Card>
  )
}
