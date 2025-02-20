// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-fetch';
import type { GetCa6B7066DocsData, GetCa6B7066DocsResponse, GetDetectionsData, GetDetectionsResponse } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Serve API documentation
 */
export const getCa6B7066Docs = <ThrowOnError extends boolean = false>(options?: Options<GetCa6B7066DocsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetCa6B7066DocsResponse, unknown, ThrowOnError>({
        security: [
            {
                name: 'Authorization',
                type: 'apiKey'
            }
        ],
        url: '/ca6b7066/docs',
        ...options
    });
};

/**
 * Get detections
 */
export const getDetections = <ThrowOnError extends boolean = false>(options: Options<GetDetectionsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetDetectionsResponse, unknown, ThrowOnError>({
        security: [
            {
                name: 'Authorization',
                type: 'apiKey'
            }
        ],
        url: '/detections',
        ...options
    });
};