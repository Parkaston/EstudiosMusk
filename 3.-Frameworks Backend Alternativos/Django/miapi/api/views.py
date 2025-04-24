from django.shortcuts import render
from django.http import JsonResponse

def saludo(request):
    data = {
        'mensaje': '¡Hola desde Django!',
        'estado': 'ok'
    }
    return JsonResponse(data)