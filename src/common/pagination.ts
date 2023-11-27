export type PaginationQuery = {
    page: number;
    limit: number;
};

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
};

export type WithTotal<T> = {
    total: number;
    items: T[];
};

export function getSkipAndTake(
    page: number,
    limit: number,
): { skip: number; take: number } {
    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}
