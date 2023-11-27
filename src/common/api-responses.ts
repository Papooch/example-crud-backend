export const HttpResponse = <S extends number, T>(status: S, body: T) => ({
    status,
    body,
});

export const OkResponse = <T>(body: T) => HttpResponse(200, body);
export const CreatedResponse = <T>(body: T) => HttpResponse(201, body);
