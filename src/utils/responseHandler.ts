export class ApiResponse {
    status: string;
    data: any;
    metadata!: object;
    links!: object;
    constructor(data: any = [], metadata = {}, links = {}) {
        this.status = 'success';
        this.data = Array.isArray(data) ? data : [data];

        if (Object.keys(metadata).length) {
            this.metadata = metadata;
        }
    }
}

interface ApiErrorArgs {
    name?: string;
    httpCode: number;
    description: string;
    isOperational?: boolean;
}

export class ApiError extends Error {
    public readonly name: string;
    public readonly httpCode: number;
    public readonly isOperational: boolean = true;

    constructor(args: ApiErrorArgs) {
        super(args.description);

        this.name = args.name || 'Error';
        this.httpCode = args.httpCode;

        if (args.isOperational !== undefined) {
            this.isOperational = args.isOperational;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}
