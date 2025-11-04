import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../config';
import { generateUniqueID } from '../utils/helpers';

export default class PineconeHelper {
    private pc: Pinecone;
    constructor() {
        const pc = new Pinecone({
            apiKey: config.pinecone.apiKey,
        });
        this.pc = pc;
    }

    async createIndex() {
        await this.pc.createIndexForModel({
            name: config.pinecone.indexName,
            cloud: 'aws',
            region: 'us-east-1',
            embed: {
                model: 'llama-text-embed-v2',
                fieldMap: { text: 'content' },
            },
            waitUntilReady: true,
        });
    }

    async listIndexes() {
        return this.pc.listIndexes();
    }

    async getIndex() {
        return this.pc.index(config.pinecone.indexName).namespace('default');
    }

    async upsertDocuments(documents: any[]) {
        const pineconeInput: any = [];
        for (let i = 0; i < documents.length; i++) {
            const document = documents[i];
            pineconeInput.push({
                content: `${document.heading} - ${document.content || ''}`,
                title: document.heading,
                sourceId: document._id,
                _id: generateUniqueID(
                    `${document._id} - ${document.content || +new Date()}`
                ),
            });
        }

        // console.log('\n\n');
        // return console.log('Pinecone Input:', pineconeInput);

        const indexes = await this.listIndexes();
        if (!indexes.indexes || indexes.indexes.length === 0) {
            await this.createIndex();
        } else if (indexes.indexes) {
            const indexNames = indexes.indexes.map((index) => index.name);
            if (!indexNames.includes(config.pinecone.indexName)) {
                await this.createIndex();
            }
        }

        const indexRef = await this.getIndex();
        return indexRef.upsertRecords(pineconeInput);
    }

    async searchDocuments(query: string) {
        const indexRef = await this.getIndex();
        return indexRef.searchRecords({
            query: {
                topK: 10,
                inputs: { text: query },
            },
        });
    }
}
