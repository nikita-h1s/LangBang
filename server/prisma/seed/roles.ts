import {UserRole} from "../../generated/prisma/enums";

export type PermissionCode =
    | 'manage_course'
    | 'manage_lesson'
    | 'manage_exercise'
    | 'manage_achievement'
    | 'delete_user'
    | 'moderate_chat'
    | 'ban_user';

export const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
    admin: [
        'manage_course',
        'manage_lesson',
        'manage_exercise',
        'manage_achievement',
        'delete_user',
        'moderate_chat',
        'ban_user'
    ],
    content_manager: [
        'manage_course',
        'manage_lesson',
        'manage_exercise',
        'manage_achievement',
    ],
    moderator: [
        'moderate_chat',
        'ban_user'
    ],
    user: []
}