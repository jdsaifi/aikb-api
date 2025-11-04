import { adminCompanyService } from '../../services/admin';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { Request, Response } from 'express';
import sampleDocuments from '../../sample-docs.json';
import { DocumentModel } from '../../models/Document';
import { TagMasterModel } from '../../models/TagMaster';
import { ITagMaster } from '../../types';
import PineconeHelper from '../../utils/pineconeHelper';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import sampleDocuments1 from '../../sample-documents.json';
import { SampleDocumentModel } from '../../models/SampleDocument';
import { ApiError } from '../../utils/responseHandler';
import { StatusCodes } from 'http-status-codes';
import { isPolicySatisfied, toMongoId } from '../../utils/helpers';
import { AIService } from '../../services/AIService';
import ConversationService from '../../services/user/ConversationService';
import { DemoDocumentModel } from '../../models/DemoDocument';

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 150,
    chunkOverlap: 100,
});

/** admin add sample documents */
export const adminAddSampleDocuments = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /admins/samples/documents/insert'
        );
        const tags = await TagMasterModel.find({}).lean();

        for (let i = 0; i < sampleDocuments1.length; i++) {
            const document = sampleDocuments1[i];
            const documentPolicy = {
                // allow_any_of: [getRandomTags(tagIds), getRandomTags(tagIds)],
                // require_all_of: [getRandomTags(tagIds), getRandomTags(tagIds)],
                // require_none_of: [getRandomTags(tagIds), getRandomTags(tagIds)],

                allow_any_of_string: [getRandomTag(tags), getRandomTag(tags)],
                require_all_of_string: [getRandomTag(tags), getRandomTag(tags)],
                require_none_of_string: [
                    getRandomTag(tags),
                    getRandomTag(tags),
                ],
            };
            // await SampleDocumentModel.create({
            //     heading: document?.title || '',
            //     content: document?.content || '',
            //     policy: documentPolicy,
            // });
        }

        res.success(201, {});

        // const documents = await DocumentModel.find({})
        //     .select('id')
        //     .limit(70)
        //     .lean();
        // const documentIds = documents.map((doc) => doc._id);

        // const pineconeInput: any = [];
        // console.log('Sample Documents:', sampleDocuments.length);
        // for (let i = 0; i < sampleDocuments.length; i++) {
        //     const doc = sampleDocuments[i];
        //     // get random document id
        //     const randomDocumentId =
        //         documentIds[Math.floor(Math.random() * documentIds.length)];

        //     pineconeInput.push({
        //         _id: doc.id,
        //         content: `${doc.title} - ${doc.content}`,
        //         title: doc.title,
        //         text: doc.content,
        //         sourceId: randomDocumentId,
        //     });
        // }

        // res.success(201, {
        //     pineconeInput,
        //     // documentIds,
        // });
    }
); // END

const getRandomTags = (tags: any[]) => {
    return tags[Math.floor(Math.random() * tags.length)];
};

const getRandomTag = (tags: any[]) => {
    const tag = tags[Math.floor(Math.random() * tags.length)];
    return `${tag.key}:${tag.value}`;
};

// update first 70 documents with document policy
export const adminSampleUpdateDocumentPolicy = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /admins/samples/documents/update-policy'
        );

        const documents = await DocumentModel.find({})
            .select('id')
            .limit(70)
            .lean();

        const tags = await TagMasterModel.find({}).lean();

        for (let i = 0; i < documents.length; i++) {
            const documentId = documents[i]._id;

            const documentPolicy = {
                // allow_any_of: [getRandomTags(tagIds), getRandomTags(tagIds)],
                // require_all_of: [getRandomTags(tagIds), getRandomTags(tagIds)],
                // require_none_of: [getRandomTags(tagIds), getRandomTags(tagIds)],

                allow_any_of_string: [getRandomTag(tags), getRandomTag(tags)],
                require_all_of_string: [getRandomTag(tags), getRandomTag(tags)],
                require_none_of_string: [
                    getRandomTag(tags),
                    getRandomTag(tags),
                ],
            };

            await DocumentModel.findByIdAndUpdate(documentId, {
                policy: documentPolicy,
            });
            console.log('\n\n');
            consoleLog.log('Document Policy:', documentId, documentPolicy);
        }

        res.success(200, {
            message: 'Document policy updated',
        });
    }
); // END

export const adminSampleUpsertPineconeDocuments = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /admins/samples/documents/upsert-pinecone-documents'
        );

        const documents = await SampleDocumentModel.find({});
        const pineconeHelper = new PineconeHelper();

        for (let i = 0; i < documents.length; i++) {
            const document = documents[i];

            const chunks = await textSplitter.createDocuments(
                [document.content],
                []
            );
            const documentInput = chunks.map((chunk) => ({
                _id: document._id,
                content: chunk.pageContent,
                heading: document.heading,
            }));

            try {
                await pineconeHelper.upsertDocuments(documentInput);
            } catch (error) {
                consoleLog.log('error in upserting documents');
                consoleLog.log('document Id:', document._id);

                throw new ApiError({
                    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    description: `Error in upserting documents on doc id: ${document._id}`,
                });
                break;
            }
            // console.log('Pinecone Response:', pineconeResponse);
        }

        //const documents = await DocumentModel.find({}).limit(70).lean();
        //return consoleLog.log('Documents:', documents[0]._id);
        //

        // const pineconeInput: any = [];
        // for (let i = 0; i < 1; i++) {
        //     const document = documents[i];

        //     // const chunks = document?.content
        //     //     ?.split('\n\n')
        //     //     .filter((chunk) => chunk.trim() !== '');

        //     // console.log('Chunks:', chunks?.length);

        //     console.log('Document:', document.content?.length);

        //     // pineconeInput.push({
        //     //     _id: document._id,
        //     //     content: `${document.heading} - ${document.content}`,
        //     //     title: document.heading,
        //     //     // text: document.content,
        //     //     sourceId: document._id,
        //     // });

        //     // const pineconeResponse = await pineconeHelper.upsertDocuments([
        //     //     document,
        //     // ]);
        //     // console.log('Pinecone Response:', pineconeResponse);
        // }

        res.success(201, {
            success: true,
            //pineconeInput,
            // documents,
        });
    }
); // END

// admin demo upsert pinecone documents handler
export const adminDemoUpsertPineconeDocuments = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /admins/demo/upsert-pinecone-documents-for-demo'
        );

        const pineconeHelper = new PineconeHelper();

        // Get total count of documents to process
        const totalDocuments = await DemoDocumentModel.countDocuments({
            content: { $ne: '' },
            isChunked: { $ne: true },
        });

        consoleLog.log(`Total documents to process: ${totalDocuments}`);

        // Process documents in batches to avoid memory issues and connection timeouts
        const BATCH_SIZE = 50; // Process 50 documents at a time
        const totalBatches = Math.ceil(totalDocuments / BATCH_SIZE);

        let processedCount = 0;
        let successCount = 0;
        let errorCount = 0;
        const errors: Array<{ documentId: string; error: string }> = [];

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            consoleLog.log(
                `Processing batch ${batchIndex + 1}/${totalBatches}`
            );

            // Get documents for current batch
            const documents = await DemoDocumentModel.find({
                content: { $ne: '' },
                isChunked: { $ne: true },
            })
                .skip(batchIndex * BATCH_SIZE)
                .limit(BATCH_SIZE)
                .lean();

            if (documents.length === 0) {
                consoleLog.log('No more documents to process');
                break;
            }

            // Process each document in the current batch
            for (let i = 0; i < documents.length; i++) {
                const document = documents[i];
                processedCount++;

                try {
                    consoleLog.log(
                        `Processing document ${processedCount}/${totalDocuments}: ${document._id}`
                    );

                    const chunks = await textSplitter.createDocuments(
                        [document.content],
                        []
                    );

                    await pineconeHelper.upsertDocuments(
                        chunks.map((chunk) => ({
                            _id: document._id,
                            content: chunk.pageContent,
                            heading: document.heading,
                        }))
                    );

                    // Mark document as chunked
                    await DemoDocumentModel.findByIdAndUpdate(document._id, {
                        isChunked: true,
                    });

                    successCount++;
                    consoleLog.log(
                        `Successfully processed document: ${document._id}`
                    );
                } catch (error) {
                    errorCount++;
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : 'Unknown error';
                    errors.push({
                        documentId: document._id.toString(),
                        error: errorMessage,
                    });

                    consoleLog.log(
                        `Error processing document ${document._id}: ${errorMessage}`
                    );

                    // Continue processing other documents instead of throwing
                    // This ensures we don't stop the entire batch due to one failed document
                }

                // Add a small delay between documents to prevent overwhelming the system
                if (i % 10 === 0 && i > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            }

            // Add a delay between batches to prevent connection timeouts
            if (batchIndex < totalBatches - 1) {
                consoleLog.log(
                    `Batch ${
                        batchIndex + 1
                    } completed. Waiting before next batch...`
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        consoleLog.log(
            `Processing completed. Processed: ${processedCount}, Success: ${successCount}, Errors: ${errorCount}`
        );

        return res.success(200, {
            totalDocuments,
            processedCount,
            successCount,
            errorCount,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully processed ${successCount} out of ${totalDocuments} documents`,
        });
    }
); // END

// admin samdple ai search handler
export const adminSampleAISearch = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /admins/samples/documents/ai-search'
        );
        const { user } = res.locals;
        const { conversationId, query } = req.body;

        if (!user) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Invalid user ID',
            });
        }

        const conversationService = new ConversationService();

        const conversation = await conversationService.saveConversation(
            conversationId,
            user._id,
            { role: 'user', content: query }
        );

        // const searchedRecords = {
        //     result: {
        //         hits: [
        //             {
        //                 _id: 'c8102a7b7c1e69df6db18856966e59647614fc5c4b3b4a23b905cb9b4fb4b5ee',
        //                 _score: 0.3591366708278656,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - by manual and automated soldering. The units then proceed to the testing stations for functionality verification. Finished products are cleaned,',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //             {
        //                 _id: 'eb30a5f15331e7d06a6ad784c36b244879d1b05cb24255d21fd0e72fc6461a3f',
        //                 _score: 0.3363201320171356,
        //                 fields: {
        //                     content:
        //                         'Company Overview & Mission - With headquarters in Pune, India, and two manufacturing units in Nashik and Aurangabad, ElectraNova employs over 1,200 staff across R&D, production,',
        //                     sourceId: '68e8ad8d4e7af50e4c6d849d',
        //                     title: 'Company Overview & Mission',
        //                 },
        //             },
        //             {
        //                 _id: 'de38d8428b9e4f568428b6be488c433ea88ae9790f04bf8678d3a47d3454935d',
        //                 _score: 0.3337770998477936,
        //                 fields: {
        //                     content:
        //                         'Company Overview & Mission - is to “Simplify lives through smarter technology.” With headquarters in Pune, India, and two manufacturing units in Nashik and Aurangabad,',
        //                     sourceId: '68e8ad8d4e7af50e4c6d849d',
        //                     title: 'Company Overview & Mission',
        //                 },
        //             },
        //             {
        //                 _id: '8627fdf0cad6d0457d9d075cf17d7d8ac6f849ab5b0d046aa6ec6f3fbdc9a6e4',
        //                 _score: 0.3272063136100769,
        //                 fields: {
        //                     content:
        //                         'Company Overview & Mission - units in Nashik and Aurangabad, ElectraNova employs over 1,200 staff across R&D, production, testing, and logistics departments.',
        //                     sourceId: '68e8ad8d4e7af50e4c6d849d',
        //                     title: 'Company Overview & Mission',
        //                 },
        //             },
        //             {
        //                 _id: 'f53a1503be37bac813730c98186937ae8ccf28fba4be0995190cebdbde18a147',
        //                 _score: 0.2984780967235565,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - (SMT) lines handle PCB assembly, followed by manual and automated soldering. The units then proceed to the testing stations for functionality',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //             {
        //                 _id: 'a671a339ce8f4c5e5388ca33752d0182a1fa0ae2ab344cb36f1e7f7b1ee7a5ea',
        //                 _score: 0.2962990403175354,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - The manufacturing process follows a semi-automated assembly line model. Raw materials and electronic components are sourced from verified vendors',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //             {
        //                 _id: 'd594d507fd85149d50f080a58742e4ab4c707745646aa330db950cc3a099922d',
        //                 _score: 0.2842801511287689,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - then proceed to the testing stations for functionality verification. Finished products are cleaned, labeled, packaged, and moved to the warehouse for',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //             {
        //                 _id: '984d77ed134707859cd7b02cd12ffa6fd87b1831f9d135833c7920f3eaecba17',
        //                 _score: 0.28114110231399536,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - assembly line model. Raw materials and electronic components are sourced from verified vendors through the company’s supply chain portal. Each',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //             {
        //                 _id: '43e157ca83f3de964e3c797300c46f6ce19c71389cd46839c8604487bc948095',
        //                 _score: 0.2758786976337433,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - components are sourced from verified vendors through the company’s supply chain portal. Each component batch undergoes quality inspection before',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //             {
        //                 _id: '10e4cb13173815965910996ee1fff59e926217f7965fc37616e57f809ff05c73',
        //                 _score: 0.2643875777721405,
        //                 fields: {
        //                     content:
        //                         'Manufacturing Workflow - entering the production floor. Surface Mount Technology (SMT) lines handle PCB assembly, followed by manual and automated soldering. The units then',
        //                     sourceId: '68e8ad8d4e7af50e4c6d84a1',
        //                     title: 'Manufacturing Workflow',
        //                 },
        //             },
        //         ],
        //     },
        //     usage: {
        //         readUnits: 1,
        //         embedTotalTokens: 9,
        //     },
        // };

        const pineconeHelper = new PineconeHelper();
        const searchedRecords = await pineconeHelper.searchDocuments(query);

        const searchedSourceIds = searchedRecords.result.hits.map(
            (hit: any) => hit.fields.sourceId
        );

        const uniqueSearchedSourceIds = new Set(searchedSourceIds);

        console.log('Searched Source IDs:', [...uniqueSearchedSourceIds]);

        // const objectIds = [...uniqueSearchedSourceIds].map((id) =>
        //     toMongoId(id)
        // );

        const documents = await SampleDocumentModel.find({
            _id: { $in: [...uniqueSearchedSourceIds] },
        });

        // console.log('Documents:', documents.length);

        // todo: fetch user attributes from the database
        const userAttributes = ['region:US', 'tier:enterprise', 'role:sales'];

        const accessibleDocs = documents.filter((doc) =>
            isPolicySatisfied(doc.policy, userAttributes)
        );

        const accessibleDocsIds = accessibleDocs.map((doc) =>
            doc._id.toString()
        );
        // console.log('Accessible Docs:', accessibleDocsIds);

        const searchedRecordsBasedOnPolicy = searchedRecords.result.hits.filter(
            (hit: any) => accessibleDocsIds.includes(hit.fields.sourceId)
        );

        const kbDoc = searchedRecordsBasedOnPolicy
            .map((hit: any) => {
                return hit.fields.content;
            })
            .join('\n---\n');

        const aiService = new AIService();
        const aiResult = await aiService.generateQueryResponse(
            query,
            kbDoc,
            []
        );

        conversationService.saveConversation(
            conversation?._id as string,
            user._id,
            { role: 'assistant', content: aiResult }
        );
        return res.success(200, {
            // kbDoc,
            // aiResult,
            query,
            conversationId: conversation?._id,
            response: aiResult,
            searchedRecords: searchedRecordsBasedOnPolicy,
        });
    }
); // END
