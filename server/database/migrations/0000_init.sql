CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`note_id` text NOT NULL,
	`filename` text NOT NULL CHECK(length(filename) <= 100),
	`storage_path` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`thumbnail_path` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `attachments_note_id_idx` ON `attachments` (`note_id`);--> statement-breakpoint
CREATE TABLE `checklist_items` (
	`id` text PRIMARY KEY NOT NULL,
	`note_id` text NOT NULL,
	`text` text DEFAULT '' NOT NULL CHECK(length(text) <= 100),
	`is_checked` integer DEFAULT false NOT NULL,
	`position` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `checklist_items_note_id_idx` ON `checklist_items` (`note_id`);--> statement-breakpoint
CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL CHECK(length(name) <= 20),
	`position` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `labels_name_unique` ON `labels` (`name`);--> statement-breakpoint
CREATE TABLE `note_labels` (
	`note_id` text NOT NULL,
	`label_id` text NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `note_labels_note_id_idx` ON `note_labels` (`note_id`);--> statement-breakpoint
CREATE INDEX `note_labels_label_id_idx` ON `note_labels` (`label_id`);--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`title` text DEFAULT '' NOT NULL CHECK(length(title) <= 100),
	`content` text DEFAULT '' NOT NULL CHECK(length(content) <= 10000),
	`is_archived` integer DEFAULT false NOT NULL,
	`is_trashed` integer DEFAULT false NOT NULL,
	`trashed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `notes_is_archived_idx` ON `notes` (`is_archived`);--> statement-breakpoint
CREATE INDEX `notes_is_trashed_idx` ON `notes` (`is_trashed`);--> statement-breakpoint
CREATE INDEX `notes_updated_at_idx` ON `notes` (`updated_at`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
