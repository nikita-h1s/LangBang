import {z} from "zod";
import {lengthError} from "../../utils/errorMessages";


export const updateProfileSchema = z.object({
    username: z.string()
        .min(3, lengthError("username", "min", 3))
        .max(50, lengthError("username", "max", 50))
        .trim()
        .optional(),
    bio: z.string()
        .max(300, lengthError("bio", "max", 300))
        .optional(),
    avatarUrl: z.url().optional(),
    nativeLanguageId: z.number().positive().optional(),
})
.refine(data => {
    return Object.values(data).some(val => val !== undefined);
}, {
    message: "At least one field must be provided"
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;