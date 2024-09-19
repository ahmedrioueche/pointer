import { PrismaClient } from '@prisma/client';
import { Quiz } from '@/types/interface';

const prisma = new PrismaClient();

export const insertQuizzes = async (quizzes: Quiz[]) => {
  try {
    if(quizzes && quizzes.length > 0){
      quizzes.forEach(async (quiz : Quiz) => {
        const res = await prisma.quiz.create({
            data : {
                topic: quiz.topic? quiz.topic : '',
                question: quiz.question? quiz.question : '',
                options: quiz.options ? quiz.options : '',
                correctAnswer: quiz.correctAnswer,
                childId: quiz.childId,
                parentId: quiz.parentId,
                points: quiz.points,
            }
        })
     })
   }
   return 'ok';
  } catch (error) {
    console.error('Error inserting quizzes in service:', error);
    throw new Error('Failed to insert quizzes in service');
  } finally {
    await prisma.$disconnect();
  }
};

export const updateQuiz = async (quiz: Partial<Quiz>) => {
  try {
    const response = await prisma.quiz.update({
      where: {
        id : quiz.id,
      },
      data: quiz,
    })
   
    return response;
  } catch (error) {
    console.error('Error inserting quizzes in service:', error);
    throw new Error('Failed to insert quizzes in service');
  } finally {
    await prisma.$disconnect();
  }
};



export const getQuizzesByChildId = async (id: number) => {
  try {
    const response = await prisma.quiz.findMany({
      where: {
        childId : id,
      },
    })
   
    return response;
  } catch (error) {
    console.error('Error getting quizzes:', error);
    throw new Error('Failed to get quizzes by child Id');
  } finally {
    await prisma.$disconnect();
  }
};
