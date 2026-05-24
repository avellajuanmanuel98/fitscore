import json
import fitz  # PyMuPDF
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .services import analyze_fit


def extract_pdf_text(file) -> str:
    pdf = fitz.open(stream=file.read(), filetype='pdf')
    text = ''
    for page in pdf:
        text += page.get_text()
    pdf.close()
    return text.strip()


@csrf_exempt
@require_http_methods(["POST"])
def analyze(request):
    try:
        # Determinar si es JSON (texto) o multipart (PDF)
        content_type = request.content_type or ''

        if 'multipart' in content_type:
            job_description = request.POST.get('job_description', '').strip()
            cv_text = ''
            if 'cv_file' in request.FILES:
                cv_text = extract_pdf_text(request.FILES['cv_file'])
            else:
                cv_text = request.POST.get('cv_text', '').strip()
        else:
            body = json.loads(request.body)
            job_description = body.get('job_description', '').strip()
            cv_text = body.get('cv_text', '').strip()

        if not job_description or not cv_text:
            return JsonResponse({'error': 'La oferta y el CV son obligatorios.'}, status=400)
        if len(job_description) < 50:
            return JsonResponse({'error': 'La oferta de trabajo es demasiado corta.'}, status=400)
        if len(cv_text) < 100:
            return JsonResponse({'error': 'El CV es demasiado corto o el PDF no tiene texto extraíble.'}, status=400)

        result = analyze_fit(job_description, cv_text)
        return JsonResponse(result)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Formato de solicitud inválido.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
