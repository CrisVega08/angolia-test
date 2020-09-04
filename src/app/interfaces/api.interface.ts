import { HttpHeaders, HttpParams } from '@angular/common/http';

// export interface IApi {
//   endpoint: Endpoint;
//   options: IApiOptions;
//   config?: IApiConfig;
// }

export interface IApiEndpoint {
  url: string;
  cache?: boolean;
}

export enum ResponseTypeEnum {
  arraybuffer = 'arraybuffer',
  blob = 'blob',
  text = 'text',
  json = 'json',
}

export interface IApiOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  // observe?: string;
  reportProgress?: boolean;
  // responseType: string;
  withCredentials?: boolean;
}

export interface IApiConfig {
  noLoading?: boolean;
  noHandleError?: boolean;
  successMessage?: string;
}

export interface IApiParameters {
  headers: HttpHeaders | null;
  params: HttpParams | null;
  url: string;
}

