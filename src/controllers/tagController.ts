import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler';
import { consoleLog } from '../utils/consoleLog';
import { Request, Response } from 'express';
import { TagMasterModel } from '../models/TagMaster';
import { ApiError } from '../utils/responseHandler';
import { DemoTagMasterModel } from '../models/DemoTagMaster';

/**
 * list all tags
 */
export const listAllTags = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /tag-master');
    const { user } = res.locals;

    const result = await DemoTagMasterModel.find({});
    res.success(StatusCodes.OK, result);
});
// end

/** insert all tags */
export const insertAllTags = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /tag-master');

        // const tags = [
        //     'Engineering',
        //     'Marketing',
        //     'Sales',
        //     'HR',
        //     'Finance',
        //     'Support',
        //     'Operations',
        //     'IT',
        //     'Legal',
        //     'R&D',
        //     'Admin',
        //     'Customer Service',
        //     'Product',
        //     'Design',
        //     'Content',
        //     'Strategy',
        //     'Business Development',
        //     'Quality Assurance',
        //     'Training',
        //     'Procurement',
        //     'Logistics',
        //     'Security',
        //     'Maintenance',
        //     'Public Relations',
        //     'Compliance',
        //     'Analytics',
        //     'Innovation',
        //     'Sustainability',
        //     'Diversity',
        //     'Inclusion',
        //     'Wellness',
        //     'Culture',
        //     'Remote',
        //     'Onsite',
        //     'Hybrid',
        //     'Internship',
        //     'Full-time',
        //     'Part-time',
        //     'Contract',
        //     'Freelance',
        //     'Temporary',
        //     'Volunteer',
        //     'Executive',
        //     'Manager',
        //     'Team Lead',
        //     'Staff',
        //     'Associate',
        //     'Specialist',
        //     'Coordinator',
        //     'Administrator',
        //     'Consultant',
        //     'Advisor',
        //     'Mentor',
        //     'Trainer',
        //     'Coach',
        //     'Ambassador',
        //     'Evangelist',
        //     'USA',
        //     'Canada',
        //     'UK',
        //     'Germany',
        //     'France',
        //     'Australia',
        //     'India',
        //     'China',
        //     'Japan',
        //     'Brazil',
        //     'Mexico',
        //     'South Africa',
        //     'Remote',
        //     'Onsite',
        //     'Hybrid',
        //     'North America',
        //     'Europe',
        //     'Asia',
        //     'South America',
        //     'Africa',
        //     'Oceania',
        //     'Middle East',
        //     'Central America',
        //     'Caribbean',
        //     'Scandinavia',
        //     'Benelux',
        //     'DACH',
        //     'APAC',
        //     'EMEA',
        //     'LATAM',
        //     'MEA',
        //     'GCC',
        //     'Nordics',
        //     'Baltics',
        //     'Iberia',
        //     'Italy',
        //     'Spain',
        //     'Portugal',
        //     'Netherlands',
        //     'Belgium',
        //     'Switzerland',
        //     'Austria',
        //     'Poland',
        //     'Czech Republic',
        //     'Hungary',
        //     'Romania',
        //     'Balkans',
        //     'Greece',
        //     'Turkey',
        //     'Russia',
        //     'Ukraine',
        //     'Vietnam',
        //     'Thailand',
        //     'Malaysia',
        //     'Singapore',
        //     'Indonesia',
        //     'Philippines',
        //     'South Korea',
        //     'New Zealand',
        // ];

        const tags = [
            { name: 'Role', key: 'role', value: 'legal' },
            { name: 'Role', key: 'role', value: 'hr' },
            { name: 'Role', key: 'role', value: 'sales' },
            { name: 'Tier', key: 'tier', value: 'free' },
            { name: 'Tier', key: 'tier', value: 'enterprise' },
            { name: 'Tier', key: 'tier', value: 'pro' },
            { name: 'Region', key: 'region', value: 'US' },
            { name: 'Region', key: 'region', value: 'EU' },
            { name: 'Region', key: 'region', value: 'IN' },
            { name: 'Employment', key: 'employment', value: 'full-time' },
            { name: 'Employment', key: 'employment', value: 'part-time' },
            { name: 'Employment', key: 'employment', value: 'contract' },
            { name: 'Employment', key: 'employment', value: 'terminated' },
        ];

        let result = [];
        try {
            for (let index = 0; index < tags.length; index++) {
                const tag = tags[index];

                const tagResult = await TagMasterModel.findOneAndUpdate(
                    { name: tag.name, key: tag.key, value: tag.value },
                    { name: tag.name, key: tag.key, value: tag.value },
                    { upsert: true, new: true }
                );
                result.push(tagResult);
            }
        } catch (error) {
            consoleLog.error('Error inserting tags:', error);
            throw new ApiError({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                description: 'Error inserting tags',
            });
        }

        res.success(StatusCodes.OK, result);
    }
);
//end
