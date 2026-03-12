import { prisma } from "../src/db.js";
import {inngest} from "../inngest/index.js"

// Create Task
export const createTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      projectId,
      title,
      description,
      type,
      status,
      priority,
      assigneeId,
      due_date,
    } = req.body;
    const origin = req.get("origin");

    // Check if user has admin role for project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } else if (project.team_lead !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    } else if (
      assigneeId &&
      !project.members.find((member) => member.user.id === assigneeId)
    ) {
      return res.status(403).json({ message: "Assignee must be a member of the project" });
    }
    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        priority,
        assigneeId,
        status,
        type,
        due_date: due_date ? new Date(due_date) : null,
      },
    });

    const taskWithAssignee = await prisma.task.findUnique({
      where: { id: task.id },
      include: { assignee: true },
    });
    
    if (assigneeId) {
      await inngest.send({
        name: "app/task.assigned",
        data:{
          taskId: task.id, origin
        }
      });
    }

    res.json({ task: taskWithAssignee, message: "Task created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Task

export const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { userId } = await req.auth();

    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      include: { members: { include: { user: true } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isTeamLead = project.team_lead === userId;
    const isProjectMember = project.members.some((m) => m.user.id === userId);

    if (!isTeamLead && !isProjectMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, description, status, type, priority, assigneeId, due_date } = req.body;

    // Non-lead members can only update status
    if (!isTeamLead) {
      const nonStatusFields = [title, description, type, priority, assigneeId, due_date].filter(
        (f) => f !== undefined
      );
      if (nonStatusFields.length > 0) {
        return res.status(403).json({ message: "Only the team lead can update fields other than status" });
      }
    }
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(type !== undefined && { type }),
        ...(priority !== undefined && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(due_date !== undefined && { due_date: due_date ? new Date(due_date) : null }),
      },
    });

    res.json({ task: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Delete Task
export const deleteTask = async (req, res) => {
  try {

    const { userId } = await req.auth();
    const {tasksIds} = req.body;

    const tasks = await prisma.task.findMany({
      where: { id: { in: tasksIds } },
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await prisma.project.findUnique({
      where: { id: tasks[0].projectId },
      include: { members: { include: { user: true } } }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } else if (project.team_lead !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.task.deleteMany({
      where: { id: { in: tasksIds } },
    });

    res.json({message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



