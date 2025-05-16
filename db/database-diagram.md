# Database Structure Diagram

This diagram shows the relationships between the main tables in the 1Village database.

```
+-------------+       +-------------+       +-------------+
|   village   |       |     user    |       |  classroom  |
+-------------+       +-------------+       +-------------+
| id          |<---+  | id          |<---+  | id          |
| name        |    |  | ...         |    |  | villageId   |---+
| countryCodes|    |  +-------------+    |  | userId      |---+
| activePhase |    |                     |  +-------------+
+-------------+    |                     |         |
      |            |                     |         |
      |            |                     |         |
      v            |                     |         v
+-------------+    |                     |  +-------------+
|phase_history|    |                     |  |   student   |
+-------------+    |                     |  +-------------+
| id          |    |                     |  | id          |
| villageId   |----+                     |  | firstname   |
| phase       |                          |  | lastname    |
| startingOn  |                          |  | hashedCode  |
| endingOn    |                          |  | classroomId |---+
+-------------+                          |  +-------------+
                                         |         ^
                                         |         |
                                      +-------------+
                                      |user_to_student|
                                      +-------------+
                                      | id          |
                                      | userId      |----+
                                      | studentId   |----+
                                      +-------------+
```

## Table Relationships

1. **village** is the central entity

   - A village can have multiple classrooms
   - A village can have multiple phase_history entries

2. **user** can be associated with:

   - One classroom (as a teacher)
   - Multiple students (through user_to_student)

3. **classroom** belongs to:

   - One village
   - One user (teacher)
   - Can have multiple students

4. **student** belongs to:

   - One classroom
   - Can be linked to multiple users (through user_to_student)

5. **user_to_student** is a junction table linking:

   - Users to students (many-to-many relationship)

6. **phase_history** tracks:
   - The phases of a village over time
