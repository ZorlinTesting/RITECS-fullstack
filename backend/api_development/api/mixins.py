class SortMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        sort = self.request.query_params.get('_sort')
        order = self.request.query_params.get('_order', '')
        if sort:
            if order.lower() == 'desc':
                sort = f'-{sort}'
            queryset = queryset.order_by(sort)
        return queryset
