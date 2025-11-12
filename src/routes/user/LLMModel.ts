import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import { listLLMModels } from '../../controllers/user/LLMModelController';

const router = Router();

// list LLM Models
router.get('/v1/llm-models', listLLMModels); // END

export default router;
