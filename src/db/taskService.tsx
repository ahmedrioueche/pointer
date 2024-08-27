import { Task } from '@/lib/interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addTask = async (task: Task): Promise<number> => {
  console.log("task in addTasks", task);

  try {
        const taskData: any = {
            name: task.name,
            creatorId: typeof task.creatorId === "string" ? parseInt(task.creatorId, 10) : task.creatorId || undefined,
            creatorName: task.creatorName || undefined,
            creationDate: task.creationDate ? new Date(task.creationDate) : undefined,
            description: task.description || undefined,
            points: typeof task.points === "string" ? parseInt(task.points, 10) : task.points || undefined,
        };
  
          // Create new task
          const createdTask = await prisma.task.create({ data: taskData });
          
          return createdTask.id;
          
  } catch (error) {
      console.error('Error adding tasks:', error);
      throw new Error('Failed to add tasks');
  } finally {
      await prisma.$disconnect();
  }
};


export const assignTask = async (task: Task, childId : number): Promise<number> => {
  console.log("task in assignTask", task);

  try {
    const taskData: any = {
      name: task.name,
      creatorId: typeof task.creatorId === "string" ? parseInt(task.creatorId, 10) : task.creatorId || undefined,
      creatorName: task.creatorName || undefined,
      creationDate: task.creationDate ? new Date(task.creationDate) : undefined,
      description: task.description || undefined,
      points: typeof task.points === "string" ? parseInt(task.points, 10) : task.points || undefined,
    };

    // Create new task
    const createdTask = await prisma.task.create({ data: taskData });
    
    const taskAssignmentData: any = {
      taskId : createdTask.id,
      childId : childId,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      assignedBy : task.assignedBy || undefined,
      assignedByName : task.assginedByName || undefined,
    };

    const createdAssignment = await prisma.taskAssignment.create({ data: taskAssignmentData });
      
    return createdTask.id;
          
  } catch (error) {
      console.error('Error adding tasks:', error);
      throw new Error('Failed to add tasks');
  } finally {
      await prisma.$disconnect();
  }
}


export const unAssignTask = async (taskId: number, childId : number): Promise<void> => {
  try {

    await prisma.taskAssignment.deleteMany({
      where: {
        taskId: taskId,
        childId: childId,
      },
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  } finally {
    await prisma.$disconnect();
  }
};


export const updateTaskById = async (taskId: number, updates: Partial<any>): Promise<void> => {
  try {
    // Extract and validate the properties from updates
    const { 
      name, 
      description, 
      points, 
      creatorId, 
      creatorName, 
      creationDate, 
      taskAssignments 
    } = updates;

    const validUpdates: {
      name?: string;
      description?: string;
      points?: number;
      creatorId?: number;
      creatorName?: string;
      creationDate?: Date;
    } = {
      name,
      description,
      points: typeof points === "string" ? parseInt(points, 10) : points,
      creatorId: typeof creatorId === "string" ? parseInt(creatorId, 10) : creatorId,
      creatorName,
      creationDate: creationDate instanceof Date ? creationDate : undefined
    };

    console.log("taskId in updateTaskById", taskId);
    
    // Update the Task record
    await prisma.task.update({
      where: { id: taskId }, 
      data: validUpdates,
    });

    // Handle updates for TaskAssignments if provided
    if (taskAssignments && Array.isArray(taskAssignments)) {
      for (const taskAssignment of taskAssignments) {
        const {
          id, 
          childId, 
          assignedBy, 
          assignedByName, 
          assignmentDate, 
          dueDate, 
          isCompleted, 
          isApproved, 
          completionDate, 
          approvalDate, 
          approvedBy, 
          approvedByName, 
          creatorComment, 
          creatorCommentDate, 
          createdForComment, 
          attachedFiles
        } = taskAssignment;

        await prisma.taskAssignment.update({
          where: { id },
          data: {
            childId: typeof childId === "string" ? parseInt(childId, 10) : childId,
            assignedBy: typeof assignedBy === "string" ? parseInt(assignedBy, 10) : assignedBy,
            assignedByName,
            assignmentDate: assignmentDate instanceof Date ? assignmentDate : undefined,
            dueDate: dueDate instanceof Date ? dueDate : undefined,
            isCompleted,
            isApproved,
            completionDate: completionDate instanceof Date ? completionDate : undefined,
            approvalDate: approvalDate instanceof Date ? approvalDate : undefined,
            approvedBy: typeof approvedBy === "string" ? parseInt(approvedBy, 10) : approvedBy,
            approvedByName,
            creatorComment,
            creatorCommentDate: creatorCommentDate instanceof Date ? creatorCommentDate : undefined,
            createdForComment,
            attachedFiles
          }
        });
      }
    }

  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  } finally {
    await prisma.$disconnect();
  }
};


export const updateTaskAssignmentById = async (taskId: number, updates: Partial<any>): Promise<void> => {
  try {
    // Handle possible data type conversions
    let {
      dueDate,
      assignmentDate,
      completionDate,
      approvalDate,
      isCompleted,
      isApproved,
      approvedBy,
      approvedByName,
      assignedBy,
      assignedByName,
      createdForComment,
      creatorComment,
      creatorCommentDate,
      attachedFiles
    } = updates;

    // Convert date strings to Date objects
    dueDate = dueDate ? new Date(dueDate) : undefined;
    assignmentDate = assignmentDate ? new Date(assignmentDate) : undefined;
    completionDate = completionDate ? new Date(completionDate) : undefined;
    approvalDate = approvalDate ? new Date(approvalDate) : undefined;

    // Convert IDs from strings to numbers if necessary
    approvedBy = typeof approvedBy === "string" ? parseInt(approvedBy, 10) : approvedBy;
    assignedBy = typeof assignedBy === "string" ? parseInt(assignedBy, 10) : assignedBy;

    // Update the TaskAssignment record
    await prisma.taskAssignment.update({
      where: { taskId: taskId }, // Assuming taskId is unique and correctly represents a task assignment
      data: {
        dueDate,
        assignmentDate,
        completionDate,
        approvalDate,
        isCompleted,
        isApproved,
        approvedBy,
        approvedByName,
        assignedBy,
        assignedByName,
        createdForComment,
        creatorComment,
        creatorCommentDate,
        attachedFiles
      }
    });

  } catch (error) {
    console.error('Error updating task assignment:', error);
    throw new Error('Failed to update task assignment');
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTaskById = async (taskId: number): Promise<void> => {
  try {
    // Find the task to ensure it exists
    const taskToDelete = await prisma.task.findUnique({
      where: { id: taskId },
      include: { taskAssignments: true }, 
    });

    if (!taskToDelete) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }

    // Delete related task assignments
    await prisma.taskAssignment.deleteMany({
      where: { taskId: taskId },
    });

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  } finally {
    await prisma.$disconnect();
  }
};


export const getTasksByChildId = async (childId: number): Promise<any> => {
    try {

      console.log("childId in getTasksByChildId", childId)
        // Query TaskAssignment to get tasks for the given childId
        const tasks = await prisma.taskAssignment.findMany({
            where: { childId: childId },
            include: { task: true }, 
        });

        return tasks;
    } catch (error) {
        console.error('Error fetching tasks by childId:', error);
        throw new Error('Failed to fetch tasks by childId');
    } finally {
        await prisma.$disconnect();
    }
};

export const getTasksByParentId = async (parentId: number): Promise<any> => {
  try {

    const tasks = await prisma.task.findMany({
        where: { creatorId: parentId },
        include : {taskAssignments : true}
    });

    return tasks;

  } catch (error) {
      console.error('Error fetching tasks by parentId:', error);
      throw new Error('Failed to fetch tasks by parentId');
  } finally {
      await prisma.$disconnect();
}
}


export const getPendingTasks = async () => {
  try {
    
    const tasks = await prisma.taskAssignment.findMany({
      include: {
        task: true,  
      }
    });

    return tasks;

  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  } finally {
    await prisma.$disconnect();
  }
}