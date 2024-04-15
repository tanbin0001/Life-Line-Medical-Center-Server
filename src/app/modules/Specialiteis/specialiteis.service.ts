import { Request } from "express";
 
import { IFile } from "../../interfaces/file";
import { uploadToCloudinary } from "../../utils/fileUploader";
import { prisma } from "../../../shared/prisma";
import { Specialties } from "@prisma/client";
 
const inserIntoDB = async (req: Request) => {

    const file = req.file as IFile;

    if (file) {
        const uploadFileToCloudinary = await  uploadToCloudinary(file);
        req.body.icon = uploadFileToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
};

const getAllFromDB = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
}

const deleteFromDB = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};

export const SpecialtiesService = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB
}