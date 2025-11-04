import { Router } from 'express';

import {
    adminAddSampleDocuments,
    adminDemoUpsertPineconeDocuments,
    adminSampleAISearch,
    adminSampleUpdateDocumentPolicy,
    adminSampleUpsertPineconeDocuments,
} from '../../controllers/admin/adminDcoumentController';
import { authorizeUserRequest } from '../../middleware/userAuth';

const router = Router();

// add sample documents
router.post('/v1/admins/samples/documents/insert', adminAddSampleDocuments);

// update document policy
router.post(
    '/v1/admins/samples/documents/update-policy',
    adminSampleUpdateDocumentPolicy
);

// upsert pinecone documents
router.post(
    '/v1/admins/samples/documents/upsert-pinecone-documents',
    adminSampleUpsertPineconeDocuments
);

// pinecone upsert documents for demo
router.post(
    '/v1/admins/demo/upsert-pinecone-documents-for-demo',
    adminDemoUpsertPineconeDocuments
);

// admin sample ai search
router.post(
    '/v1/admins/samples/documents/ai-search',
    authorizeUserRequest,
    adminSampleAISearch
);

export default router;
