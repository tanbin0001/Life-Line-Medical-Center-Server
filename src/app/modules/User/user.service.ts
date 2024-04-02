import { Admin, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../utils/fileUploader";
import { IFile } from "../../interfaces/file";
import { TPaginationOptions } from "../../interfaces/pagination.interface";
import { calculatePagination } from "../../../utils/pagination";
import { userFilterableFields } from "./user.constant";





const createAdmin = async (req: any) => {

    const file: IFile = req.file;

    if (file) {
        const uploadImgTocloudinary = await uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadImgTocloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};
const createDoctor = async (req: any) => {

    const file: IFile = req.file;

    if (file) {
        const uploadImgTocloudinary = await uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadImgTocloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};
const createPatient = async (req: any) => {

    const file: IFile = req.file;

    if (file) {
        const uploadImgTocloudinary = await uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadImgTocloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};



const getAllUsersFromDB = async (params: any, options: TPaginationOptions) => {

    const { skip, limit, page } = calculatePagination(options);

    const { searchTerm, ...filteredData } = params;


    const conditions: Prisma.UserWhereInput[] = [];
    if (params.searchTerm) {
        conditions.push({
            OR: userFilterableFields.map(field => ({
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

    const whereConditions: Prisma.UserWhereInput = {
        AND: conditions
    }
    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    })

    const total = await prisma.user.count({
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


export const userServices = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsersFromDB

}