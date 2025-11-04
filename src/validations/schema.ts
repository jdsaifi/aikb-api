import { z } from 'zod';

export const moduleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    displayName: z.string().min(1, 'Display name is required'),
    availablePermissions: z
        .array(z.string())
        .min(1, 'At least one permission is required'),
    isActive: z.boolean().optional(),
});

export const addModuleSchema = z.object({
    body: moduleSchema,
});

export const userGroupSchema = z.object({
    company: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid company ID'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    permissions: z.array(
        z.object({
            module: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid module ID'),
            actions: z
                .array(z.string())
                .min(1, 'At least one action is required'),
        })
    ),
    isActive: z.boolean().optional(),
});

/** * Admin add company validation */
export const addCompanySchema = z.object({
    body: z.object({
        companyName: z
            .string({
                message: 'Company name is required',
            })
            .min(1, 'Company name is required'),
        email: z.string().email('Invalid email format'),
        userFullName: z.string().min(1, 'User full name is required'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long'),
    }),
}); // END

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});
export const loginSchemaWithBody = z.object({
    body: loginSchema,
});

export const loginWithGoogleSchema = z.object({
    body: z.object({
        email: z.string().min(1, 'Email is required'),
        name: z.string().min(1, 'Name is required'),
        authProvider: z.enum(['google', 'credentials']).default('credentials'),
        googleId: z.string().optional(),
        emailVerified: z.boolean().default(false),
    }),
});

/**
 * Project schema for validating project creation and updates
 */
export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    company: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid company ID'),
    isActive: z.boolean().optional(),
    createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    members: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'))
        .optional(),
});

export const createProjectSchema = z.object({
    body: projectSchema.omit({ company: true, createdBy: true, members: true }),
});

export const listUsersInProjectSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});

export const deleteUserProjectSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});

export const updateUserProjectSchema = z.object({
    body: projectSchema.omit({ company: true, createdBy: true }),
});

export const assignProjectToUserSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
    body: z.object({
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});

export const unassignProjectFromUserSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});

export const assignCallsToProjectSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
    body: z.object({
        callIds: z.array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID')
        ),
    }),
});

export const unassignCallsFromProjectSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
    }),
});

// END

/**
 * Document schema for validating document creation and updates
 */

/*

export interface IDocument extends Document {
    heading: string;
    subHeading: string;
    description: string;
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
    size: number;
    content?: string;
    parsed_at?: Date;
    metadata: any | null;
    createdBy: Types.ObjectId | IUser;
    isPublic: boolean;
    isActive: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

*/

export const documentSchema = z.object({
    heading: z.string().min(1, 'Heading is required'),
    subHeading: z.string().optional(),
    description: z.string().optional(),
    filename: z.string().min(1, 'Filename is required'),
    originalname: z.string().min(1, 'Original name is required'),
    path: z.string().min(1, 'Path is required'),
    mimetype: z.string().min(1, 'Mimetype is required'),
    size: z.number().min(1, 'Size is required'),
    content: z.string().optional(),
    parsed_at: z.date().optional(),
    metadata: z.any().optional(),
    createdBy: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
        .optional(),
    isPublic: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
    deletedAt: z.date().optional(),
    deletedBy: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
        .optional(),
    createdAt: z.date().optional().default(new Date()),
    updatedAt: z.date().optional().default(new Date()),
});

export const addDocumentSchema = z.object({
    body: documentSchema.omit({
        filename: true,
        originalname: true,
        path: true,
        mimetype: true,
        size: true,
        content: true,
        parsed_at: true,
        createdBy: true,
        isActive: true,
        deletedAt: true,
        deletedBy: true,
        createdAt: true,
        updatedAt: true,
    }),
});

export const updateDocumentSchema = z.object({
    body: z.object({
        heading: z.string().min(1, 'Heading is required'),
        description: z.string().optional(),
        policy: z.object({
            allow_any_of_string: z.array(z.string()).optional(),
        }),
    }),
});
// END

/**
 * Calls schema for validating project creation and updates
 */

export const callDocumentsSchema = z.object({
    filename: z.string().min(1, 'Call name is required'),
    originalname: z.string().min(1, 'Call name is required'),
    path: z.string().min(1, 'Call name is required'),
    mimetype: z.string().min(1, 'Call name is required'),
    size: z.number().min(1, 'Call name is required'),
    content: z.string().optional(),
    parsed_at: z.date().optional(),
});

export const callSchema = z.object({
    name: z.string().min(1, 'Call name is required'),
    description: z.string().optional(),
    company: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid company ID'),
    project: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    questions: z.array(z.string()).optional(),
    negativeQuestions: z.string().optional(),
    positiveQuestions: z.string().optional(),
    AIPersona: z.string().optional(),
    documents: callDocumentsSchema.array().optional(),
    metadata: z
        .object({
            key: z.string(),
            value: z.string(),
        })
        .optional(),
    isActive: z.boolean().optional(),
    createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

export const callListSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
});

export const createCallSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    }),
    body: callSchema
        .omit({
            company: true,
            createdBy: true,
            project: true,
            documents: true,
            questions: true,
            isActive: true,
        })
        .extend({
            isActive: z.string().optional(),
        }),
});

export const getCallByIdSchema = z.object({
    params: z.object({
        // projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
    }),
});

export const updateCallSchema = z.object({
    params: z.object({
        // projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
    }),
    body: callSchema
        .omit({
            company: true,
            createdBy: true,
            project: true,
            documents: true,
            questions: true,
            isActive: true,
        })
        .extend({
            isActive: z.string().optional(),
        }),
});

export const deleteCallSchema = z.object({
    params: z.object({
        // projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
    }),
});

// END

/**
 * Feedback schema for validating project creation and updates
 */

export const feedbackTransacriptSchema = z.object({
    role: z.string(),
    text: z.string(),
});

export const feedbackSchema = z.object({
    company: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid company ID'),
    project: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    call: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
    transcript: z.array(feedbackTransacriptSchema).optional(),
    feedback: z.string().optional(),
    feedbackDate: z.date().optional(),
    audio: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const createFeedbackSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
    }),
});

export const updateFeedbackTranscript = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
        callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid call ID'),
        feedbackId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid feedback ID'),
    }),
    body: z.object({
        transcript: z.string(),
    }),
});
// END

/**
 * User Group schema for validating creation and updates
 */
export const createUserGroupSchema = z.object({
    body: userGroupSchema.omit({ company: true }),
});

export const getUserGroupByIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user group ID'),
    }),
});

export const updateUserGroupSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user group ID'),
    }),
    body: userGroupSchema.omit({ company: true }),
});

export const deleteUserGroupSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user group ID'),
    }),
});

// END

/** tag master schema */
export const tagMasterSchema = z.object({
    name: z.string().min(1, 'Tag name is required'),
    description: z.string().optional(),
    isActive: z.boolean().optional().default(true),
});
// END

/** user schema for validating creation and updates */
export const userSchema = z.object({
    name: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'admin']),
    company: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid company ID'),
    userGroup: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user group ID'),
    tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid tag ID')),
    isActive: z.boolean().optional(),
});

export const addUserSchema = z.object({
    body: userSchema.omit({ company: true, role: true }).extend({
        isActive: z.string().optional(),
    }),
});

export const getUserByIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
    body: userSchema
        .omit({
            company: true,
            userGroup: true,
            role: true,
            // email: true,
            password: true,
            tags: true,
        })
        .extend({
            isActive: z.string().optional(),
            tags: z.array(z.string()).optional(),
            password: z
                .string()
                .optional()
                .refine(
                    (val) => val === undefined || val.length >= 6,
                    'Password must be at least 6 characters long'
                ),
        }),
});

export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});

// END

export type ModuleInput = z.infer<typeof moduleSchema>;
export type UserGroupInput = z.infer<typeof userGroupSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type AddCompanyInput = z.infer<typeof addCompanySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CallInput = z.infer<typeof callSchema>;
export type CallByIdInput = z.infer<typeof getCallByIdSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
