import {PERMISSIONS_DATA} from "./permissionsData";
import {ROLE_PERMISSIONS} from "../../src/constants/roles";
import {prisma} from "../../src/lib/prisma";
import {UserRole} from "../../generated/prisma/enums";
import {hashPassword} from "../../src/utils/password";
import {ACHIEVEMENTS_DATA} from "./achievementsData";

async function seedRoles() {
    await prisma.permission.createMany({
        data: PERMISSIONS_DATA,
        skipDuplicates: true
    })

    const dbPermissions = await prisma.permission.findMany();
    const permissionMap = new Map(dbPermissions.map(p => [p.code, p.id]));

    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
        for (const permission of permissions) {
            await prisma.rolePermission.upsert({
                where: {
                    role_permissionId: {
                        role: role as UserRole,
                        permissionId: permissionMap.get(permission)
                    }
                },
                update: {},
                create: {
                    role: role as UserRole,
                    permissionId: permissionMap.get(permission)
                }
            })
        }
    }
}

async function seedAdmin() {
    await prisma.user.upsert({
        where: {email: "admin@langbang.com"},
        update: {},
        create: {
            username: "admin",
            email: "admin@langbang.com",
            passwordHash: await hashPassword('admin123'),
            role: "admin"
        }
    })
}

async function seedAchievements() {
    await prisma.achievement.createMany({
        data: ACHIEVEMENTS_DATA,
        skipDuplicates: true
    })
}

async function main() {
    await seedRoles();
    await seedAdmin();
    await seedAchievements();
}

main()
    .then(async () => {
        console.log('Seeding done.');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })

