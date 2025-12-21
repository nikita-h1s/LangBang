import type { PermissionCode } from '../types/permissions';
import {UserRole} from "../../generated/prisma/enums";

export const ROLE_PERMISSIONS: Record<UserRole, readonly PermissionCode[]> = {
    admin: [
        'manage_course',
        'manage_lesson',
        'manage_exercise',
        'manage_achievement',
        'manage_language',
        'manage_user',
        'delete_user',
        'moderate_chat',
        'ban_user',
    ],
    contentManager: [
        'manage_course',
        'manage_lesson',
        'manage_exercise',
        'manage_achievement',
        'manage_language',
    ],
    moderator: [
        'moderate_chat',
        'ban_user',
    ],
    user: [],
};