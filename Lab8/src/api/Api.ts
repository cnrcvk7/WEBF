/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Medicine {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Substances */
  substances?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string | null;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /** Field */
  field?: string | null;
  /**
   * Dose
   * @min -2147483648
   * @max 2147483647
   */
  dose?: number | null;
}

export interface SubstanceMedicine {
  /** ID */
  id?: number;
  /**
   * Weight
   * @min -2147483648
   * @max 2147483647
   */
  weight?: number;
  /** Substance */
  substance?: number | null;
  /** Medicine */
  medicine?: number | null;
}

export interface UpdateMedicineStatusAdmin {
  /** Status */
  status: number;
}

export interface SubstanceAdd {
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Описание
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /**
   * Порядковый номер
   * @min -2147483648
   * @max 2147483647
   */
  number: number;
  /**
   * Фото
   * @format uri
   */
  image?: string | null;
}

export interface Substance {
  /** ID */
  id?: number;
  /** Image */
  image?: string;
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Описание
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /** Статус */
  status?: 1 | 2;
  /**
   * Порядковый номер
   * @min -2147483648
   * @max 2147483647
   */
  number: number;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface UserProfile {
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * Email
   * @minLength 1
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  medicines = {
    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesList
     * @request GET:/medicines/
     * @secure
     */
    medicinesList: (
      query?: {
        status?: number;
        date_formation_start?: string;
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/medicines/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesRead
     * @request GET:/medicines/{medicine_id}/
     * @secure
     */
    medicinesRead: (medicineId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/medicines/${medicineId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesDeleteDelete
     * @request DELETE:/medicines/{medicine_id}/delete/
     * @secure
     */
    medicinesDeleteDelete: (medicineId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/medicines/${medicineId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesDeleteSubstanceDelete
     * @request DELETE:/medicines/{medicine_id}/delete_substance/{substance_id}/
     * @secure
     */
    medicinesDeleteSubstanceDelete: (medicineId: string, substanceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/medicines/${medicineId}/delete_substance/${substanceId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesUpdateUpdate
     * @request PUT:/medicines/{medicine_id}/update/
     * @secure
     */
    medicinesUpdateUpdate: (medicineId: string, data: Medicine, params: RequestParams = {}) =>
      this.request<Medicine, any>({
        path: `/medicines/${medicineId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesUpdateSubstanceUpdate
     * @request PUT:/medicines/{medicine_id}/update_substance/{substance_id}/
     * @secure
     */
    medicinesUpdateSubstanceUpdate: (
      medicineId: string,
      substanceId: string,
      data: SubstanceMedicine,
      params: RequestParams = {},
    ) =>
      this.request<SubstanceMedicine, any>({
        path: `/medicines/${medicineId}/update_substance/${substanceId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesUpdateStatusAdminUpdate
     * @request PUT:/medicines/{medicine_id}/update_status_admin/
     * @secure
     */
    medicinesUpdateStatusAdminUpdate: (
      medicineId: string,
      data: UpdateMedicineStatusAdmin,
      params: RequestParams = {},
    ) =>
      this.request<UpdateMedicineStatusAdmin, any>({
        path: `/medicines/${medicineId}/update_status_admin/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags medicines
     * @name MedicinesUpdateStatusUserUpdate
     * @request PUT:/medicines/{medicine_id}/update_status_user/
     * @secure
     */
    medicinesUpdateStatusUserUpdate: (medicineId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/medicines/${medicineId}/update_status_user/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  substances = {
    /**
     * No description
     *
     * @tags substances
     * @name SubstancesList
     * @request GET:/substances/
     * @secure
     */
    substancesList: (
      query?: {
        substance_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/substances/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags substances
     * @name SubstancesCreateCreate
     * @request POST:/substances/create/
     * @secure
     */
    substancesCreateCreate: (
      data: {
        /**
         * @minLength 1
         * @maxLength 100
         */
        name: string;
        /**
         * @minLength 1
         * @maxLength 500
         */
        description: string;
        /**
         * @min -2147483648
         * @max 2147483647
         */
        number: number;
        /** @format binary */
        image?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<SubstanceAdd, any>({
        path: `/substances/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags substances
     * @name SubstancesRead
     * @request GET:/substances/{substance_id}/
     * @secure
     */
    substancesRead: (substanceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/substances/${substanceId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags substances
     * @name SubstancesAddToMedicineCreate
     * @request POST:/substances/{substance_id}/add_to_medicine/
     * @secure
     */
    substancesAddToMedicineCreate: (substanceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/substances/${substanceId}/add_to_medicine/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags substances
     * @name SubstancesDeleteDelete
     * @request DELETE:/substances/{substance_id}/delete/
     * @secure
     */
    substancesDeleteDelete: (substanceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/substances/${substanceId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags substances
     * @name SubstancesUpdateUpdate
     * @request PUT:/substances/{substance_id}/update/
     * @secure
     */
    substancesUpdateUpdate: (substanceId: string, data: Substance, params: RequestParams = {}) =>
      this.request<Substance, any>({
        path: `/substances/${substanceId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags substances
     * @name SubstancesUpdateImageCreate
     * @request POST:/substances/{substance_id}/update_image/
     * @secure
     */
    substancesUpdateImageCreate: (
      substanceId: string,
      data: {
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/substances/${substanceId}/update_image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
