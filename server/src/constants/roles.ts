import type { PermissionCode } from '../types/permissions';
import {UserRole} from "../../generated/prisma/enums";

export const ROLE_PERMISSIONS: Record<UserRole, readonly PermissionCode[]> = {
    admin: [
        'manage_course',
        'manage_lesson',
        'manage_exercise',
        'manage_achievement',
        'delete_user',
        'moderate_chat',
        'ban_user',
    ],
    content_manager: [
        'manage_course',
        'manage_lesson',
        'manage_exercise',
        'manage_achievement',
    ],
    moderator: [
        'moderate_chat',
        'ban_user',
    ],
    user: [],
};