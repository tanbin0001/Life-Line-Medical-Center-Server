import { Prisma, PrismaClient } from "@prisma/client"
import { adminSearchAbleFields } from "./admin.constants";
import { calculatePagination } from "../../../utils/pagination";
import { prisma } from "../../../shared/prisma";





















const getAllAdminsFromDb = async (params: any, options: any) => {
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
                    equals: filteredData[key]
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
    return result;
}









export const adminServices = {
    getAllAdminsFromDb
}


