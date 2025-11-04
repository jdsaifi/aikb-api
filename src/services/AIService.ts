import { AxiosError } from 'axios';
import OpenAI from 'openai';
import { ICall, IConversationHistory, IDocument } from '../types';
import { config } from '../config';
import { consoleLog } from '../utils/consoleLog';

export class AIService {
    private readonly OPENROUTER_API_KEY: string;
    private readonly OPENROUTER_API_URL: string =
        'https://openrouter.ai/api/v1';

    constructor() {
        this.OPENROUTER_API_KEY = config.OPENROUTER_API_KEY || '';
        if (!this.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY is not configured');
        }
    }

    async generateCallQuestions(call: ICall): Promise<string[]> {
        const prompt = this.buildCallPrompt(call);
        // return [];
        // consoleLog.log('\n\n\n\n\nPrompt:\n', prompt);
        try {
            const openai = new OpenAI({
                baseURL: this.OPENROUTER_API_URL,
                apiKey: this.OPENROUTER_API_KEY,
            });

            const response: any = await openai.chat.completions.create({
                model: 'google/gemini-flash-1.5',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            if ('error' in response) {
                throw new Error(response?.error?.message || 'Unknown error');
            }

            const jsonResponse = JSON.parse(
                response.choices[0].message.content
            );

            return jsonResponse['callQuestions'];
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(
                    'Error generating questions:',
                    error.response?.data
                );
                throw new Error('Failed to generate interview questions');
            } else {
                console.error('Error generating questions:', error);
                throw new Error('Failed to generate interview questions');
            }
        }
    }

    private buildCallPrompt(call: ICall): string {
        let documents = '';
        if (call?.documents && call?.documents?.length > 0) {
            documents = call.documents
                .map((doc: IDocument) => doc?.content || null)
                .filter(Boolean)
                .join(', ');
        }
        return `Generate 15 relevant call questions based on the following call details:
        Call Title: ${call.name}
        Call Description: ${call.description || 'Not provided'}
        Negative Questions: ${call.negativeQuestions || ''}
        Positive Questions: ${call.positiveQuestions || ''}

        documents to help you generate questions: ${documents}

        Please generate 15 high-quality, relevant questions that would help assess a user's performance during a call. 
        
        Format each question as a comma separated list of strings.

        Return the response as under the key "callQuestions".`;
    }

    // private parseAIResponse(response: string): string[] {
    //     const jsonResponse = {
    //         interviewQuestions: [
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 1,
    //                 question:
    //                     "Explain the differences between React's functional and class components.  What are the advantages and disadvantages of each approach?",
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 2,
    //                 question:
    //                     'Describe your experience using state management libraries in React, such as Redux, Context API, or Zustand.  Which one have you preferred and why?',
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 3,
    //                 question:
    //                     'How do you handle asynchronous operations and data fetching in React applications? Provide examples using `fetch` or `axios`.',
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 4,
    //                 question:
    //                     "Explain your understanding of React's virtual DOM and how it contributes to performance optimization.",
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 5,
    //                 question:
    //                     "Describe how you would implement routing in a React application using a library like React Router.  Give an example of how you'd handle nested routes.",
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 6,
    //                 question:
    //                     'How familiar are you with testing in React? Describe your experience with unit testing, integration testing, or end-to-end testing frameworks such as Jest, React Testing Library, or Cypress.',
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 7,
    //                 question:
    //                     'What is your experience with Node.js and Express.js?  Describe a project where you used them and the challenges you faced.',
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 8,
    //                 question:
    //                     'Explain the concept of RESTful APIs and how you would interact with them from a React frontend.',
    //             },
    //             {
    //                 questionType: 'Technical',
    //                 questionNumber: 9,
    //                 question:
    //                     'Describe your experience with different front-end build tools, such as Webpack or Parcel. What are the pros and cons of each?',
    //             },
    //             {
    //                 questionType: 'Behavioral',
    //                 questionNumber: 10,
    //                 question:
    //                     'Describe a challenging problem you faced during a previous project and how you overcame it.  Focus on your problem-solving abilities.',
    //             },
    //             {
    //                 questionType: 'Behavioral',
    //                 questionNumber: 11,
    //                 question:
    //                     'Tell me about a time you had to work within a tight deadline. How did you prioritize your tasks and manage the pressure?',
    //             },
    //             {
    //                 questionType: 'Behavioral',
    //                 questionNumber: 12,
    //                 question:
    //                     'Describe a time you had to collaborate with a team to solve a complex problem.  What role did you play, and how did the team dynamics contribute to success?',
    //             },
    //             {
    //                 questionType: 'Behavioral',
    //                 questionNumber: 13,
    //                 question:
    //                     'Describe your approach to learning new technologies and staying up-to-date with the latest trends in frontend development.',
    //             },
    //             {
    //                 questionType: 'System Design',
    //                 questionNumber: 14,
    //                 question:
    //                     'Design a simple e-commerce product page.  Consider the components you would need, the data flow, and any potential performance optimizations.',
    //             },
    //             {
    //                 questionType: 'Coding',
    //                 questionNumber: 15,
    //                 question:
    //                     'Write a React component that takes an array of objects as input and displays them in a table.  Handle the case where the array is empty.',
    //             },
    //         ],
    //     };
    //     console.log('jsonResponse: ', jsonResponse);
    //     return [];
    //     // // Split the response into lines and filter out empty lines
    //     // const lines = response.split('\n').filter((line) => line.trim());

    //     // // Extract questions from numbered list format
    //     // const questions = lines.map((line) => {
    //     //     // Remove numbering and clean up the question
    //     //     return line.replace(/^\d+\.\s*/, '').trim();
    //     // });

    //     // return questions.slice(0, 15); // Ensure we only return 15 questions
    // }

    async generateCallFeedback(transcript: string): Promise<string> {
        const prompt = this.buildFeedbackPrompt(transcript);

        try {
            const openai = new OpenAI({
                baseURL: this.OPENROUTER_API_URL,
                apiKey: this.OPENROUTER_API_KEY,
            });

            const response: any = await openai.chat.completions.create({
                model: 'google/gemini-flash-1.5',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            if ('error' in response) {
                throw new Error(response?.error?.message || 'Unknown error');
            }

            consoleLog.log(
                'response.choices[0].message.content: ',
                response.choices[0].message.content
            );

            const jsonResponse = JSON.parse(
                response.choices[0].message.content
            );

            return jsonResponse['feedback'];
        } catch (error) {
            console.error('Error generating interview feedback:', error);
            throw new Error('Failed to generate interview feedback');
        }
    }

    private buildFeedbackPrompt(transcript: string): string {
        return `Generate a feedback for the following call transcript:
        ${transcript}

        Format the feedback as a JSON object with the following structure:
        {
            "feedback": string
        }

        Ensure that:
        1. The feedback is relevant to the interview transcript
        2. The feedback is concise and to the point
        3. The feedback is helpful for the candidate to improve their skills
        4. The response is valid JSON format`;
    }

    async generateQueryResponse(
        query: string,
        kb: string,
        history?: IConversationHistory[]
    ): Promise<string> {
        const prompt = this.buildQueryPrompt(query, kb, history);

        try {
            const openai = new OpenAI({
                baseURL: this.OPENROUTER_API_URL,
                apiKey: this.OPENROUTER_API_KEY,
            });

            const response: any = await openai.chat.completions.create({
                model: 'alibaba/tongyi-deepresearch-30b-a3b:free',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            if ('error' in response) {
                throw new Error(response?.error?.message || 'Unknown error');
            }

            consoleLog.log(
                'response.choices[0].message.content: ',
                response.choices[0].message.content
            );

            const jsonResponse = JSON.parse(
                response.choices[0].message.content
            );

            return jsonResponse['response'];
        } catch (error) {
            console.error('Error generating AI response:', error);
            throw new Error('Failed to generate AI response');
        }
    }
    private buildQueryPrompt(
        query: string,
        kb: string,
        history?: IConversationHistory[]
    ): string {
        let historyPrompt = '';
        if (history && history.length > 0) {
            historyPrompt = `The user has the following conversation history:
            ${history.map((h) => `${h.role}: ${h.content}`).join('\n')}
            `;
        }
        return `You are an AI assistant that helps users find information in a knowledge base. 

        The knowledge base contains the following information:
        ${kb}

        A user has asked the following question:
        ${query}

        ${historyPrompt}

        Format the response as a JSON object with the following structure:
        {
            "response": string
        }

        Please provide a concise and relevant answer based on the knowledge base.`;
    }
}
