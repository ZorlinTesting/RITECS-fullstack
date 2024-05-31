from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'perPage'
    page_query_param = 'page'

    def get_paginated_response(self, data):
        content_range = f'items {self.page.start_index()}-{self.page.end_index()}/{self.page.paginator.count}'
        headers = {
            'Content-Range': content_range
        }
        return Response({
            'count': self.page.paginator.count,
            'results': data
        }, headers=headers)

