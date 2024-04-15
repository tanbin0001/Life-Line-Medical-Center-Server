


type TOptions = {
    page?: number;
    limit?: number;
    sortOrder?: string;
    sortBy?: string;
}

type TOptionsResult = {
    page: number;
    limit: number;
    sortOrder: string;
    sortBy: string;
    skip:number
}


export const calculatePagination = (options: TOptions):TOptionsResult => {




    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (Number(page) - 1) * Number(limit)
    const sortBy: string = options.sortBy || 'createdAt'
    const sortOrder: string = options.sortOrder || 'desc'

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    }
}