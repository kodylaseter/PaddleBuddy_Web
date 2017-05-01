-- phpMyAdmin SQL Dump
-- version 4.6.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 25, 2016 at 05:20 PM
-- Server version: 5.7.12
-- PHP Version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pb_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `link`
--

CREATE TABLE `link` (
  `id` int(11) NOT NULL,
  `begin` int(11) NOT NULL,
  `end` int(11) NOT NULL,
  `speed` float NOT NULL DEFAULT '1',
  `river` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `link`
--

INSERT INTO `link` (`id`, `begin`, `end`, `speed`, `river`) VALUES
(1, 1, 2, 1, 1),
(2, 2, 3, 1, 1),
(3, 3, 4, 1, 1),
(4, 4, 5, 1, 1),
(5, 5, 6, 1, 1),
(6, 7, 8, 1, 2),
(7, 8, 9, 1, 2),
(8, 9, 10, 1, 2),
(9, 10, 11, 1, 2),
(10, 11, 12, 1, 2),
(11, 12, 13, 1, 2),
(12, 13, 14, 1, 2),
(13, 14, 15, 1, 2),
(14, 15, 16, 1, 2),
(15, 16, 17, 1, 2),
(16, 17, 18, 1, 2),
(17, 18, 19, 1, 2),
(18, 19, 20, 1, 2),
(19, 20, 21, 1, 2),
(20, 21, 22, 1, 2),
(21, 22, 23, 1, 2),
(22, 23, 24, 1, 2),
(23, 24, 25, 1, 2),
(24, 25, 26, 1, 2),
(25, 26, 27, 1, 2),
(26, 27, 28, 1, 2),
(27, 28, 29, 1, 2),
(28, 29, 30, 1, 2),
(29, 30, 31, 1, 2),
(30, 31, 32, 1, 2),
(31, 32, 33, 1, 2),
(32, 33, 34, 1, 2),
(33, 34, 35, 1, 2),
(34, 35, 36, 1, 2),
(35, 36, 37, 1, 2),
(36, 37, 38, 1, 2),
(37, 38, 39, 1, 2),
(38, 39, 40, 1, 2),
(39, 40, 41, 1, 2),
(40, 41, 42, 1, 2),
(41, 42, 43, 1, 2),
(42, 43, 44, 1, 2),
(43, 45, 46, 1, 4),
(44, 44, 47, 1, 2),
(45, 48, 49, 1, 17),
(46, 49, 50, 1, 17),
(47, 50, 51, 1, 17),
(48, 51, 52, 1, 17),
(49, 52, 53, 1, 17),
(50, 42, 54, 1, 2),
(51, 54, 55, 1, 2),
(52, 55, 56, 1, 2),
(53, 57, 58, 1, 18),
(54, 58, 59, 1, 18),
(55, 59, 60, 1, 18),
(56, 6, 61, 1, 1),
(57, 61, 62, 1, 1),
(58, 62, 63, 1, 1),
(59, 63, 64, 1, 1),
(60, 64, 65, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `point`
--

CREATE TABLE `point` (
  `id` int(11) NOT NULL,
  `lat` decimal(10,7) NOT NULL,
  `lng` decimal(10,7) NOT NULL,
  `river_id` int(11) NOT NULL,
  `is_launch_site` tinyint(1) NOT NULL DEFAULT '0',
  `label` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `point`
--

INSERT INTO `point` (`id`, `lat`, `lng`, `river_id`, `is_launch_site`, `label`) VALUES
(1, 33.7871372, -84.4752502, 1, 0, 'hello'),
(2, 33.8715558, -84.4203186, 1, 0, NULL),
(3, 33.8145253, -84.3077087, 1, 1, 'asdf'),
(4, 33.6912097, -84.3420410, 1, 0, NULL),
(5, 33.6900671, -84.4725037, 1, 0, NULL),
(6, 33.7688736, -84.3887329, 1, 0, NULL),
(7, 34.1630610, -84.0755796, 2, 0, NULL),
(8, 34.1440610, -84.0853214, 2, 1, 'testtttt'),
(9, 34.1324814, -84.0947199, 2, 0, NULL),
(10, 34.1264423, -84.0932608, 2, 0, NULL),
(11, 34.1231384, -84.0971661, 2, 0, NULL),
(12, 34.1190171, -84.0978527, 2, 0, NULL),
(13, 34.0979461, -84.1099977, 2, 0, NULL),
(14, 34.0768343, -84.1134739, 2, 0, NULL),
(15, 34.0656721, -84.1180229, 2, 0, NULL),
(16, 34.0521616, -84.0993977, 2, 0, NULL),
(17, 34.0469702, -84.1010284, 2, 0, NULL),
(18, 34.0330300, -84.1284084, 2, 0, NULL),
(19, 34.0325321, -84.1569901, 2, 0, NULL),
(20, 34.0246364, -84.1731262, 2, 0, NULL),
(21, 34.0000197, -84.1804218, 2, 0, NULL),
(22, 33.9898436, -84.2042828, 2, 0, NULL),
(23, 33.9950386, -84.2017078, 2, 0, NULL),
(24, 34.0037909, -84.2129517, 2, 0, NULL),
(25, 33.9985254, -84.2469406, 2, 0, NULL),
(26, 33.9867835, -84.2544937, 2, 0, NULL),
(27, 33.9864988, -84.2617035, 2, 0, NULL),
(28, 33.9732605, -84.2635918, 2, 0, NULL),
(29, 33.9796664, -84.2761230, 2, 0, NULL),
(30, 33.9755382, -84.2901993, 2, 0, NULL),
(31, 33.9840790, -84.2986107, 2, 0, NULL),
(32, 33.9884915, -84.2960358, 2, 0, NULL),
(33, 33.9845061, -84.3056488, 2, 0, NULL),
(34, 33.9870681, -84.3224716, 2, 0, NULL),
(35, 34.0098388, -84.3341446, 2, 0, NULL),
(36, 34.0003043, -84.3813515, 2, 0, NULL),
(37, 33.9939000, -84.3847847, 2, 0, NULL),
(38, 33.9920497, -84.3791199, 2, 0, NULL),
(39, 33.9768194, -84.3751717, 2, 0, NULL),
(40, 33.9709827, -84.3851280, 2, 0, NULL),
(41, 33.9641491, -84.3839264, 2, 0, NULL),
(42, 33.9325362, -84.4179153, 2, 0, NULL),
(45, 33.7152016, -83.5180664, 4, 0, NULL),
(46, 34.1618182, -84.4079590, 4, 0, NULL),
(48, 33.8053969, -84.2493439, 17, 0, NULL),
(49, 33.9068956, -84.2829895, 17, 0, NULL),
(50, 33.9137338, -84.4168854, 17, 0, NULL),
(51, 33.8818172, -84.4711304, 17, 0, NULL),
(52, 33.7648779, -84.4937897, 17, 0, NULL),
(53, 33.6540662, -84.4972229, 17, 0, NULL),
(54, 33.9103148, -84.4460678, 2, 0, NULL),
(55, 33.9003417, -84.4433212, 2, 0, NULL),
(57, 34.9039530, -86.0229492, 18, 0, NULL),
(58, 32.0080760, -86.6821289, 18, 0, NULL),
(59, 33.0086635, -82.2656250, 18, 0, NULL),
(60, 35.2276724, -83.5400391, 18, 0, NULL),
(61, 34.8679050, -85.0561523, 1, 0, NULL),
(62, 35.8178132, -83.0786133, 1, 0, NULL),
(63, 33.3580616, -81.9360352, 1, 0, NULL),
(64, 32.2871326, -84.8583984, 1, 0, NULL),
(65, 34.3071439, -87.2094727, 1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `river`
--

CREATE TABLE `river` (
  `id` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `river`
--

INSERT INTO `river` (`id`, `name`) VALUES
(1, 'test'),
(2, 'blah'),
(3, 'this is another test'),
(4, 'black'),
(5, 'blue'),
(6, 'green'),
(7, 'brown'),
(8, 'orange'),
(9, 'cake'),
(10, 'apple'),
(11, 'pie'),
(12, 'sdf'),
(13, 'qwerwer'),
(14, 'asdfasdf'),
(15, 'rewrwer'),
(16, 'adsfasdf'),
(17, 'anotherone'),
(18, 'blahhhhhh');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `link`
--
ALTER TABLE `link`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `point`
--
ALTER TABLE `point`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `river`
--
ALTER TABLE `river`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `link`
--
ALTER TABLE `link`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
--
-- AUTO_INCREMENT for table `point`
--
ALTER TABLE `point`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT for table `river`
--
ALTER TABLE `river`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
