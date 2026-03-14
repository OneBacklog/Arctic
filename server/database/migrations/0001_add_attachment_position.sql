ALTER TABLE `attachments` ADD COLUMN `position` real NOT NULL DEFAULT 0;
--> statement-breakpoint
WITH ordered AS (
  SELECT
    id,
    note_id,
    ROW_NUMBER() OVER (PARTITION BY note_id ORDER BY created_at ASC, id ASC) - 1 AS pos
  FROM attachments
)
UPDATE attachments
SET position = (SELECT pos FROM ordered WHERE ordered.id = attachments.id);
