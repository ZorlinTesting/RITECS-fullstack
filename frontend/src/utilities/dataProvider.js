import { stringify } from "query-string";

import { fetchUtils, DataProvider as RaDataProvider } from "react-admin";

/**
 * @typedef {Object} DataProvider
 * @property {Function} getList
 * @property {Function} getOne
 * @property {Function} getMany
 * @property {Function} getManyReference
 * @property {Function} create
 * @property {Function} update
 * @property {Function} updateMany
 * @property {Function} delete
 * @property {Function} deleteMany
 */

/**
 * Creates a data provider for React Admin.
 *
 * @param {string} apiUrl - The API URL.
 * @param {Function} [httpClient=fetchUtils.fetchJson] - HTTP client function.
 * @returns {DataProvider} The configured data provider.
 */

// const apiUrl = '/api';

import { getCachedData, setCachedData, clearCache } from './cacheUtils';

const dataProvider = (apiUrl, httpClient = fetchUtils.fetchJson) => {
  return {
    getList: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        ...fetchUtils.flattenObject(params.filter),
        _sort: field,
        _order: order.toLowerCase(),
        _start: (page - 1) * perPage,
        _end: page * perPage,
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      const cacheKey = `${resource}_${stringify(query)}`;

      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return Promise.resolve(cachedData);
      }

      return httpClient(url).then(({ headers, json }) => {
        console.log('Response Headers:', headers);
        console.log('Response Data:', json);
        const contentRange = headers.get('content-range');
        const total = contentRange ? parseInt(contentRange.split('/').pop(), 10) : json.count;
        const data = { data: json.results, total };

        setCachedData(cacheKey, data);
        return data;
      });
    },

    getOne: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
        data: json,
      })),

    getMany: (resource, params) => {
      const query = {
        id: params.ids,
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      const cacheKey = `${resource}_many_${stringify(query)}`;

      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return Promise.resolve(cachedData);
      }

      return httpClient(url).then(({ json }) => {
        const data = { data: json.results };

        setCachedData(cacheKey, data);
        return data;
      });
    },

    getManyReference: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        ...fetchUtils.flattenObject(params.filter),
        [params.target]: params.id,
        _sort: field,
        _order: order,
        _start: (page - 1) * perPage,
        _end: page * perPage,
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      const cacheKey = `${resource}_manyref_${stringify(query)}`;

      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return Promise.resolve(cachedData);
      }

      return httpClient(url).then(({ headers, json }) => {
        const contentRange = headers.get('content-range');
        const total = contentRange ? parseInt(contentRange.split('/').pop(), 10) : json.count;
        const data = { data: json.results, total };

        setCachedData(cacheKey, data);
        return data;
      });
    },

    update: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        clearCache(resource); // Invalidate cache
        return { data: json };
      }),

    updateMany: (resource, params) => {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        }).then(({ json }) => json)
      );
      return Promise.all(promises).then((responses) => {
        clearCache(resource); // Invalidate cache
        return { data: responses.map(json => json.id) };
      });
    },

    create: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        clearCache(resource); // Invalidate cache
        return { data: { ...params.data, id: json.id } };
      }),

    delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "DELETE",
      }).then(({ json }) => {
        clearCache(resource); // Invalidate cache
        return { data: json };
      }),

    deleteMany: (resource, params) => {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
        }).then(({ json }) => json)
      );
      return Promise.all(promises).then((responses) => {
        clearCache(resource); // Invalidate cache
        return { data: params.ids };
      });
    },
  };
};

export default dataProvider;
