import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateSettings = async (parentId: number, settings: any) => {
  try {
    console.log("settings", settings);

    // Upsert the setting record
    await prisma.setting.upsert({
      where: { parentId: parentId },
      update: { ...settings },
      create: {
        parentId: parentId,
        ...settings,
      },
    });

    console.log('Settings updated or created successfully');
  } catch (error) {
    console.error('Error updating or creating settings:', error);
    throw new Error('Failed to update or create settings');
  } finally {
    await prisma.$disconnect();
  }
};

export const getSettingsByParentId = async (parentId: number) => {
  try {
    
    const parentSettings = await prisma.setting.findUnique({
      where: { parentId: parentId },
    });

    return parentSettings;

  } catch (error) {
    console.error('Error getting settings:', error);
    throw new Error('Failed to get settings');
  } finally {
    await prisma.$disconnect();
  }
};



