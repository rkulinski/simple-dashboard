const { REACT_APP_BASE_API_URL = '' } = process.env;

enum HTTPMethods {
  GET = 'GET',
}

interface FetcherParams<QueryParams> {
  endpoint: string;
  method?: HTTPMethods;
  queryParams?: QueryParams;
}

function mapQueryParamsToURL(
  queryParams: Record<string, string | number>
): string {
  if (Object.keys(queryParams).length === 0) {
    return '';
  }

  const params = Object.entries(queryParams)
    .map(([name, value]) => `${name}=${value}`)
    .join('&');

  return `?${params}`;
}

export async function fetcher<Response, QueryParams>(
  params: FetcherParams<QueryParams>
): Promise<Response> {
  if (REACT_APP_BASE_API_URL.length === 0) {
    return Promise.reject('Invalid configuration.');
  }

  const { endpoint, method = HTTPMethods.GET, queryParams = {} } = params;
  const combinedEndpoint =
    REACT_APP_BASE_API_URL + endpoint + mapQueryParamsToURL(queryParams);
  const response = await fetch(combinedEndpoint, { method });

  if (!response.ok) {
    return Promise.reject(response);
  }

  return response.json();
}
