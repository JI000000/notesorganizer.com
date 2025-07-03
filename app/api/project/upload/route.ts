import { handleUploadLogic } from '@/lib/project-upload'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('zipFile') as File | null
  return handleUploadLogic(file)
} 