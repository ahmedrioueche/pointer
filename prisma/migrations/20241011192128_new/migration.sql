-- CreateTable
CREATE TABLE "Parent" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN,
    "is_free_trial" BOOLEAN,
    "age" INTEGER,
    "gender" TEXT,
    "children_count" INTEGER,
    "subscription_type" TEXT,
    "subscription_start_date" TIMESTAMP(3),
    "subscription_end_date" TIMESTAMP(3),
    "is_subscription_active" BOOLEAN,
    "payment_method" TEXT,
    "last_payment_date" TIMESTAMP(3),
    "subscription_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "has_device" BOOLEAN,
    "uses_shared_device" BOOLEAN,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT,
    "competence" TEXT DEFAULT 'beginner',
    "budget" INTEGER DEFAULT 0,
    "current_points" INTEGER DEFAULT 0,
    "total_points" INTEGER DEFAULT 0,
    "rewards_earned" INTEGER DEFAULT 0,
    "tasks_assigned" INTEGER DEFAULT 0,
    "tasks_completed" INTEGER DEFAULT 0,
    "level" TEXT DEFAULT 'silver',
    "quizzes_correct_answers_count" INTEGER DEFAULT 0,
    "quizzes_total_points" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER,
    "creator_id" INTEGER NOT NULL,
    "creator_name" TEXT,
    "creation_date" TIMESTAMP(3),
    "type" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignment" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,
    "assigned_by" INTEGER,
    "assigned_by_name" TEXT,
    "assignment_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "routine_time" TEXT,
    "routine_exceptions" TEXT,
    "is_completed" BOOLEAN,
    "is_approved" BOOLEAN,
    "completion_date" TIMESTAMP(3),
    "approval_date" TIMESTAMP(3),
    "approved_by" INTEGER,
    "approved_by_name" TEXT,
    "creator_comment" TEXT,
    "creator_comment_date" TIMESTAMP(3),
    "createdFor_comment" TEXT,
    "attached_files" TEXT,

    CONSTRAINT "task_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "icon" TEXT,
    "creation_date" TIMESTAMP(3),
    "creator_id" INTEGER,
    "creator_name" TEXT,
    "is_claimed" BOOLEAN,
    "description" TEXT,
    "attached_files" TEXT,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_claim" (
    "id" SERIAL NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,
    "child_name" TEXT,
    "claimed_at" TIMESTAMP(3),
    "is_approved" BOOLEAN,
    "approved_by" INTEGER,
    "approved_by_name" TEXT,
    "approved_at" TIMESTAMP(3),
    "claim_comment" TEXT,
    "approve_comment" TEXT,
    "approve_comment_date" TIMESTAMP(3),

    CONSTRAINT "reward_claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN,
    "sender_id" INTEGER NOT NULL,
    "sender_name" TEXT,
    "receiver_id" INTEGER NOT NULL,
    "receiver_name" TEXT,
    "receiver_type" TEXT,
    "icon" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "currency" TEXT DEFAULT 'dollar',
    "points_per_currency" INTEGER,
    "language" TEXT DEFAULT 'english',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,
    "assigned_to" TEXT,
    "image" TEXT,
    "time" TIMESTAMP(3),
    "rewards" TEXT,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "topic" TEXT,
    "child_id" INTEGER,
    "parent_id" INTEGER,
    "question" TEXT,
    "options" TEXT,
    "correct_answer" TEXT,
    "points" INTEGER,
    "is_answered_correctly" BOOLEAN,
    "child_answer" TEXT,
    "creation_date" TIMESTAMP(3),
    "completion_date" TIMESTAMP(3),

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "creation_date" TIMESTAMP(3),
    "name" TEXT,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_username_key" ON "Parent"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Child_username_key" ON "Child"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Child_email_key" ON "Child"("email");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignment_task_id_child_id_key" ON "task_assignment"("task_id", "child_id");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_parent_id_key" ON "Setting"("parent_id");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_claim" ADD CONSTRAINT "reward_claim_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_claim" ADD CONSTRAINT "reward_claim_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "FK_Parent_Sender" FOREIGN KEY ("sender_id") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "FK_Parent_Receiver" FOREIGN KEY ("receiver_id") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "FK_Child_Sender" FOREIGN KEY ("sender_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "FK_Child_Receiver" FOREIGN KEY ("receiver_id") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
