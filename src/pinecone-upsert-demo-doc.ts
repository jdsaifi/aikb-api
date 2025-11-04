import { config } from './config';
import sampleDocuments from './sample-docs.json';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: config.pinecone.apiKey,
});

const createIndex = async () => {
    await pc.createIndexForModel({
        name: config.pinecone.indexName,
        cloud: 'aws',
        region: 'us-east-1',
        embed: {
            model: 'llama-text-embed-v2',
            fieldMap: { text: 'content' },
        },
        waitUntilReady: true,
    });
};

const getIndex = async () =>
    pc.index(config.pinecone.indexName).namespace('default');

const upsertDocuments = async () => {
    const pineconeInput: any = [];
    console.log('Sample Documents:', sampleDocuments.length);
    for (let i = 0; i < sampleDocuments.length; i++) {
        const doc = sampleDocuments[i];
        pineconeInput.push({
            _id: doc.id,
            content: `${doc.title} - ${doc.content}`,
            title: doc.title,
            text: doc.content,
            sourceId: 'todo',
            // tags: doc.tags || [],
            // userGroups: doc.userGroups || [],
        });
    }

    const indexRef = await getIndex();

    if (pineconeInput.length > 0) {
        const upsertResponse = await indexRef.upsertRecords(pineconeInput);
        console.log('Pinecone Upsert Response:', upsertResponse);
    }

    // console.log('Pinecone Input:', pineconeInput?.length);
};

async function main() {
    // await createIndex();
    console.log('Pinecone index created');
    await upsertDocuments();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
