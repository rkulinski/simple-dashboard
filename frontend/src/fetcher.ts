const { REACT_APP_BASE_API_URL = '' } = process.env;

enum HTTPMethods {
  GET = 'GET',
}

export interface BasePaginationFilters {
  limit?: number;
  offset?: number;
}

interface FetcherParams<QueryParams extends BasePaginationFilters> {
  endpoint: string;
  method?: HTTPMethods;
  queryParams?: QueryParams;
}

export interface BaseEndpointResponse<Item> {
  count: number;
  next?: string;
  previous?: string;
  results: Item[];
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
): Promise<BaseEndpointResponse<Response>> {
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

const LOOP_LIMIT = 5;

export async function fetchAll<Item>(
  fetcher: (
    pagination: BasePaginationFilters
  ) => Promise<BaseEndpointResponse<Item>>,
  pageSize = 100
): Promise<{ count: number; items: Item[] }> {
  let next: string | undefined = '';
  let count = 0;
  let items: Item[] = [];
  let loopCounter = 0;
  let nextPage = 0;

  while (next !== null) {
    loopCounter += 1;
    if (loopCounter > LOOP_LIMIT) {
      console.error('Could not fetch all data');
      break;
    }
    const response = await fetcher({
      limit: pageSize,
      offset: nextPage * pageSize,
    });
    count = response.count;
    if (count === 0) {
      break;
    }

    next = response.next;
    nextPage += 1;
    items = [...items, ...response.results];
  }

  return {
    count,
    items,
  };
}
