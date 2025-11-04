import { config } from './config';
import sampleDocuments from './sample-docs.json';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: config.pinecone.apiKey,
});

const getIndex = async () =>
    pc.index(config.pinecone.indexName).namespace('default');

async function main() {
    const indexRef = await getIndex();

    const updateResponse = await indexRef.update({
        id: 'doc63',
        metadata: {
            tags: ['updated', 'newtag'],
            sourceId: 'source112233',
            allow_any_of: ['role:legal', 'team:mna', 'tier:enterprise'],
            require_all_of: ['region:EU', 'training:completed'],
            exclude_any_of: ['employment:terminated', 'status:suspended'],
        },
    });
    console.log('Pinecone Update Response:', updateResponse);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
