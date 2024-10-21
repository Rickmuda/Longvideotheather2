-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 21 okt 2024 om 13:36
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lvt`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `user`
--

INSERT INTO `user` (`id`, `email`, `password`) VALUES
(2, 'rickambergen25@gmail.com', '$2a$10$7nae9CaT5tW2/kjiJeaR..HzKrWFf0xFMiNIsMZc39XE6068d4wKy');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `video`
--

CREATE TABLE `video` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `creator` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `thumbnail` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `video`
--

INSERT INTO `video` (`id`, `title`, `creator`, `url`, `thumbnail`, `category`) VALUES
(1, 'They Are EXPERIMENTING On The VITA CARNIS | Vita Carnis', 'EmortalMarcus', 'https://www.youtube.com/watch?v=SyCUYi4qeI0', 'https://i.ytimg.com/vi/SyCUYi4qeI0/hqdefault.jpg', 'Digital'),
(2, 'Celeste Might\'ve Changed my Life.', 'Leadhead', 'https://www.youtube.com/watch?v=JSFkpr_psJs', 'https://i.ytimg.com/vi/JSFkpr_psJs/hqdefault.jpg', 'Videogames'),
(4, 'The Sinister Reflections of Ugly', 'CSideSummit', 'https://www.youtube.com/watch?v=GgrAgDizQ_A&list=WL&index=63&t=1525s', 'https://i.ytimg.com/vi/GgrAgDizQ_A/hqdefault.jpg', 'Videogames'),
(5, 'Sally Face: The STRUGGLE of SURVIVOR\'S GUILT', 'Uri Clarke', 'https://www.youtube.com/watch?v=NWd5oVwVWi4&list=WL&index=62&t=40s', 'https://i.ytimg.com/vi/NWd5oVwVWi4/hqdefault.jpg', 'Videogames'),
(6, 'Gushing About Jujutsu Kaisen\'s Soundtrack for 88 Minutes', 'Heralen', 'https://www.youtube.com/watch?v=cn1VNWepHlw&list=WL&index=55&t=2506s', 'https://i.ytimg.com/vi/cn1VNWepHlw/hqdefault.jpg', 'Anime/Manga'),
(7, 'Emesis Blue - TF2\'s Most Disturbing Masterpiece', 'TheWhat Show', 'https://www.youtube.com/watch?v=DDlstyGd9kg&list=WL&index=26', 'https://i.ytimg.com/vi/DDlstyGd9kg/hqdefault.jpg', 'Digital'),
(8, 'An Incorrect Summary of Metal Gear Rising | Part 1', 'Max0r', 'https://www.youtube.com/watch?v=41v3L0zCkNY&list=WL&index=21&t=5s', 'https://i.ytimg.com/vi/41v3L0zCkNY/hqdefault.jpg', 'Videogames'),
(9, 'An Incorrect Summary of Metal Gear Rising | Part 2 | Sons of Obesity', 'Max0r', 'https://www.youtube.com/watch?v=TgmTsa3rFU0&list=WL&index=20&t=1150s', 'https://i.ytimg.com/vi/TgmTsa3rFU0/hqdefault.jpg', 'Videogames');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('387f0a02-ae26-4082-a2e4-113200b6bc65', 'ac4d811d67b5e9c46ef6a6ee2e922ba62651c02427f6bb312238f81b03763f96', '2024-07-12 14:10:29.884', '20240712141029_add_users', NULL, NULL, '2024-07-12 14:10:29.868', 1),
('47c69817-5d62-4b41-96bf-381ef03ed3e5', 'dc10dc6297041152dce0fc239e8b8892770c208ef6085198762e53586708e1c1', '2024-07-12 13:39:47.308', '20240712133947_first', NULL, NULL, '2024-07-12 13:39:47.299', 1);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexen voor tabel `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT voor een tabel `video`
--
ALTER TABLE `video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
