import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client"
import { adminSearchAbleFields } from "./admin.constants";
import { calculatePagination } from "../../../utils/pagination";
import { prisma } from "../../../shared/prisma";
import { TAdminFilterRequest } from "./admin.interface";
import { TPaginationOptions } from "../../interfaces/pagination.interface";





















const getAllAdminsFromDb = async (params: TAdminFilterRequest, options: TPaginationOptions) => {
    const { skip, limit, page } = calculatePagination(options);

    const { searchTerm, ...filteredData } = params;


    const conditions: Prisma.AdminWhereInput[] = [];
    if (params.searchTerm) {
        conditions.push({
            OR: adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filteredData).length > 0) {
        conditions.push({
            AND: Object.keys(filteredData).map(key => ({
                [key]: {
                    equals: (filteredData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.AdminWhereInput = {
        AND: conditions
    }
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    })

    const total = await prisma.admin.count({
        where: whereConditions
    })
    return {

        meta: {
            page,
            limit,
            total
        }, data: {
            result
        }
    };
}



const getSingleAdmin = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    });

    return result;
}


const updateInDB = async (id: string, payload: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.admin.update({
        where: {
            id
        },
        data: payload
    })
    return result;
}





const deleteFromDB = async (id: string): Promise<Admin | null> => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        });

        await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });

        return adminDeletedData;
    });

    return result;
}


const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        });

        return adminDeletedData;
    });

    return result;
}




export const adminServices = {
    getAllAdminsFromDb,
    getSingleAdmin,
    updateInDB,
    deleteFromDB,
    softDeleteFromDB
}


