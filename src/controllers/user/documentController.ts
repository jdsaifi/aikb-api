import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { documentService } from '../../services/user';
import { StatusCodes } from 'http-status-codes';
import DocumentParser from '../../utils/documentParser';
import { IAddDocumentInput } from '../../types';
import { IUpdateDocumentInput } from '../../services/user/DocumentService';

// list all documents by user
export const listAllDocuments = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /documents');
        const { user } = res.locals;

        const result = await documentService.listAll(user);
        res.success(StatusCodes.OK, result);
    }
); // end

// add a document
export const addDocument = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /users/documents');
    const { user } = res.locals;
    const body = req.payload.body;

    consoleLog.log('\n\n\nbody: ', body);

    const input: IAddDocumentInput = {
        ...body,
        createdBy: user._id,
    };

    // Process uploaded files
    if (req.files) {
        for (const file of req.files as Express.Multer.File[]) {
            const { content, parsed_at } = await DocumentParser.parseDocument(
                file
            );
            Object.assign(input, {
                filename: file.filename,
                originalname: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                content,
                parsed_at,
            });
        }
    }

    consoleLog.log('\n\n\ninput:', input);

    const result = await documentService.add(input);
    res.success(StatusCodes.OK, result);
}); // end

// get a document by id
export const getDocumentById = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /documents/:id');
        const { id } = req.params;
        consoleLog.log('id: ', id);
        const result = await documentService.get(id);
        consoleLog.log('result: ', result);
        if (!result) {
            return res.error(StatusCodes.NOT_FOUND, 'Document not found');
        }
        res.success(StatusCodes.OK, result);
    }
); // end

// update a document by id
export const userUpdateDocumentById = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /documents/:id');
        // const { user } = res.locals;
        const { id } = req.params;
        const body = req.body;

        // return consoleLog.log('body: ', body);

        const input: IUpdateDocumentInput = {
            heading: body.heading,
            subHeading: body.subHeading,
            description: body.description,
        };

        if (body.policy) {
            input.policy = JSON.parse(body.policy);
        }
        // return consoleLog.log('input body: ', input);
        const result = await documentService.update(id, input);
        res.success(StatusCodes.OK, result);
    }
); // end
