import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter, Inject } from '@angular/core';
import { SnakecaseSerializer } from 'cerealizr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

import { IApiConfig, IApiEndpoint, IApiOptions, IApiParameters} from '../interfaces/api.interface'
// import { IEnvironment } from '../interfaces/environment.interface';

// import { MessageService } from './message.service';

// interface Config {
//   noLoading?: boolean;
//   noHandleError?: boolean;
//   successMessage?: string;
// }


const CACHE_DURATION = 1000 * 60 * 60 * 24; // One day
const snakecaseSerializer = new SnakecaseSerializer();

const UNAUTHORIZED = 401;

export enum ObserveEnum {
  body = 'body',
  events = 'events',
  response = 'response',
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  cache$: {} = {};
  eventRequests$ = new BehaviorSubject(0);
  setLoader$ = new BehaviorSubject(true);
  unauthorized: EventEmitter<any> = new EventEmitter();

  constructor(
    // @Inject('environment') readonly environment: IEnvironment,
    readonly http: HttpClient,
    // readonly message: MessageService
  ) {}

  /**
   * HTTP get request
   * @param queryParameters is an object with the queryParameters
   * @param config   noLoading?: boolean; noHandleError?: boolean; successMessage?: string;
   */
  get(endpoint: IApiEndpoint, options?: IApiOptions, config?: IApiConfig): Observable<any> {
    // const { params, headers } = options;
    let shouldCache = false;
    let baseUrl: string;

    if (typeof endpoint === 'string') {
      baseUrl = endpoint;
    } else {
      baseUrl = endpoint.url;
      shouldCache = endpoint.cache;
    }
    const { url, params, headers } = this.getRequestOptions(baseUrl, options);

    if (shouldCache) {
      // Create url with query params
      const urlWithParams = this.getUrlWithQueryParams(params, url);

      // Create behavior subject if undefined
      if (this.cache$[urlWithParams] === undefined) {
        const creationTimeInMilliseconds = new Date().getTime();

        this.cache$[urlWithParams] = {
          lastUpdate: creationTimeInMilliseconds,
          subject: new BehaviorSubject({}),
        };
      }

      // Sets behavior subject value if value is an empty object
      const cache = this.cache$[urlWithParams];
      const nowInMilliseconds = new Date().getTime();
      if (
        JSON.stringify(cache.subject.getValue()) === '{}' ||
        nowInMilliseconds > cache.lastUpdate + CACHE_DURATION
      ) {
        this.addPipes(this.http.get(url, { params }), config).subscribe(
          (response) => {
            if (response) {
              cache.lastUpdate = nowInMilliseconds;
              cache.subject.next(response);
            }
          }
        );
      }

      // Returns behavior subject
      return cache.subject.pipe(
        filter((value) => JSON.stringify(value) !== '{}')
      );
    }
    return this.addPipes(this.http.get(url, { ...options, params, headers }), config);
  }

  /**
   * HTTP post request
   * @param data is the data send in the body
   * @param queryParameters is an object with the queryParameters
   * @param config   noLoading?: boolean; noHandleError?: boolean; successMessage?: string;
   */
  post(baseUrl, data, options?: IApiOptions, config?: IApiConfig): Observable<any> {
    const { url, params, headers } = this.getRequestOptions(baseUrl, options);
    return this.addPipes(this.http.post(url, data, { params, headers }), config);
  }

  /**
   * HTTP put request
   * @param data is the data send in the body
   * @param queryParameters is an object with the queryParameters
   * @param config   noLoading?: boolean; noHandleError?: boolean; successMessage?: string;
   */
  put(baseUrl, data, options?: IApiOptions, config?: IApiConfig): Observable<any> {
    const { url, params, headers } = this.getRequestOptions(baseUrl, options);
    return this.addPipes(this.http.put(url, data, { params, headers }), config);
  }

  /**
   * HTTP delete request
   * @param data is the data send in the body
   * @param queryParameters is an object with the queryParameters
   * @param config   noLoading?: boolean; noHandleError?: boolean; successMessage?: string;
   */
  delete(
    baseUrl,
    data,
    options?: IApiOptions,
    config?: IApiConfig
  ): Observable<any> {
    const { url, params, headers } = this.getRequestOptions(baseUrl, options);
    return this.addPipes(
      this.http.request('delete', url, {
        params,
        headers,
        body: data,
      }),
      config
    );
  }

  // getPlainText(url, queryParameters, config?: Config): Observable<any> {
  //   url = this.setUrl(url);
  //   const params = this.getParams(queryParameters);
  //   const request = this.http
  //     .get(url, {
  //       params,
  //       responseType: 'text',
  //     })
  //     .pipe(
  //       tap(() => {
  //         if (config) {
  //           if (!config.noLoading) {
  //             this.substractRequest();
  //           }
  //           if (config.successMessage) {
  //             this.message.setSuccessMessage(config.successMessage);
  //           }
  //         } else {
  //           this.substractRequest();
  //         }
  //       })
  //     );

  //   return this.setLoader$.pipe(
  //     tap(() => this.initVariables(config)),
  //     take(1),
  //     switchMap(() => request)
  //   );
  // }

  /**
   * Delete the error and start the loader
   */
  private initVariables = (config: IApiConfig) => {
    // Manage loader
    if (!config || !config.noLoading) {
      this.sumRequest();
    }
  }

  /**
   *
   * @param queryParams Query parameter object, support lowerCammelCase
   */
  readonly getParams = (queryParams: HttpParams | { [param: string]: string  | string[]  }): HttpParams => {
    if (!queryParams) {
      return null;
    } else if (queryParams instanceof HttpParams) {
      return queryParams;
    }
    const casedQueryParameters = snakecaseSerializer.serialize(queryParams);
    return Object.keys(casedQueryParameters).reduce((params, paramName) => {
      return params.set(paramName, casedQueryParameters[paramName]);
    }, new HttpParams());
  };

  /**
   *
   * @param queryParameters Query parameter object, support lowerCammelCase
   */
  readonly getHeaders = (queryHeader: HttpHeaders | { [header: string]: string | string[] }): HttpHeaders => {
    if (!queryHeader) {
      return null;
    } else if (queryHeader instanceof HttpHeaders) {
      return queryHeader;
    }
    const casedHeaders = snakecaseSerializer.serialize(queryHeader);
    return Object.keys(casedHeaders).reduce((header, headerName) => {
      return header.set(headerName, casedHeaders[headerName]);
    }, new HttpHeaders());
  };

  readonly getUrlWithQueryParams = (params: HttpParams, url: string) : string => {
    if (params) {
      const jsonParams = params.keys().reduce((json, param ) => ({ ...json, [param]: params.get(param) }), {});
      return url +=
        '?' +
        Object.entries(jsonParams)
          .map((keyValue) => keyValue.join('='))
          .join('&');
    }
    return url;
  }


  /**
   * This method set parameters in the url and concat baseUrl if does not
   * includes 'http'
   * @param url Api url
   * @param queryParameters Object with the parameters
   * @returns The final url
   */
  readonly setUrl = (url: string): string => {
    // Complete url
    if (!url.includes('http')) {
      url = this.environment.baseUrl + url;
    }
    return url;
  };


  readonly getRequestOptions = (url, options): IApiParameters => {
    const { params, headers } = options;
    const newUrl = this.setUrl(url);
    const queryParams = this.getParams(params);
    const queryHeaders = this.getHeaders(headers);
    return ({ url: newUrl, params: queryParams, headers: queryHeaders });
  }

  /**
   * Add pipes to an observable
   * @param observable Observable which will have the pipes
   * @returns Observable with pipes
   */
  private addPipes(
    observable: Observable<any>,
    config?: IApiConfig
  ): Observable<any> {
    const request = observable.pipe(
      tap(() => {
        if (config) {
          if (!config.noLoading) {
            this.substractRequest();
          }
          if (config.successMessage) {
            this.message.setSuccessMessage(config.successMessage);
          }
        } else {
          this.substractRequest();
        }
      }),
      catchError((error) => {
        let reset = false;
        if (error.status === UNAUTHORIZED) {
          this.unauthorized.emit();
          reset = true;
        }
        this.substractRequest(reset);
        if (!config || !config.noHandleError) {
          this.message.handleError(error);
        }
        return of(undefined);
      })
    );

    return this.setLoader$.pipe(
      tap(() => this.initVariables(config)),
      take(1),
      switchMap(() => request)
    );
  }

  /**
   * Increment request quantity
   */
  private  sumRequest = async () => {
    setTimeout(() => {
      const requests = this.eventRequests$.value + 1;
      this.eventRequests$.next(requests);
    }, 0);
  }

  /**
   * Increment request quantity
   */
  private substractRequest = async(reset = false) => {
    setTimeout(() => {
      const requests = reset ? 0 : this.eventRequests$.value - 1;
      if (requests >= 0) {
        this.eventRequests$.next(requests);
      }
    }, 0);
  }
}
