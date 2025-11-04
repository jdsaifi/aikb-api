import { Router } from 'express';
import { checkPermission } from '../../middleware/checkPermission';
import { authorizeUserRequest } from '../../middleware/userAuth';
import {
    addDocument,
    getDocumentById,
    listAllDocuments,
    userUpdateDocumentById,
} from '../../controllers/user/documentController';
import validateRequest from '../../middleware/validateRequest';
import {
    addDocumentSchema,
    updateDocumentSchema,
} from '../../validations/schema';
import { upload } from '../../middleware/fileUpload';

const router = Router();

// list all documents
router.get(
    '/v1/documents',
    [authorizeUserRequest, checkPermission('documents', 'view')],
    listAllDocuments
); // END

// add a document
router.post(
    '/v1/documents',
    [
        authorizeUserRequest,
        checkPermission('documents', 'add'),
        upload.array('documents', 5),
        validateRequest(addDocumentSchema),
    ],
    addDocument
); // END

// get a document by id
router.get(
    '/v1/documents/:id',
    [authorizeUserRequest, checkPermission('documents', 'view')],
    getDocumentById
); // END

// update a document
router.put(
    '/v1/documents/:id',
    [
        authorizeUserRequest,
        checkPermission('documents', 'update'),
        // validateRequest(updateDocumentSchema),
    ],
    userUpdateDocumentById
); // END

export default router;
