from django.utils.cache import patch_cache_control

class CacheControlMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if 'image' in response.get('Content-Type', ''):
            patch_cache_control(response, max_age=86400)
        return response
