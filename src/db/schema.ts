import { relations } from "drizzle-orm";
import { date, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull()
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  bodyPartId: integer('body_part_id').notNull().references(() => bodyParts.id),
  imageUrl: text('image_url').notNull(),
});

export const bodyPartsEnum = pgEnum('name', ['arm', 'chest', 'back', 'core', 'leg']);
export const bodyParts = pgTable('body_parts', {
  id: serial('id').primaryKey(),
  name: bodyPartsEnum('name').notNull(),
});

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  userId: integer('user_id').references(() => users.id)
});

export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  workoutId: integer('workout_id').notNull().references(() => workouts.id)
});


export const workoutSchedulesEnum = pgEnum('week_day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
export const workoutSchedules = pgTable('workout_schedules', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().references(() => workouts.id),
  weekDay: workoutSchedulesEnum('week_day')
});

export const workoutRecords = pgTable('workout_records', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().references(() => workouts.id),
  date: date('date', { mode: 'date' }).notNull()
});

export const workoutRecordsWeights = pgTable('workout_records_weights', {
  id: serial('id').primaryKey(),
  workoutRecordId: integer('workout_records_id').notNull().references(() => workoutRecords.id),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  weight: integer('weight').notNull()
});



// Relations

export const bodyPartRelations = relations(bodyParts, ({ many }) => ({
    exercises: many(exercises)
}));

export const exerciseRelations = relations(exercises, ({one, many}) => ({
  bodyPart: one(bodyParts, {
    fields: [exercises.bodyPartId],
    references: [bodyParts.id]
  }),
  workoutRecordsWeight: many(workoutRecordsWeights)
}));

export const userRelations = relations(users, ({many}) => ({
  workout: many(users)
}));

export const workoutRelations = relations(workouts, ({one, many}) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id]
  }),
  workoutSchedule: many(workoutSchedules),
  workoutRecord: many(workoutRecords)
}));

export const workoutExercisesRelations = relations(workoutExercises, ({many}) => ({
  workout: many(workouts),
  exercise: many(exercises)
}));

export const workoutSchedulesRelations = relations(workoutSchedules, ({one}) => ({
  workout: one(workouts, {
    fields: [workoutSchedules.workoutId],
    references: [workouts.id]
  })
}));

export const workoutRecordsRelations = relations(workoutRecords, ({one, many}) => ({
  workout: one(workouts, {
    fields: [workoutRecords.workoutId],
    references: [workouts.id]
  }),
  workoutRecordsWeight: many(workoutRecordsWeights)
}));

export const workoutRecordsWeightsRelations = relations(workoutRecordsWeights, ({one}) => ({
  workoutRecord: one(workoutRecords, {
    fields: [workoutRecordsWeights.workoutRecordId],
    references: [workoutRecords.id]
  }),
  exercise: one(exercises, {
    fields: [workoutRecordsWeights.exerciseId],
    references: [exercises.id]
  })
}));

