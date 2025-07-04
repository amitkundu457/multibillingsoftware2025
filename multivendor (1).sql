-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 04, 2025 at 11:03 AM
-- Server version: 8.0.30
-- PHP Version: 8.2.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `multivendor`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` bigint UNSIGNED NOT NULL,
  `rcp_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `recive_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `ref_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `narration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `account_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checkin_date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `rcp_no`, `customer_id`, `recive_id`, `amount`, `ref_no`, `narration`, `created_by`, `account_type`, `checkin_date`, `created_at`, `updated_at`) VALUES
(2, 'RCP1223/2', 2, 2, 1000.00, 'REF002', 'Advance payment', 1, NULL, NULL, '2024-12-23 07:45:11', '2024-12-23 07:45:11'),
(8, 'RCP1225/3', 1, 2, 2.00, '22', '22', 6, 'CONTRA', '2024-12-02', '2024-12-25 14:12:50', '2024-12-25 14:12:50'),
(17, 'RCP1225/9', 1, 1, 344.00, '33e', 'ee', 6, 'CONTRA', '2024-12-07', '2024-12-25 15:29:13', '2024-12-25 15:29:13'),
(19, 'RCP1225/18', 2, 1, 33.00, '3e', 'ee', 6, 'CONTRA', '2024-12-12', '2024-12-25 15:32:17', '2024-12-25 15:32:17');

-- --------------------------------------------------------

--
-- Table structure for table `account_groups`
--

CREATE TABLE `account_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_groups`
--

INSERT INTO `account_groups` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'honus', '2024-12-23 03:52:52', '2024-12-23 03:54:27'),
(2, 'qq', '2024-12-24 03:35:45', '2024-12-24 03:35:45'),
(3, 'aa', '2024-12-24 03:41:59', '2024-12-24 03:41:59'),
(4, 'aasss', '2024-12-24 03:42:08', '2024-12-24 03:42:08');

-- --------------------------------------------------------

--
-- Table structure for table `account_masters`
--

CREATE TABLE `account_masters` (
  `id` bigint UNSIGNED NOT NULL,
  `account_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gstin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_group_id` bigint UNSIGNED NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blance` int NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_masters`
--

INSERT INTO `account_masters` (`id`, `account_name`, `gstin`, `phone`, `account_group_id`, `city`, `state`, `contact_person`, `blance`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Example Accounts', '22AAAAA0000A1Z5', '9876543210', 1, 'Example City', 'Example State', 'John Doe', 5000, 1, '2024-12-23 03:41:44', '2024-12-23 03:42:42'),
(2, 'ss', 'sss', '2228987889', 1, 'kolkata', 'west bengal', 'ffsfs', 4555, 1, '2024-12-24 01:51:46', '2024-12-24 01:51:46'),
(3, 'tess', '455', '5678786788', 1, 'kolkata', 'west bengal', 'ee', 455, 1, '2024-12-24 02:11:29', '2024-12-24 02:11:29');

-- --------------------------------------------------------

--
-- Table structure for table `adjust_stocks`
--

CREATE TABLE `adjust_stocks` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assign_clients`
--

CREATE TABLE `assign_clients` (
  `id` bigint UNSIGNED NOT NULL,
  `client_id` bigint UNSIGNED NOT NULL,
  `distributor_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint UNSIGNED NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `image`, `created_at`, `updated_at`) VALUES
(2, 'uploads/brands/1732946617.jpg', '2024-11-30 00:33:37', '2024-11-30 00:33:37'),
(3, 'uploads/brands/1732946623.jpg', '2024-11-30 00:33:43', '2024-11-30 00:33:43'),
(4, 'uploads/brands/1732946636.jpg', '2024-11-30 00:33:56', '2024-11-30 00:33:56'),
(5, 'uploads/brands/1732946732.jpg', '2024-11-30 00:35:32', '2024-11-30 00:35:32'),
(6, 'uploads/brands/1732946740.jpg', '2024-11-30 00:35:40', '2024-11-30 00:35:40'),
(7, 'uploads/brands/1732946749.jpg', '2024-11-30 00:35:49', '2024-11-30 00:35:49'),
(8, 'uploads/brands/1732946759.jpg', '2024-11-30 00:35:59', '2024-11-30 00:35:59'),
(9, 'uploads/brands/1732946769.jpg', '2024-11-30 00:36:09', '2024-11-30 00:36:09'),
(10, 'uploads/brands/1732946856.jpg', '2024-11-30 00:37:36', '2024-11-30 00:37:36'),
(11, 'uploads/brands/1732946871.jpg', '2024-11-30 00:37:51', '2024-11-30 00:37:51'),
(12, 'uploads/brands/1732946899.jpg', '2024-11-30 00:38:19', '2024-11-30 00:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coins`
--

CREATE TABLE `coins` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coins`
--

INSERT INTO `coins` (`id`, `name`, `amount`, `created_at`, `updated_at`) VALUES
(1, '123358', 50, '2024-12-13 01:12:52', '2024-12-23 00:59:17'),
(2, '89', 12, '2024-12-21 02:10:43', '2024-12-21 02:10:43'),
(3, '100', 50, '2024-12-21 04:56:37', '2024-12-21 04:56:37');

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_id` bigint UNSIGNED NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'testdemo', '2024-12-13 01:05:40', '2024-12-13 01:05:40');

-- --------------------------------------------------------

--
-- Table structure for table `coni_purchases`
--

CREATE TABLE `coni_purchases` (
  `id` bigint UNSIGNED NOT NULL,
  `coins` int NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `payment_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coni_purchases`
--

INSERT INTO `coni_purchases` (`id`, `coins`, `created_by`, `amount`, `payment_method`, `created_at`, `updated_at`) VALUES
(1, 0, 6, 12.00, 'online', '2024-12-21 04:08:58', '2024-12-21 04:08:58'),
(2, 123176, 6, 50.00, 'cash', '2024-12-21 04:34:58', '2024-12-21 04:34:58'),
(3, 123363, 6, 50.00, 'online', '2024-12-21 04:55:35', '2024-12-21 04:55:35'),
(4, 100, 6, 50.00, 'online', '2024-12-21 05:12:17', '2024-12-21 05:12:17'),
(5, 123358, 6, 50.00, 'online', '2025-01-04 04:32:21', '2025-01-04 04:32:21');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_sub_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `anniversary` date DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `phone`, `customer_type`, `customer_sub_type`, `dob`, `anniversary`, `gender`, `address`, `pincode`, `state`, `country`, `created_at`, `updated_at`) VALUES
(1, 8, '123456789', 'retail', 'retail', '2024-12-12', '2024-12-19', 'male', 'ecee', '700008', 'west bengal', 'india', '2024-12-13 03:11:35', '2024-12-13 03:11:35');

-- --------------------------------------------------------

--
-- Table structure for table `customersub_types`
--

CREATE TABLE `customersub_types` (
  `id` bigint UNSIGNED NOT NULL,
  `type_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_types`
--

CREATE TABLE `customer_types` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `distrubutrers`
--

CREATE TABLE `distrubutrers` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pan_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gst_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ifsc_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_holder_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commission` int NOT NULL DEFAULT '0',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `distrubutrers`
--

INSERT INTO `distrubutrers` (`id`, `user_id`, `company_name`, `company_logo`, `address`, `phone`, `website`, `email`, `pan_number`, `gst_number`, `ifsc_code`, `bank_name`, `account_number`, `account_holder_name`, `account_type`, `status`, `commission`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 6, 'Velez Vazquez Co', 'Buck Conner LLC', 'Enim veniam rerum m', '8985698569', 'https://www.mix.cc', 'silo@mailinator.com', '582', '160', '8985698', 'Yeo Burton', '820', 'Howard Cervantes', 'Current', 'Inactive', 0, 0, '2024-12-26 06:59:13', '2024-12-26 06:59:13'),
(2, 6, 'Velez Vazquez Co', 'Buck Conner LLC', 'Enim veniam rerum m', '8985698569', 'https://www.mix.cc', 'silo@mailinator.com', '582', '160', '8985698', 'Yeo Burton', '820', 'Howard Cervantes', 'Current', 'Inactive', 0, 0, '2024-12-26 07:25:08', '2024-12-26 07:25:08'),
(3, 6, 'Velez Vazquez Co', 'Buck Conner LLC', 'Enim veniam rerum m', '8985698569', 'https://www.mix.cc', 'silo@mailinator.com', '582', '160', '8985698', 'Yeo Burton', '820', 'Howard Cervantes', 'Current', 'Inactive', 0, 0, '2024-12-26 07:25:31', '2024-12-26 07:25:31'),
(4, 11, 'Perry and Wood Traders', 'Crawford Walker Associates', 'Quidem deserunt ad d', '8981236369', 'https://www.kubylagefuboc.cm', 'qozava@mailinator.com', '261', '606', '898', 'Charles Barnett', '801', 'Regan Mclaughlin', 'Savings', 'Active', 0, 0, '2024-12-26 07:31:36', '2024-12-26 07:31:36'),
(5, 12, 'Burton Steele Trading', 'aa', 'Assumenda mollit rer', '8985698587', 'https://www.familagiriwu.org.uk', 'qosevok@mailinator.com', '8985698', '856985', '8589', 'asasa', '898', 'aaa', 'Savings', 'Active', 0, 11, '2024-12-26 07:53:36', '2024-12-26 07:53:36'),
(6, 16, 'Allison and Bowers Traders', 'Chang and Dalton LLC', 'Officiis qui sapient', '1234567890', 'https://www.roxeryh.net', 'rywek@mailinator.com', '258', '181', 'Enim ab amet rerum', 'Astra Holland', '309', 'Axel Pennington', 'Savings', 'Inactive', 0, 6, '2025-01-02 07:05:36', '2025-01-02 07:05:36'),
(7, 17, 'Williamson Mills Traders', 'Taylor and Wells LLC', 'Autem eos magnam ex', '1234567890', 'https://www.luqaxyfowit.me', 'bexuvyb@mailinator.com', '689', '291', 'Optio est expedita', 'Stacey Melendez', '868', 'Hollee Tran', 'Current', 'Inactive', 0, 6, '2025-01-02 07:05:57', '2025-01-02 07:05:57'),
(8, 18, 'ww', 'ww', 'ee', '1111155555', 'w', 'k@kw.com', '333', '333', '33', 'ee', 'e33', 'e', 'Savings', 'Active', 0, 6, '2025-01-04 01:24:37', '2025-01-04 01:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `ecosydtems`
--

CREATE TABLE `ecosydtems` (
  `id` bigint UNSIGNED NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ecosydtems`
--

INSERT INTO `ecosydtems` (`id`, `image`, `description`, `created_at`, `updated_at`) VALUES
(1, 'uploads/ecosystems/1732952588.jpg', 'ACROSS CATEGORIES & CITIES\r\nCATEGORIES: Food, Beauty, Apparel, Jewellery Electronics and a lot more\r\n\r\nCITIES: Delhi, Mumbai, Pune, Kolkatta, Jaipur, Ahamedabad, Chennai and a lot more', '2024-11-30 00:40:09', '2024-11-30 02:13:08');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `joining_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `phone`, `address`, `joining_date`, `dob`, `gender`, `created_at`, `updated_at`) VALUES
(1, 15, '898569898', 'Itaque quis iure qui', '2021-06-29', '2007-12-27', 'Do aut tenetur perfe', '2024-12-28 07:16:05', '2024-12-28 07:16:05');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `form_otps`
--

CREATE TABLE `form_otps` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `form_otps`
--

INSERT INTO `form_otps` (`id`, `email`, `created_at`, `updated_at`) VALUES
(1, 's@gmail.com', '2024-12-04 01:38:48', '2024-12-04 01:38:48'),
(2, 'a@gmail.com', '2024-12-04 01:47:20', '2024-12-04 01:47:20'),
(3, 'a@gmail.com', '2024-12-04 01:53:48', '2024-12-04 01:53:48'),
(4, 'a@gmail.com', '2024-12-04 01:53:50', '2024-12-04 01:53:50'),
(5, 'a@gmail.com', '2024-12-04 01:59:31', '2024-12-04 01:59:31'),
(6, 'a@gmail.com', '2024-12-04 01:59:43', '2024-12-04 01:59:43'),
(7, 's@gmail.com', '2024-12-04 02:05:24', '2024-12-04 02:05:24'),
(8, 'a@gmail.com', '2024-12-04 02:15:38', '2024-12-04 02:15:38'),
(9, 'a@gmail.com', '2024-12-04 03:10:50', '2024-12-04 03:10:50'),
(10, 'a@gmail.com', '2024-12-04 03:15:14', '2024-12-04 03:15:14'),
(11, 'a@gmail.com', '2024-12-04 03:15:42', '2024-12-04 03:15:42'),
(12, 's@gmail.com', '2024-12-04 12:11:16', '2024-12-04 12:11:16'),
(13, '9831143669', '2024-12-05 07:22:41', '2024-12-05 07:22:41'),
(14, 'S@gmail.com', '2024-12-05 08:27:41', '2024-12-05 08:27:41'),
(15, '9304458082', '2024-12-05 10:11:52', '2024-12-05 10:11:52'),
(16, '9304458082', '2024-12-13 05:05:45', '2024-12-13 05:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `karigaris`
--

CREATE TABLE `karigaris` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `karigari_items`
--

CREATE TABLE `karigari_items` (
  `id` bigint UNSIGNED NOT NULL,
  `karigari_id` bigint UNSIGNED NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nwt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pcs` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tounch` decimal(10,2) NOT NULL DEFAULT '0.00',
  `rate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_generates`
--

CREATE TABLE `log_generates` (
  `id` bigint UNSIGNED NOT NULL,
  `process_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `window_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_settings`
--

CREATE TABLE `master_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_11_25_053503_create_personal_access_tokens_table', 2),
(5, '2024_11_27_070044_create_solutions_table', 3),
(6, '2024_11_27_125657_create_brands_table', 3),
(7, '2024_11_27_131331_create_ecosydtems_table', 3),
(8, '2024_11_28_072950_create_products_table', 3),
(9, '2024_11_28_121041_create_tabs_table', 3),
(10, '2024_11_28_125003_create_services_table', 3),
(11, '2024_11_28_131327_create_sliders_table', 3),
(12, '2024_12_03_085044_create_log_generates_table', 4),
(13, '2024_12_02_103847_create_user_infos_table', 5),
(14, '2024_12_03_115843_create_user_information_table', 5),
(15, '2024_12_04_065059_create_form_otps_table', 6),
(16, '2024_12_04_104007_create_employees_table', 7),
(17, '2024_12_05_054907_create_master_settings_table', 8),
(18, '2024_12_06_051956_create_sales_assigns_table', 8),
(19, '2024_12_06_065928_create_sale_products_table', 8),
(20, '2024_12_06_094148_create_distrubutrers_table', 8),
(21, '2024_12_06_113544_create_customers_table', 8),
(22, '2024_12_07_084607_create_customer_types_table', 8),
(23, '2024_12_07_084705_create_customersub_types_table', 8),
(24, '2024_12_09_062348_create_permission_tables', 8),
(25, '2024_12_10_061159_create_product_services_table', 8),
(26, '2024_12_10_103816_create_product_service_groups_table', 8),
(27, '2024_12_10_105713_create_companies_table', 8),
(28, '2024_12_10_110310_create_rates_table', 8),
(29, '2024_12_10_110942_create_types_table', 8),
(30, '2024_12_11_120240_create_coins_table', 8),
(31, '2024_12_12_075415_create_orders_table', 8),
(32, '2024_12_12_075453_create_order_details_table', 8),
(33, '2024_12_12_075520_create_payments_table', 8),
(34, '2024_12_21_075256_create_coni_purchases_table', 9),
(35, '2024_12_23_082307_create_account_masters_table', 10),
(36, '2024_12_23_091659_create_account_groups_table', 11),
(37, '2024_12_23_104824_create_accounts_table', 12),
(38, '2024_12_25_073009_create_purchases_table', 13),
(39, '2024_12_26_085452_create_adjust_stocks_table', 14),
(40, '2024_12_28_074237_create_karigaris_table', 15),
(41, '2024_12_28_074250_create_karigari_items_table', 15),
(42, '2024_12_30_113646_create_commissions_table', 15),
(43, '2025_01_02_153259_create_assign_clients_table', 16),
(44, '2025_01_03_071524_create_software_commissions_table', 16);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(3, 'App\\Models\\User', 6),
(1, 'App\\Models\\User', 11);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `billno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `salesperson_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `gross_total` decimal(8,2) DEFAULT NULL,
  `discount` decimal(8,2) DEFAULT NULL,
  `total_price` decimal(8,2) DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `bill_inv` int DEFAULT '0',
  `order_slip` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `billno`, `salesperson_id`, `date`, `gross_total`, `discount`, `total_price`, `created_by`, `customer_id`, `bill_inv`, `order_slip`, `created_at`, `updated_at`) VALUES
(1, 'BN1734072279', NULL, NULL, 3467.00, 0.00, 3467.00, 1, 1, NULL, NULL, '2024-12-13 01:14:39', '2024-12-13 01:14:39'),
(2, 'BN1734072287', NULL, NULL, 3467.00, 0.00, 3467.00, 1, 1, NULL, NULL, '2024-12-13 01:14:47', '2024-12-13 01:14:47'),
(3, 'BN1734072295', NULL, NULL, 3467.00, 0.00, 3467.00, 1, 1, NULL, NULL, '2024-12-13 01:14:55', '2024-12-13 01:14:55'),
(4, 'BN1734072330', NULL, NULL, 3467.00, 0.00, 3467.00, 1, 1, NULL, NULL, '2024-12-13 01:15:30', '2024-12-13 01:15:30'),
(5, 'BN1734072364', NULL, NULL, 500.00, 0.00, 500.00, 1, 1, NULL, NULL, '2024-12-13 01:16:04', '2024-12-13 01:16:04'),
(6, 'BN1734078760', NULL, NULL, 500.00, 0.00, 500.00, 1, 1, NULL, NULL, '2024-12-13 03:02:40', '2024-12-13 03:02:40'),
(7, 'BN1734078813', NULL, NULL, 500.00, 0.00, 500.00, 1, 1, NULL, NULL, '2024-12-13 03:03:33', '2024-12-13 03:03:33'),
(8, 'BN1734353100', NULL, NULL, 3.00, 0.00, 3.00, 1, 1, NULL, NULL, '2024-12-16 07:15:00', '2024-12-16 07:15:00'),
(9, 'BN1734353101', NULL, NULL, 3.00, 0.00, 3.00, 1, 1, NULL, NULL, '2024-12-16 07:15:01', '2024-12-16 07:15:01'),
(10, 'BN1734353166', NULL, NULL, 52000.00, 0.00, 52000.00, 1, 1, NULL, NULL, '2024-12-16 07:16:06', '2024-12-16 07:16:06'),
(11, 'BN1734353318', NULL, NULL, 45.00, 0.00, 45.00, 1, 1, NULL, NULL, '2024-12-16 07:18:38', '2024-12-16 07:18:38'),
(12, 'BN1734588523', NULL, NULL, 500.00, 0.00, 500.00, 1, 1, NULL, NULL, '2024-12-19 00:38:43', '2024-12-19 00:38:43'),
(13, 'BN1734589026', NULL, NULL, 500.00, 0.00, 500.00, 1, 8, NULL, NULL, '2024-12-19 00:47:06', '2024-12-19 00:47:06'),
(14, 'BN1734589655', NULL, NULL, 500.00, 0.00, 500.00, 1, 8, NULL, NULL, '2024-12-19 00:57:35', '2024-12-19 00:57:35'),
(15, 'BN1734589702', NULL, NULL, 500.00, 0.00, 500.00, 6, 8, NULL, NULL, '2024-12-19 00:58:22', '2024-12-19 00:58:22'),
(16, 'BN1734590328', NULL, NULL, 500.00, 0.00, 500.00, 6, 8, NULL, NULL, '2024-12-19 01:08:48', '2024-12-19 01:08:48'),
(17, 'BN1734590438', NULL, NULL, 60000.00, 0.00, 60000.00, 6, 8, NULL, NULL, '2024-12-19 01:10:38', '2024-12-19 01:10:38'),
(18, 'BN1734590541', NULL, NULL, 9000.00, 0.00, 9000.00, 6, 8, NULL, NULL, '2024-12-19 01:12:21', '2024-12-19 01:12:21'),
(19, 'BN1734590688', NULL, NULL, 500.00, 0.00, 500.00, 6, 8, NULL, NULL, '2024-12-19 01:14:48', '2024-12-19 01:14:48'),
(20, 'BN1734590756', NULL, NULL, 800.00, 0.00, 800.00, 6, 8, NULL, NULL, '2024-12-19 01:15:56', '2024-12-19 01:15:56'),
(21, 'BN1734590836', NULL, NULL, 80000.00, 0.00, 80000.00, 6, 8, NULL, NULL, '2024-12-19 01:17:16', '2024-12-19 01:17:16'),
(22, 'BN1734590906', NULL, NULL, 8000.00, 0.00, 8000.00, 6, 8, NULL, NULL, '2024-12-19 01:18:26', '2024-12-19 01:18:26'),
(23, 'BN1734590994', NULL, '2024-12-10', 522.00, 0.00, 522.00, 6, 8, NULL, NULL, '2024-12-19 01:19:54', '2024-12-19 01:19:54'),
(24, 'BN1734602087', NULL, NULL, 80.00, 0.00, 80.00, 6, 8, NULL, NULL, '2024-12-19 04:24:47', '2024-12-19 04:24:47'),
(25, 'BN1734602134', NULL, NULL, 500.00, 0.00, 500.00, 6, 8, NULL, NULL, '2024-12-19 04:25:34', '2024-12-19 04:25:34'),
(26, 'BN1734603527', NULL, NULL, 500.00, 0.00, 500.00, 6, 8, NULL, NULL, '2024-12-19 04:48:47', '2024-12-19 04:48:47'),
(27, 'BN1734603979', NULL, NULL, 800.00, 0.00, 800.00, 6, 8, NULL, NULL, '2024-12-19 04:56:19', '2024-12-19 04:56:19'),
(28, 'BN1734604296', NULL, NULL, 955.00, 0.00, 955.00, 6, 8, NULL, NULL, '2024-12-19 05:01:36', '2024-12-19 05:01:36'),
(29, 'BN1734604998', NULL, NULL, 955.00, 0.00, 955.00, 6, 8, NULL, NULL, '2024-12-19 05:13:18', '2024-12-19 05:13:18'),
(30, 'BN1734605037', NULL, NULL, 955.00, 0.00, 955.00, 6, 8, NULL, NULL, '2024-12-19 05:13:57', '2024-12-19 05:13:57'),
(31, 'BN1734605064', NULL, NULL, 800.00, 0.00, 800.00, 6, 8, NULL, NULL, '2024-12-19 05:14:24', '2024-12-19 05:14:24'),
(32, 'BN1734605191', NULL, NULL, 233.00, 0.00, 233.00, 6, 8, NULL, NULL, '2024-12-19 05:16:31', '2024-12-19 05:16:31'),
(33, 'BN1734605935', NULL, NULL, 899.00, 0.00, 899.00, 6, 8, NULL, NULL, '2024-12-19 05:28:55', '2024-12-19 05:28:55'),
(34, 'BN1734605998', NULL, NULL, 855.00, 0.00, 855.00, 6, 8, NULL, NULL, '2024-12-19 05:29:58', '2024-12-19 05:29:58'),
(35, 'BN1734606286', NULL, NULL, 500.00, 0.00, 500.00, 6, 8, NULL, NULL, '2024-12-19 05:34:46', '2024-12-19 05:34:46'),
(36, 'BN1734679531', NULL, NULL, 716.00, 0.00, 716.00, 6, 8, NULL, NULL, '2024-12-20 01:55:31', '2024-12-20 01:55:31'),
(37, 'BN1734679753', NULL, NULL, 44644.00, 0.00, 44644.00, 6, 8, NULL, NULL, '2024-12-20 01:59:13', '2024-12-20 01:59:13'),
(38, 'BN1734679813', NULL, NULL, 344.00, 0.00, 344.00, 6, 8, NULL, NULL, '2024-12-20 02:00:13', '2024-12-20 02:00:13'),
(39, 'BN1734679941', NULL, NULL, 644.00, 0.00, 644.00, 6, 8, NULL, NULL, '2024-12-20 02:02:21', '2024-12-20 02:02:21'),
(40, 'BN1734680625', NULL, NULL, 2105.00, 0.00, 2105.00, 6, 8, NULL, NULL, '2024-12-20 02:13:45', '2024-12-20 02:13:45'),
(41, 'BN1734682203', NULL, NULL, 3444.00, 0.00, 3444.00, 6, 8, NULL, NULL, '2024-12-20 02:40:03', '2024-12-20 02:40:03'),
(42, 'BN1734682204', NULL, NULL, 3444.00, 0.00, 3444.00, 6, 8, NULL, NULL, '2024-12-20 02:40:04', '2024-12-20 02:40:04'),
(43, 'BN1734682263', NULL, NULL, 5106.00, 0.00, 5106.00, 6, 8, NULL, NULL, '2024-12-20 02:41:03', '2024-12-20 02:41:03'),
(44, 'BN1734682502', NULL, NULL, 3445.00, 0.00, 3445.00, 6, 8, NULL, NULL, '2024-12-20 02:45:02', '2024-12-20 02:45:02'),
(45, 'BN1734685931', NULL, NULL, 1183.00, 0.00, 1183.00, 6, 8, NULL, NULL, '2024-12-20 03:42:11', '2024-12-20 03:42:11'),
(46, 'BN1734686789', NULL, NULL, 1683.00, 0.00, 1683.00, 6, 8, NULL, NULL, '2024-12-20 03:56:29', '2024-12-20 03:56:29'),
(47, 'BN1734686816', NULL, NULL, 183.00, 0.00, 183.00, 6, 8, NULL, NULL, '2024-12-20 03:56:56', '2024-12-20 03:56:56'),
(48, 'BN1734687599', NULL, NULL, 1322.00, 0.00, 1322.00, 6, 8, NULL, NULL, '2024-12-20 04:09:59', '2024-12-20 04:09:59'),
(49, 'BN1734687766', NULL, NULL, 622.00, 0.00, 622.00, 6, 8, NULL, NULL, '2024-12-20 04:12:46', '2024-12-20 04:12:46'),
(50, 'BN1734687806', NULL, NULL, 122.00, 0.00, 122.00, 6, 8, NULL, NULL, '2024-12-20 04:13:26', '2024-12-20 04:13:26'),
(51, 'BN1734687903', NULL, NULL, 102.00, 0.00, 102.00, 6, 8, NULL, NULL, '2024-12-20 04:15:03', '2024-12-20 04:15:03'),
(52, 'BN1734690162', NULL, NULL, 2444.00, 0.00, 2444.00, 6, 8, NULL, NULL, '2024-12-20 04:52:42', '2024-12-20 04:52:42'),
(53, 'BN1734690169', NULL, NULL, 2444.00, 0.00, 2444.00, 6, 8, NULL, NULL, '2024-12-20 04:52:49', '2024-12-20 04:52:49'),
(54, 'BN1734690462', NULL, NULL, 1122.00, 0.00, 1122.00, 6, 8, NULL, NULL, '2024-12-20 04:57:42', '2024-12-20 04:57:42'),
(55, 'BN1734691216', NULL, NULL, 1324.00, 26.48, 1297.52, 6, 8, NULL, NULL, '2024-12-20 05:10:16', '2024-12-20 05:10:16'),
(56, 'BN1734691277', NULL, NULL, 1324.00, 26.48, 1297.52, 6, 8, NULL, NULL, '2024-12-20 05:11:17', '2024-12-20 05:11:17'),
(57, 'BN1734691308', NULL, NULL, 1324.00, 26.48, 1297.52, 6, 8, NULL, NULL, '2024-12-20 05:11:48', '2024-12-20 05:11:48'),
(58, 'BN1734691447', NULL, '1975-09-20', 1849.00, 1812.02, 36.98, 6, 8, NULL, NULL, '2024-12-20 05:14:07', '2024-12-20 05:14:07'),
(59, 'BN1734692379', NULL, '1990-12-21', 889.00, 17.78, 871.22, 6, 6, NULL, NULL, '2024-12-20 05:29:39', '2024-12-20 05:29:39'),
(60, 'BN1734692471', NULL, '1990-12-21', 889.00, 17.78, 871.22, 6, 6, NULL, NULL, '2024-12-20 05:31:11', '2024-12-20 05:31:11'),
(61, 'BN1734692492', NULL, '1985-06-19', 1600.00, 1488.00, 112.00, 6, 6, NULL, NULL, '2024-12-20 05:31:32', '2024-12-20 05:31:32'),
(62, 'BN1734698172', NULL, '1974-12-31', 2787.00, 2647.65, 139.35, 6, 8, NULL, NULL, '2024-12-20 07:06:12', '2024-12-20 07:06:12'),
(63, 'BN1734699054', NULL, '1990-01-21', 4871.00, 4773.58, 97.42, 6, 8, 0, NULL, '2024-12-20 07:20:54', '2024-12-20 07:20:54'),
(64, 'BN1734699123', NULL, '1990-01-21', 1124.00, 22.48, 1101.52, 6, 8, 1, NULL, '2024-12-20 07:22:03', '2024-12-20 07:22:03'),
(65, 'BN1734699221', NULL, '1984-04-14', 4324.00, 3286.24, 1037.76, 6, 8, 1, NULL, '2024-12-20 07:23:41', '2024-12-20 07:23:41'),
(66, 'BN1734699374', NULL, '1984-04-14', 1324.00, 26.48, 1297.52, 6, 8, 1, NULL, '2024-12-20 07:26:14', '2024-12-20 07:26:14'),
(67, 'BN1734701166', NULL, '2019-11-29', 4164.00, 83.28, 4080.72, 6, 8, 1, NULL, '2024-12-20 07:56:06', '2024-12-20 07:56:06'),
(68, 'BN1734701167', NULL, '2019-11-29', 4164.00, 83.28, 4080.72, 6, 8, 1, NULL, '2024-12-20 07:56:07', '2024-12-20 07:56:07'),
(69, 'BN1734763364', NULL, '1988-05-25', 4012.00, 3329.96, 682.04, 6, 8, 0, NULL, '2024-12-21 01:12:44', '2024-12-21 01:12:44'),
(70, 'BN1734763366', NULL, '1988-05-25', 4012.00, 3329.96, 682.04, 6, 8, 0, NULL, '2024-12-21 01:12:46', '2024-12-21 01:12:46'),
(71, 'BN1734763436', NULL, '2016-09-07', 2558.00, 2199.88, 358.12, 6, 8, 1, NULL, '2024-12-21 01:13:56', '2024-12-21 01:13:56'),
(72, 'BN1734763671', NULL, '1979-07-24', 4203.00, 546.39, 3656.61, 6, 8, 1, NULL, '2024-12-21 01:17:51', '2024-12-21 01:17:51'),
(73, 'BN1734763703', NULL, '1993-11-02', 1430.00, 500.50, 929.50, 6, 8, 0, NULL, '2024-12-21 01:18:23', '2024-12-21 01:18:23'),
(74, 'BN1734763796', NULL, '1989-01-09', 4406.00, 1674.28, 2731.72, 6, 8, 0, NULL, '2024-12-21 01:19:56', '2024-12-21 01:19:56'),
(75, 'BN1734763959', NULL, '2004-02-24', 11100.00, 0.00, 11100.00, 6, 8, 0, NULL, '2024-12-21 01:22:39', '2024-12-21 01:22:39'),
(76, 'BN1734764017', NULL, '2004-02-24', 2222.00, 0.00, 2222.00, 6, 8, 1, NULL, '2024-12-21 01:23:37', '2024-12-21 01:23:37'),
(77, 'BN1734764033', NULL, '2004-02-24', 22.00, 0.00, 22.00, 6, 8, 0, NULL, '2024-12-21 01:23:53', '2024-12-21 01:23:53'),
(78, 'BN1734764114', NULL, '2004-02-24', 222.00, 0.00, 222.00, 6, 8, 0, NULL, '2024-12-21 01:25:14', '2024-12-21 01:25:14'),
(79, 'BN1734764189', NULL, '2004-02-24', 22.00, 0.00, 22.00, 6, 8, 0, NULL, '2024-12-21 01:26:29', '2024-12-21 01:26:29'),
(80, 'BN1734764219', NULL, '2004-02-24', 222.00, 0.00, 222.00, 6, 8, 1, NULL, '2024-12-21 01:26:59', '2024-12-21 01:26:59'),
(81, 'BN1734764259', NULL, '2004-02-24', 22.00, 0.00, 22.00, 6, 8, 1, NULL, '2024-12-21 01:27:39', '2024-12-21 01:27:39'),
(82, 'BN1734764293', NULL, '2004-02-24', 22.00, 0.00, 22.00, 6, 8, 1, NULL, '2024-12-21 01:28:13', '2024-12-21 01:28:13'),
(83, 'BN1734764365', NULL, '2004-02-24', 33.00, 0.00, 33.00, 6, 8, 1, NULL, '2024-12-21 01:29:25', '2024-12-21 01:29:25'),
(84, 'BN1734764387', NULL, '2004-02-24', 222.00, 0.00, 222.00, 6, 8, 0, NULL, '2024-12-21 01:29:47', '2024-12-21 01:29:47'),
(85, 'BN1734777401', NULL, '1984-01-08', 2588.00, 2044.52, 543.48, 6, 8, 0, NULL, '2024-12-21 05:06:41', '2024-12-21 05:06:41'),
(86, 'BN1734777536', NULL, '1984-01-08', 3244.00, 0.00, 3244.00, 6, 8, 0, NULL, '2024-12-21 05:08:56', '2024-12-21 05:08:56'),
(87, 'BN1734777605', NULL, '1984-01-08', 333.00, 0.00, 333.00, 6, 8, 0, NULL, '2024-12-21 05:10:05', '2024-12-21 05:10:05'),
(88, 'BN1734934661', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 00:47:41', '2024-12-23 00:47:41'),
(89, 'BN1734935357', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 00:59:17', '2024-12-23 00:59:17'),
(90, 'BN1734935467', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, 0, NULL, '2024-12-23 01:01:07', '2024-12-23 01:01:07'),
(91, 'BN1734935553', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 01:02:33', '2024-12-23 01:02:33'),
(92, 'BN1734935574', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 01:02:54', '2024-12-23 01:02:54'),
(93, 'BN1734936735', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 01:22:15', '2024-12-23 01:22:15'),
(94, 'BN1734936747', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 01:22:27', '2024-12-23 01:22:27'),
(95, 'BN1734936865', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 01:24:25', '2024-12-23 01:24:25'),
(96, 'BN1734936974', NULL, '2024-12-22', 365000.00, 5000.00, 360000.00, 6, 6, NULL, NULL, '2024-12-23 01:26:14', '2024-12-23 01:26:14'),
(97, 'BN1734937122', NULL, '1988-06-12', 335.00, 294.80, 40.20, 6, 8, 1, NULL, '2024-12-23 01:28:42', '2024-12-23 01:28:42'),
(98, 'BN1735032499', NULL, '2024-12-10', 9933.00, 0.00, 9933.00, 6, 8, NULL, NULL, '2024-12-24 03:58:19', '2024-12-24 03:58:19'),
(99, 'BN1735032551', NULL, '2024-12-10', 222.00, 0.00, 222.00, 6, 8, 1, NULL, '2024-12-24 03:59:11', '2024-12-24 03:59:11'),
(100, 'ORD1735117307', NULL, '2024-12-10', 3.00, 0.00, 3.00, 6, 8, NULL, NULL, '2024-12-25 17:01:47', '2024-12-25 17:01:47'),
(101, 'ORD1735129413', NULL, '2024-12-11', 667.00, 1.00, 666.00, 6, 8, NULL, NULL, '2024-12-25 06:53:33', '2024-12-25 06:53:33'),
(102, 'ORD1735129978', NULL, '2024-12-11', 133.98, 0.02, 133.96, 6, 8, NULL, 1, '2024-12-25 07:02:58', '2024-12-25 07:02:58'),
(103, 'ORD1735190860', NULL, '2024-12-19', 100.00, 0.00, 100.00, 6, 8, NULL, 1, '2024-12-25 23:57:40', '2024-12-25 23:57:40'),
(104, 'ORD1735192262', NULL, '2024-12-12', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:21:02', '2024-12-26 00:21:02'),
(105, 'ORD1735192354', NULL, '2024-12-12', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:22:34', '2024-12-26 00:22:34'),
(106, 'ORD1735192538', NULL, '2024-12-12', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:25:38', '2024-12-26 00:25:38'),
(107, 'ORD1735192540', NULL, '2024-12-12', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:25:40', '2024-12-26 00:25:40'),
(108, 'ORD1735192555', NULL, '2024-12-12', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:25:55', '2024-12-26 00:25:55'),
(109, 'ORD1735192656', NULL, '2024-12-19', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:27:36', '2024-12-26 00:27:36'),
(110, 'ORD1735192673', NULL, '2024-12-19', 322.00, 0.00, 322.00, 6, 8, NULL, 1, '2024-12-26 00:27:53', '2024-12-26 00:27:53'),
(111, 'ORD1735194243', NULL, '2024-12-26', 122.00, 0.00, 122.00, 6, 8, NULL, 1, '2024-12-26 00:54:03', '2024-12-26 00:54:03'),
(112, 'ORD1735194255', NULL, '2024-12-26', 122.00, 0.00, 122.00, 6, 8, NULL, 1, '2024-12-26 00:54:15', '2024-12-26 00:54:15'),
(113, 'ORD1735194259', NULL, '2024-12-26', 122.00, 0.00, 122.00, 6, 8, NULL, 1, '2024-12-26 00:54:19', '2024-12-26 00:54:19'),
(114, 'ORD1735194372', NULL, '2024-12-26', 122.00, 0.00, 122.00, 6, 8, NULL, 1, '2024-12-26 00:56:12', '2024-12-26 00:56:12'),
(115, 'ORD1735194403', NULL, '2024-12-26', 122.00, 0.00, 122.00, 6, 8, NULL, 1, '2024-12-26 00:56:43', '2024-12-26 00:56:43'),
(116, 'ORD1735194534', NULL, '2024-12-26', 2321.97, 0.03, 2321.94, 6, 8, NULL, 1, '2024-12-26 00:58:54', '2024-12-26 00:58:54'),
(117, 'ORD1735194650', NULL, '2024-12-26', 255.50, 0.50, 255.00, 6, 8, NULL, 1, '2024-12-26 01:00:50', '2024-12-26 01:00:50'),
(118, 'ORD1735195025', NULL, '2024-12-26', 598.50, 1.50, 597.00, 6, 8, NULL, 1, '2024-12-26 01:07:05', '2024-12-26 01:07:05'),
(119, 'ORD1735195925', NULL, '2024-12-20', 2321.66, 0.34, 2321.32, 6, 8, NULL, 1, '2024-12-26 01:22:05', '2024-12-26 01:22:05'),
(120, 'ORD1735207654', NULL, '2024-12-05', 482.67, 0.33, 482.34, 6, 8, NULL, 1, '2024-12-26 04:37:34', '2024-12-26 04:37:34');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` bigint UNSIGNED NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `making` decimal(8,2) NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gross_weight` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `net_weight` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `stone_weight` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stone_value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `huid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hallmark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `metal_value` decimal(10,0) DEFAULT NULL,
  `making_dsc` decimal(10,2) DEFAULT NULL,
  `pro_total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `product_name`, `making`, `order_id`, `product_code`, `gross_weight`, `net_weight`, `rate`, `stone_weight`, `stone_value`, `huid`, `hallmark`, `created_at`, `updated_at`, `metal_value`, `making_dsc`, `pro_total`) VALUES
(1, '1', 3467.00, 1, 'ret', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 01:14:39', '2024-12-13 01:14:39', NULL, NULL, NULL),
(2, '1', 3467.00, 2, 'ret', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 01:14:47', '2024-12-13 01:14:47', NULL, NULL, NULL),
(3, '1', 3467.00, 3, 'ret', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 01:14:55', '2024-12-13 01:14:55', NULL, NULL, NULL),
(4, '1', 3467.00, 4, 'ret', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 01:15:31', '2024-12-13 01:15:31', NULL, NULL, NULL),
(5, '1', 500.00, 5, 'ret', '3', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 01:16:04', '2024-12-13 01:16:04', NULL, NULL, NULL),
(6, '1', 500.00, 6, 'rr', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 03:02:41', '2024-12-13 03:02:41', NULL, NULL, NULL),
(7, '1', 500.00, 7, 'ret', '22', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-13 03:03:33', '2024-12-13 03:03:33', NULL, NULL, NULL),
(8, '1', 3.00, 8, 'rr', '3', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-16 07:15:00', '2024-12-16 07:15:00', NULL, NULL, NULL),
(9, '1', 3.00, 9, 'rr', '3', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-16 07:15:01', '2024-12-16 07:15:01', NULL, NULL, NULL),
(10, '1', 52000.00, 10, 'ret', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-16 07:16:06', '2024-12-16 07:16:06', NULL, NULL, NULL),
(11, '1', 45.00, 11, 'ret', '33', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-16 07:18:38', '2024-12-16 07:18:38', NULL, NULL, NULL),
(12, '1', 500.00, 12, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 00:38:43', '2024-12-19 00:38:43', NULL, NULL, NULL),
(13, '1', 500.00, 13, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 00:47:06', '2024-12-19 00:47:06', NULL, NULL, NULL),
(14, '1', 500.00, 14, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 00:57:35', '2024-12-19 00:57:35', NULL, NULL, NULL),
(15, '1', 500.00, 15, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 00:58:22', '2024-12-19 00:58:22', NULL, NULL, NULL),
(16, '1', 500.00, 16, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:08:48', '2024-12-19 01:08:48', NULL, NULL, NULL),
(17, '1', 60000.00, 17, 'rr', '5', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:10:38', '2024-12-19 01:10:38', NULL, NULL, NULL),
(18, '1', 9000.00, 18, 'rr', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:12:21', '2024-12-19 01:12:21', NULL, NULL, NULL),
(19, '1', 500.00, 19, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:14:48', '2024-12-19 01:14:48', NULL, NULL, NULL),
(20, '1', 800.00, 20, 'rr', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:15:56', '2024-12-19 01:15:56', NULL, NULL, NULL),
(21, '1', 80000.00, 21, 'rr', '2', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:17:17', '2024-12-19 01:17:17', NULL, NULL, NULL),
(22, '1', 8000.00, 22, 'rr', '22', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:18:26', '2024-12-19 01:18:26', NULL, NULL, NULL),
(23, '1', 522.00, 23, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 01:19:54', '2024-12-19 01:19:54', NULL, NULL, NULL),
(24, '1', 80.00, 24, 'rr', '5', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 04:24:47', '2024-12-19 04:24:47', NULL, NULL, NULL),
(25, '1', 500.00, 25, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 04:25:34', '2024-12-19 04:25:34', NULL, NULL, NULL),
(26, '1', 500.00, 26, 'rr', '44', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 04:48:47', '2024-12-19 04:48:47', NULL, NULL, NULL),
(27, '1', 800.00, 27, 'rr', '55', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 04:56:19', '2024-12-19 04:56:19', NULL, NULL, NULL),
(28, '1', 955.00, 28, 'rr', '85', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:01:36', '2024-12-19 05:01:36', NULL, NULL, NULL),
(29, '1', 955.00, 29, 'rr', '85', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:13:18', '2024-12-19 05:13:18', NULL, NULL, NULL),
(30, '1', 955.00, 30, 'rr', '85', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:13:57', '2024-12-19 05:13:57', NULL, NULL, NULL),
(31, '1', 800.00, 31, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:14:24', '2024-12-19 05:14:24', NULL, NULL, NULL),
(32, '1', 233.00, 32, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:16:31', '2024-12-19 05:16:31', NULL, NULL, NULL),
(33, '1', 899.00, 33, 'rr', '33', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:28:55', '2024-12-19 05:28:55', NULL, NULL, NULL),
(34, '1', 855.00, 34, 'rr', '85', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:29:59', '2024-12-19 05:29:59', NULL, NULL, NULL),
(35, '1', 500.00, 35, 'rr', '8', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-19 05:34:46', '2024-12-19 05:34:46', NULL, NULL, NULL),
(36, '1', 566.00, 36, 'rr', '0', '3', NULL, NULL, NULL, NULL, NULL, '2024-12-20 01:55:31', '2024-12-20 01:55:31', NULL, NULL, NULL),
(37, '1', 44444.00, 37, 'rr', '4', '4', NULL, NULL, NULL, NULL, NULL, '2024-12-20 01:59:13', '2024-12-20 01:59:13', NULL, NULL, NULL),
(38, '1', 344.00, 38, 'rr', '22', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:00:13', '2024-12-20 02:00:13', NULL, NULL, NULL),
(39, '1', 444.00, 39, 'rr', '4', '4', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:02:21', '2024-12-20 02:02:21', NULL, NULL, NULL),
(40, '1', 455.00, 40, 'rr', '0', '33', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:13:46', '2024-12-20 02:13:46', NULL, NULL, NULL),
(41, '1', 3444.00, 41, 'rr', '44', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:40:03', '2024-12-20 02:40:03', NULL, NULL, NULL),
(42, '1', 3444.00, 42, 'rr', '44', '0', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:40:04', '2024-12-20 02:40:04', NULL, NULL, NULL),
(43, '1', 3456.00, 43, 'rr', '0', '33', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:41:03', '2024-12-20 02:41:03', NULL, NULL, NULL),
(44, '1', 2345.00, 44, 'rr', '0', '22', NULL, NULL, NULL, NULL, NULL, '2024-12-20 02:45:03', '2024-12-20 02:45:03', NULL, NULL, NULL),
(45, '1', 33.00, 45, 'rr', '0', '23', NULL, NULL, NULL, NULL, NULL, '2024-12-20 03:42:12', '2024-12-20 03:42:12', NULL, NULL, NULL),
(46, '1', 33.00, 46, 'rr', '0', '33', NULL, NULL, NULL, NULL, NULL, '2024-12-20 03:56:29', '2024-12-20 03:56:29', NULL, NULL, NULL),
(47, '1', 33.00, 47, 'rr', '0', '3', NULL, NULL, NULL, NULL, NULL, '2024-12-20 03:56:56', '2024-12-20 03:56:56', NULL, NULL, NULL),
(48, '1', 222.00, 48, 'rr', '0', '22', NULL, NULL, NULL, NULL, NULL, '2024-12-20 04:09:59', '2024-12-20 04:09:59', NULL, NULL, NULL),
(49, '1', 22.00, 49, 'rr', '0', '12', NULL, NULL, NULL, NULL, NULL, '2024-12-20 04:12:46', '2024-12-20 04:12:46', NULL, NULL, NULL),
(50, '1', 22.00, 50, 'rr', '0', '2', NULL, NULL, NULL, NULL, NULL, '2024-12-20 04:13:26', '2024-12-20 04:13:26', NULL, NULL, NULL),
(51, '1', 2.00, 51, 'rr', '0', '2', NULL, NULL, NULL, NULL, NULL, '2024-12-20 04:15:03', '2024-12-20 04:15:03', NULL, NULL, NULL),
(52, 'Baby bala', 222.00, 57, 'rr', '22', '22', NULL, NULL, NULL, NULL, NULL, '2024-12-20 05:11:48', '2024-12-20 05:11:48', NULL, NULL, NULL),
(53, 'Baby bala', 59.00, 58, 'rr', '43', '34', NULL, NULL, NULL, NULL, NULL, '2024-12-20 05:14:07', '2024-12-20 05:14:07', NULL, NULL, NULL),
(54, 'Baby bala', 35.00, 60, 'rr', '39', '17', 50.00, '6', '48', '2', '2', '2024-12-20 05:31:11', '2024-12-20 05:31:11', NULL, NULL, NULL),
(55, 'Baby bala', 89.00, 61, 'rr', '73', '29', 50.00, '88', '44', '3', '3', '2024-12-20 05:31:32', '2024-12-20 05:31:32', NULL, NULL, NULL),
(56, 'Baby bala', 52.00, 62, 'rr', '100', '54', 50.00, '88', '16', '2', '2', '2024-12-20 07:06:12', '2024-12-20 07:06:12', NULL, NULL, NULL),
(57, 'Baby bala', 5.00, 63, 'rr', '56', '97', 50.00, '20', '84', '22', '22', '2024-12-20 07:20:55', '2024-12-20 07:20:55', NULL, NULL, NULL),
(58, 'Baby bala', 22.00, 64, 'rr', '22', '22', 50.00, '22', '22', '22', '222', '2024-12-20 07:22:03', '2024-12-20 07:22:03', NULL, NULL, NULL),
(59, 'Baby bala', 26.00, 65, 'rr', '27', '85', 50.00, '36', '8', '22', '22', '2024-12-20 07:23:41', '2024-12-20 07:23:41', NULL, NULL, NULL),
(60, 'Baby bala', 222.00, 66, 'rr', '22', '22', 50.00, '2', '2', '2', '2', '2024-12-20 07:26:14', '2024-12-20 07:26:14', NULL, NULL, NULL),
(61, 'Baby bala', 80.00, 67, 'rr', '96', '80', 50.00, '15', '13', '33', '33', '2024-12-20 07:56:06', '2024-12-20 07:56:06', NULL, NULL, NULL),
(62, 'Baby bala', 80.00, 68, 'rr', '96', '80', 50.00, '15', '13', '33', '33', '2024-12-20 07:56:07', '2024-12-20 07:56:07', NULL, NULL, NULL),
(63, 'Baby bala', 79.00, 69, 'rr', '19', '77', 50.00, '46', '62', '22', '22', '2024-12-21 01:12:45', '2024-12-21 01:12:45', NULL, NULL, NULL),
(64, 'Baby bala', 79.00, 70, 'rr', '19', '77', 50.00, '46', '62', '22', '22', '2024-12-21 01:12:46', '2024-12-21 01:12:46', NULL, NULL, NULL),
(65, 'Baby bala', 43.00, 71, 'rr', '99', '50', 50.00, '75', '20', '22', '22', '2024-12-21 01:13:56', '2024-12-21 01:13:56', NULL, NULL, NULL),
(66, 'Baby bala', 90.00, 72, 'rr', '68', '82', 50.00, '19', '47', '33', '33', '2024-12-21 01:17:51', '2024-12-21 01:17:51', NULL, NULL, NULL),
(67, 'Baby bala', 84.00, 73, 'rr', '53', '25', 50.00, '68', '54', 'Laboriosam voluptas', 'Excepturi aliqua Fu', '2024-12-21 01:18:23', '2024-12-21 01:18:23', NULL, NULL, NULL),
(68, 'Baby bala', 72.00, 74, 'rr', '18', '86', 50.00, '45', '11', '22', '22', '2024-12-21 01:19:56', '2024-12-21 01:19:56', NULL, NULL, NULL),
(69, 'Baby bala', 0.00, 75, 'rr', '22', '222', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:22:39', '2024-12-21 01:22:39', NULL, NULL, NULL),
(70, 'Baby bala', 2222.00, 76, 'rr', '22', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:23:37', '2024-12-21 01:23:37', NULL, NULL, NULL),
(71, 'Baby bala', 22.00, 77, 'rr', '2', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:23:53', '2024-12-21 01:23:53', NULL, NULL, NULL),
(72, 'Baby bala', 222.00, 78, 'rr', '22', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:25:14', '2024-12-21 01:25:14', NULL, NULL, NULL),
(73, 'Baby bala', 22.00, 79, 'rr', '2', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:26:29', '2024-12-21 01:26:29', NULL, NULL, NULL),
(74, 'Baby bala', 222.00, 80, 'rr', '22', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:26:59', '2024-12-21 01:26:59', NULL, NULL, NULL),
(75, 'Baby bala', 22.00, 81, 'rr', '2', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:27:39', '2024-12-21 01:27:39', NULL, NULL, NULL),
(76, 'Baby bala', 22.00, 82, 'rr', '2', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:28:13', '2024-12-21 01:28:13', NULL, NULL, NULL),
(77, 'Baby bala', 33.00, 83, 'rr', '3', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:29:25', '2024-12-21 01:29:25', NULL, NULL, NULL),
(78, 'Baby bala', 222.00, 84, 'rr', '22', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 01:29:47', '2024-12-21 01:29:47', NULL, NULL, NULL),
(79, 'Baby bala', 75.00, 85, 'rr', '10', '49', 50.00, '81', '6', '33', '3', '2024-12-21 05:06:41', '2024-12-21 05:06:41', NULL, NULL, NULL),
(80, '24 carat gold', 3244.00, 86, 'ret', '22', '0', 200.00, '0', '0', NULL, NULL, '2024-12-21 05:08:56', '2024-12-21 05:08:56', NULL, NULL, NULL),
(81, 'Baby bala', 333.00, 87, 'rr', '23', '0', 50.00, '0', '0', NULL, NULL, '2024-12-21 05:10:05', '2024-12-21 05:10:05', NULL, NULL, NULL),
(82, 'Gold Ring', 500.00, 88, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 00:47:41', '2024-12-23 00:47:41', NULL, NULL, NULL),
(83, 'Gold Necklace', 1500.00, 88, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 00:47:41', '2024-12-23 00:47:41', NULL, NULL, NULL),
(84, 'Gold Ring', 500.00, 89, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 00:59:17', '2024-12-23 00:59:17', NULL, NULL, NULL),
(85, 'Gold Necklace', 1500.00, 89, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 00:59:17', '2024-12-23 00:59:17', NULL, NULL, NULL),
(86, 'Gold Ring', 500.00, 91, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 01:02:33', '2024-12-23 01:02:33', NULL, NULL, NULL),
(87, 'Gold Necklace', 1500.00, 91, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 01:02:33', '2024-12-23 01:02:33', NULL, NULL, NULL),
(88, 'Gold Ring', 500.00, 92, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 01:02:54', '2024-12-23 01:02:54', NULL, NULL, NULL),
(89, 'Gold Necklace', 1500.00, 92, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 01:02:54', '2024-12-23 01:02:54', NULL, NULL, NULL),
(90, 'Gold Ring', 500.00, 93, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 01:22:16', '2024-12-23 01:22:16', NULL, NULL, NULL),
(91, 'Gold Necklace', 1500.00, 93, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 01:22:16', '2024-12-23 01:22:16', NULL, NULL, NULL),
(92, 'Gold Ring', 500.00, 94, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 01:22:27', '2024-12-23 01:22:27', NULL, NULL, NULL),
(93, 'Gold Necklace', 1500.00, 94, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 01:22:27', '2024-12-23 01:22:27', NULL, NULL, NULL),
(94, 'Gold Ring', 500.00, 95, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 01:24:25', '2024-12-23 01:24:25', NULL, NULL, NULL),
(95, 'Gold Necklace', 1500.00, 95, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 01:24:25', '2024-12-23 01:24:25', NULL, NULL, NULL),
(96, 'Gold Ring', 500.00, 96, 'GR001', '10.5', '9.8', 60000.00, '0.5', '2000', 'HUID1234', '22K', '2024-12-23 01:26:14', '2024-12-23 01:26:14', NULL, NULL, NULL),
(97, 'Gold Necklace', 1500.00, 96, 'GN001', '50', '45', 70000.00, '5', '10000', 'HUID5678', '22K', '2024-12-23 01:26:14', '2024-12-23 01:26:14', NULL, NULL, NULL),
(98, 'Baby bala', 98.00, 97, 'rr', '29', '3', 50.00, '80', '54', '22', '22', '2024-12-23 01:28:42', '2024-12-23 01:28:42', NULL, NULL, NULL),
(99, '24 carat gold', 3333.00, 98, 'ret', '33', '33', 200.00, '0', '0', NULL, NULL, '2024-12-24 03:58:19', '2024-12-24 03:58:19', NULL, NULL, NULL),
(100, 'Baby bala', 222.00, 99, 'rr', '22', '0', 50.00, '0', '0', NULL, NULL, '2024-12-24 03:59:11', '2024-12-24 03:59:11', NULL, NULL, NULL),
(101, 'Baby bala', 3.00, 100, 'rr', '3', '0', 50.00, '0', '0', NULL, NULL, '2024-12-25 17:01:47', '2024-12-25 17:01:47', NULL, NULL, NULL),
(102, 'Baby bala', 34.00, 101, 'rr', '2', '2', 50.00, '4', '44', NULL, NULL, '2024-12-25 06:53:33', '2024-12-25 06:53:33', NULL, NULL, NULL),
(103, 'Baby bala', 34.00, 101, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-25 06:53:33', '2024-12-25 06:53:33', NULL, NULL, NULL),
(104, '24 carat gold', 0.00, 101, 'ret', '0', '0', 200.00, '0', '0', NULL, NULL, '2024-12-25 06:53:33', '2024-12-25 06:53:33', NULL, NULL, NULL),
(105, 'Baby bala', 34.00, 102, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-25 07:02:59', '2024-12-25 07:02:59', NULL, NULL, NULL),
(106, 'Baby bala', 0.00, 103, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-25 23:57:41', '2024-12-25 23:57:41', NULL, NULL, NULL),
(107, 'Baby bala', 22.00, 115, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-26 00:56:43', '2024-12-26 00:56:43', 100, 22.00, NULL),
(108, 'Baby bala', 2222.00, 116, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-26 00:58:54', '2024-12-26 00:58:54', 100, 2222.00, NULL),
(109, 'Baby bala', 156.00, 117, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-26 01:00:50', '2024-12-26 01:00:50', 100, 156.00, NULL),
(110, 'Baby bala', 500.00, 118, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-26 01:07:05', '2024-12-26 01:07:05', 100, 498.50, NULL),
(111, 'Baby bala', 2222.00, 119, 'rr', '2', '2', 50.00, '0', '0', NULL, NULL, '2024-12-26 01:22:05', '2024-12-26 01:22:05', 100, 2221.66, 2321.66),
(112, 'Baby bala', 333.00, 120, 'rr', '3', '3', 50.00, '0', '0', NULL, NULL, '2024-12-26 04:37:35', '2024-12-26 04:37:35', 150, 332.67, 482.67);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `customer_id` bigint UNSIGNED NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payment_method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `customer_id`, `payment_date`, `created_at`, `updated_at`, `payment_method`, `price`) VALUES
(1, 4, 1, '2024-12-13', '2024-12-13 01:15:31', '2024-12-13 01:15:31', '1', NULL),
(2, 5, 1, '2024-12-13', '2024-12-13 01:16:04', '2024-12-13 01:16:04', '1', NULL),
(3, 6, 1, '2024-12-13', '2024-12-13 03:02:41', '2024-12-13 03:02:41', '1', NULL),
(4, 7, 1, '2024-12-13', '2024-12-13 03:03:33', '2024-12-13 03:03:33', '1', NULL),
(5, 8, 1, '2024-12-16', '2024-12-16 07:15:00', '2024-12-16 07:15:00', '1', NULL),
(6, 9, 1, '2024-12-16', '2024-12-16 07:15:01', '2024-12-16 07:15:01', '1', NULL),
(7, 10, 1, '2024-12-16', '2024-12-16 07:16:06', '2024-12-16 07:16:06', '1', NULL),
(8, 11, 1, '2024-12-16', '2024-12-16 07:18:38', '2024-12-16 07:18:38', '1', NULL),
(9, 12, 1, '2024-12-19', '2024-12-19 00:38:43', '2024-12-19 00:38:43', '1', NULL),
(10, 13, 1, '2024-12-19', '2024-12-19 00:47:06', '2024-12-19 00:47:06', '1', NULL),
(11, 14, 1, '2024-12-19', '2024-12-19 00:57:35', '2024-12-19 00:57:35', '1', NULL),
(12, 15, 1, '2024-12-19', '2024-12-19 00:58:22', '2024-12-19 00:58:22', '1', NULL),
(13, 16, 1, '2024-12-19', '2024-12-19 01:08:48', '2024-12-19 01:08:48', '1', NULL),
(14, 17, 1, '2024-12-19', '2024-12-19 01:10:38', '2024-12-19 01:10:38', '1', NULL),
(15, 18, 1, '2024-12-19', '2024-12-19 01:12:21', '2024-12-19 01:12:21', '1', NULL),
(16, 19, 1, '2024-12-19', '2024-12-19 01:14:48', '2024-12-19 01:14:48', '1', NULL),
(17, 20, 1, '2024-12-19', '2024-12-19 01:15:56', '2024-12-19 01:15:56', '1', NULL),
(18, 21, 1, '2024-12-19', '2024-12-19 01:17:17', '2024-12-19 01:17:17', '1', NULL),
(19, 22, 1, '2024-12-19', '2024-12-19 01:18:26', '2024-12-19 01:18:26', '1', NULL),
(20, 23, 1, '2024-12-19', '2024-12-19 01:19:54', '2024-12-19 01:19:54', '1', NULL),
(21, 24, 1, '2024-12-19', '2024-12-19 04:24:47', '2024-12-19 04:24:47', '1', NULL),
(22, 25, 1, '2024-12-19', '2024-12-19 04:25:34', '2024-12-19 04:25:34', '1', NULL),
(23, 26, 1, '2024-12-19', '2024-12-19 04:48:47', '2024-12-19 04:48:47', '1', NULL),
(24, 27, 1, '2024-12-19', '2024-12-19 04:56:19', '2024-12-19 04:56:19', '1', NULL),
(25, 30, 1, '2024-12-19', '2024-12-19 05:13:57', '2024-12-19 05:13:57', NULL, NULL),
(26, 31, 1, '2024-12-19', '2024-12-19 05:14:24', '2024-12-19 05:14:24', NULL, NULL),
(27, 32, 1, '2024-12-19', '2024-12-19 05:16:31', '2024-12-19 05:16:31', 'upi', NULL),
(28, 33, 1, '2024-12-19', '2024-12-19 05:28:55', '2024-12-19 05:28:55', 'cash', NULL),
(29, 34, 1, '2024-12-19', '2024-12-19 05:29:59', '2024-12-19 05:29:59', 'cash', NULL),
(30, 35, 1, '2024-12-19', '2024-12-19 05:34:47', '2024-12-19 05:34:47', 'cash', 100),
(31, 36, 1, '2024-12-20', '2024-12-20 01:55:31', '2024-12-20 01:55:31', 'cash', 100),
(32, 37, 1, '2024-12-20', '2024-12-20 01:59:13', '2024-12-20 01:59:13', 'cash', 100),
(33, 38, 1, '2024-12-20', '2024-12-20 02:00:13', '2024-12-20 02:00:13', 'cash', 20),
(34, 39, 1, '2024-12-20', '2024-12-20 02:02:21', '2024-12-20 02:02:21', 'upi', 644),
(35, 40, 1, '2024-12-20', '2024-12-20 02:13:46', '2024-12-20 02:13:46', 'card', 2105),
(36, 41, 1, '2024-12-20', '2024-12-20 02:40:03', '2024-12-20 02:40:03', 'card', 3444),
(37, 42, 1, '2024-12-20', '2024-12-20 02:40:04', '2024-12-20 02:40:04', 'card', 3444),
(38, 43, 1, '2024-12-20', '2024-12-20 02:41:03', '2024-12-20 02:41:03', 'upi', 5106),
(39, 44, 1, '2024-12-20', '2024-12-20 02:45:03', '2024-12-20 02:45:03', 'card', 3445),
(40, 45, 1, '2024-12-20', '2024-12-20 03:42:12', '2024-12-20 03:42:12', 'card', 1183),
(41, 46, 1, '2024-12-20', '2024-12-20 03:56:29', '2024-12-20 03:56:29', 'card', 1683),
(42, 47, 1, '2024-12-20', '2024-12-20 03:56:56', '2024-12-20 03:56:56', 'upi', 183),
(43, 48, 1, '2024-12-20', '2024-12-20 04:09:59', '2024-12-20 04:09:59', 'card', 1322),
(44, 49, 1, '2024-12-20', '2024-12-20 04:12:46', '2024-12-20 04:12:46', 'upi', 622),
(45, 50, 1, '2024-12-20', '2024-12-20 04:13:26', '2024-12-20 04:13:26', 'card', 122),
(46, 51, 1, '2024-12-20', '2024-12-20 04:15:03', '2024-12-20 04:15:03', 'upi', 102),
(47, 57, 1, '2024-12-20', '2024-12-20 05:11:48', '2024-12-20 05:11:48', 'card', 1324),
(48, 58, 1, '2024-12-20', '2024-12-20 05:14:07', '2024-12-20 05:14:07', 'card', 1849),
(49, 60, 6, '2024-12-20', '2024-12-20 05:31:11', '2024-12-20 05:31:11', 'card', 889),
(50, 61, 6, '2024-12-20', '2024-12-20 05:31:33', '2024-12-20 05:31:33', 'card', 889),
(51, 62, 8, '2024-12-20', '2024-12-20 07:06:12', '2024-12-20 07:06:12', 'card', 2787),
(52, 63, 8, '2024-12-20', '2024-12-20 07:20:55', '2024-12-20 07:20:55', 'card', 4871),
(53, 64, 8, '2024-12-20', '2024-12-20 07:22:03', '2024-12-20 07:22:03', 'upi', 1124),
(54, 65, 8, '2024-12-20', '2024-12-20 07:23:41', '2024-12-20 07:23:41', 'adjust', 0),
(55, 66, 8, '2024-12-20', '2024-12-20 07:26:14', '2024-12-20 07:26:14', 'upi', 1324),
(56, 67, 8, '2024-12-20', '2024-12-20 07:56:06', '2024-12-20 07:56:06', 'cash', 4164),
(57, 68, 8, '2024-12-20', '2024-12-20 07:56:07', '2024-12-20 07:56:07', 'cash', 4164),
(58, 69, 8, '2024-12-21', '2024-12-21 01:12:45', '2024-12-21 01:12:45', 'card', 4012),
(59, 70, 8, '2024-12-21', '2024-12-21 01:12:46', '2024-12-21 01:12:46', 'card', 4012),
(60, 71, 8, '2024-12-21', '2024-12-21 01:13:56', '2024-12-21 01:13:56', 'card', 4012),
(61, 72, 8, '2024-12-21', '2024-12-21 01:17:51', '2024-12-21 01:17:51', 'card', 4012),
(62, 73, 8, '2024-12-21', '2024-12-21 01:18:23', '2024-12-21 01:18:23', 'card', 4012),
(63, 74, 8, '2024-12-21', '2024-12-21 01:19:56', '2024-12-21 01:19:56', 'card', 4406),
(64, 75, 8, '2024-12-21', '2024-12-21 01:22:39', '2024-12-21 01:22:39', 'card', 4406),
(65, 76, 8, '2024-12-21', '2024-12-21 01:23:37', '2024-12-21 01:23:37', 'card', 4406),
(66, 77, 8, '2024-12-21', '2024-12-21 01:23:53', '2024-12-21 01:23:53', 'card', 4406),
(67, 78, 8, '2024-12-21', '2024-12-21 01:25:14', '2024-12-21 01:25:14', 'card', 4406),
(68, 79, 8, '2024-12-21', '2024-12-21 01:26:29', '2024-12-21 01:26:29', 'card', 4406),
(69, 80, 8, '2024-12-21', '2024-12-21 01:26:59', '2024-12-21 01:26:59', 'card', 4406),
(70, 81, 8, '2024-12-21', '2024-12-21 01:27:39', '2024-12-21 01:27:39', 'card', 4406),
(71, 82, 8, '2024-12-21', '2024-12-21 01:28:13', '2024-12-21 01:28:13', 'adjust', 0),
(72, 83, 8, '2024-12-21', '2024-12-21 01:29:25', '2024-12-21 01:29:25', 'adjust', 0),
(73, 84, 8, '2024-12-21', '2024-12-21 01:29:47', '2024-12-21 01:29:47', 'adjust', 0),
(74, 85, 8, '2024-12-21', '2024-12-21 05:06:41', '2024-12-21 05:06:41', 'card', 2588),
(75, 86, 8, '2024-12-21', '2024-12-21 05:08:56', '2024-12-21 05:08:56', 'cash', 100),
(76, 87, 8, '2024-12-21', '2024-12-21 05:10:05', '2024-12-21 05:10:05', 'cash', 333),
(77, 88, 6, '2024-12-23', '2024-12-23 00:47:41', '2024-12-23 00:47:41', 'online', 50),
(78, 89, 6, '2024-12-23', '2024-12-23 00:59:17', '2024-12-23 00:59:17', 'online', 50),
(79, 91, 6, '2024-12-23', '2024-12-23 01:02:33', '2024-12-23 01:02:33', 'online', 50),
(80, 92, 6, '2024-12-23', '2024-12-23 01:02:54', '2024-12-23 01:02:54', 'online', 50),
(81, 93, 6, '2024-12-23', '2024-12-23 01:22:16', '2024-12-23 01:22:16', 'online', 50),
(82, 94, 6, '2024-12-23', '2024-12-23 01:22:27', '2024-12-23 01:22:27', 'online', 50),
(83, 95, 6, '2024-12-23', '2024-12-23 01:24:25', '2024-12-23 01:24:25', 'online', 50),
(84, 96, 6, '2024-12-23', '2024-12-23 01:26:14', '2024-12-23 01:26:14', 'online', 50),
(85, 97, 8, '2024-12-23', '2024-12-23 01:28:42', '2024-12-23 01:28:42', 'card', 335),
(86, 98, 8, '2024-12-24', '2024-12-24 03:58:19', '2024-12-24 03:58:19', 'card', 9933),
(87, 99, 8, '2024-12-24', '2024-12-24 03:59:11', '2024-12-24 03:59:11', 'card', 9933),
(88, 100, 8, '2024-12-25', '2024-12-25 17:01:47', '2024-12-25 17:01:47', 'card', 3),
(89, 101, 8, '2024-12-25', '2024-12-25 06:53:33', '2024-12-25 06:53:33', 'card', 667),
(90, 102, 8, '2024-12-25', '2024-12-25 07:02:59', '2024-12-25 07:02:59', 'upi', 134),
(91, 103, 8, '2024-12-26', '2024-12-25 23:57:41', '2024-12-25 23:57:41', 'cash', 100),
(92, 115, 8, '2024-12-26', '2024-12-26 00:56:43', '2024-12-26 00:56:43', 'cash', 122),
(93, 116, 8, '2024-12-26', '2024-12-26 00:58:54', '2024-12-26 00:58:54', 'cash', 122),
(94, 117, 8, '2024-12-26', '2024-12-26 01:00:50', '2024-12-26 01:00:50', 'cash', 122),
(95, 118, 8, '2024-12-26', '2024-12-26 01:07:05', '2024-12-26 01:07:05', 'cash', 122),
(96, 119, 8, '2024-12-26', '2024-12-26 01:22:05', '2024-12-26 01:22:05', 'cash', 2322),
(97, 120, 8, '2024-12-26', '2024-12-26 04:37:35', '2024-12-26 04:37:35', 'cash', 483);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'create distributer', 'web', '2024-12-26 07:24:49', '2024-12-26 07:24:49'),
(2, 'edit distributer', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(3, 'delete distributer', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(4, 'view distributer', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(5, 'create salesperson', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(6, 'edit salesperson', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(7, 'delete salesperson', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(8, 'view salesperson', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(9, 'create customers', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(10, 'edit customers', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(11, 'delete customers', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50'),
(12, 'view customers', 'web', '2024-12-26 07:24:50', '2024-12-26 07:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `image`, `amount`, `description`, `created_at`, `updated_at`) VALUES
(1, 'SALOON', 'products/1735566063_1880-Saloon-1-3757694646.jpg', 0.00, '<ul><li>Data Management</li><li>Campaign Management</li><li>Segmentation And Targeting</li><li>Analytics And Reporting</li><li>SaaS Based Model</li></ul>', '2024-11-30 00:26:47', '2024-12-30 08:11:03'),
(2, 'MARKETING AUTOMATION', 'products/1732946296_pricing.png', 0.00, '<ul><li>Bring back lost customers</li><li>Covert non-buyers to buyers</li><li>Instant Alerts</li><li>WhatsApp Messaging</li><li>Chatbot integration</li><li>Feedback management</li><li>WhatsApp Messaging</li></ul>', '2024-11-30 00:28:16', '2024-11-30 00:28:16'),
(3, 'SALES', 'products/1732946345_pricing.png', 0.00, '<ul><li>Local Database Targeting</li><li>Packages/Bundling</li><li>Subscription Management</li><li>Referral Management</li><li>Loyalty programs</li></ul><p><br>&nbsp;</p>', '2024-11-30 00:29:05', '2024-11-30 00:29:05'),
(4, 'CRM', 'products/1735565475_unnamed.jpg', 500.00, NULL, '2024-12-30 08:01:15', '2024-12-30 08:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `product_services`
--

CREATE TABLE `product_services` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `staff_commission` decimal(10,2) DEFAULT NULL,
  `gst_input` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_output` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hsn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_maintain` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_services`
--

INSERT INTO `product_services` (`id`, `name`, `type`, `code`, `company_id`, `group_id`, `rate_type`, `image`, `rate`, `mrp`, `staff_commission`, `gst_input`, `gst_output`, `hsn`, `stock_maintain`, `created_at`, `updated_at`) VALUES
(1, '24 carat gold', '1', 'ret', '1', '1', '1', 'images/INdwyFVP2LqsJ1Mo5WKEZiUzKlZFjHeOdwYflBnw.jpg', 200.00, NULL, NULL, NULL, NULL, 'ree', 0, '2024-12-13 01:10:00', '2024-12-13 01:10:00'),
(2, 'Baby bala', '1', 'rr', '1', '1', '1', 'images/IppdAQiiUq5RLvnml3QfxECO0oSNbAIFRzOBggGG.jpg', 50.00, NULL, NULL, NULL, NULL, '45', 0, '2024-12-13 01:11:49', '2024-12-13 01:11:49');

-- --------------------------------------------------------

--
-- Table structure for table `product_service_groups`
--

CREATE TABLE `product_service_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_service_groups`
--

INSERT INTO `product_service_groups` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'efe', '2024-12-13 01:05:12', '2024-12-13 01:05:12');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` bigint UNSIGNED NOT NULL,
  `voucher_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `bill_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_igst` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` bigint UNSIGNED NOT NULL,
  `payment_mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `credit_days` int NOT NULL DEFAULT '0',
  `discount` int NOT NULL DEFAULT '0',
  `credit_note` int NOT NULL DEFAULT '0',
  `addition` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` bigint UNSIGNED NOT NULL,
  `purchase_id` bigint UNSIGNED NOT NULL,
  `product_service_id` bigint UNSIGNED NOT NULL,
  `pcs` decimal(10,2) NOT NULL DEFAULT '0.00',
  `gwt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `nwt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `rate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `other_chg` decimal(10,2) NOT NULL DEFAULT '0.00',
  `disc` int NOT NULL DEFAULT '0',
  `disc_percent` int NOT NULL DEFAULT '0',
  `gst` decimal(10,2) NOT NULL DEFAULT '0.00',
  `taxable` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_gst` decimal(10,2) NOT NULL DEFAULT '0.00',
  `net_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rates`
--

CREATE TABLE `rates` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rates`
--

INSERT INTO `rates` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'demorate', '2024-12-13 01:06:02', '2024-12-13 01:06:02');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2024-12-26 07:27:46', '2024-12-26 07:27:46'),
(2, 'jwellery', 'web', '2024-12-26 07:27:46', '2024-12-26 07:27:46'),
(3, 'distributor', 'web', '2024-12-26 07:27:46', '2024-12-26 07:27:46');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sales_assigns`
--

CREATE TABLE `sales_assigns` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale_products`
--

CREATE TABLE `sale_products` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint UNSIGNED NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0hKedt7TQ9DuVAPmuWBUYtdJbORu7CIdJQ72YftS', NULL, '104.166.80.38', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnlTSVhGNHdjS2pLS2gwY2FKOExnYUhZaFNVSVRiUFFnZnNmZ3hHRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733674404),
('14VVdhzW3OLQzu2mJMKSAcDgWXE0w3YIcw52UOE0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjhYSlYyUkEwOVR0YnNpQ1lvOGg0aWliSk1ZT1hlZHg4UVpyOWozeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvb3JkZXJzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1735196953),
('1inPGxP1qgiltuLUlH4hGaJuTopGS0fE05Veexih', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkVTMWdSczFNeFcwVnd1UER0Wnp3Q2thUWhnS2NnMVRCOVJjeUJtNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735102244),
('2gmrvnodygflDpyllxHXneOTJM0RqheIB8slh2E4', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSm5tR3JVZ2NxZTBza2tHNHZ2RzFxTWFNZU1iUlhNd2gwRW04VTNFZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735056243),
('2IjEk7dbjzmAimnyA3bDQnIjyHn1zBfbPUQ2DtaQ', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWQxNFNXcHZkTXk3cmMxWXlYbGU5ZjdMMEVuSDB6T25BNGd6akRsZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735032246),
('2K0tvFlvUVuJHqs8ht2McYmjZ0IHpc0VdHPGPVZX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU3A3RmFiM2gzYmplRjBMWmdmUEhScXN6dlpUQVdwcnY0YmNIeWs4aSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1735223089),
('3IqIz7tfip1mutvCAN5W7znNfqf47KJyc8yquAd4', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQzUyaUtUWXcxdWlaVzB5WkR6NGJ4YmJZbU9hOHRWR09iRTlKTFFHMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735032826),
('3TvfJlKyUm1Wj9lf6iOvAZADaoaZQajaDNXU6Vf7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYm5lOVVLdm1KQ0Jwbmtjak0yRFd6Skx2ZjBCWHNOZjNOcEtsQ25NaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734931851),
('4Usfb8OnW5qLVR0zIjGba6DaEHNtXkiTqkHoSiyc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnV6RWQyT0tSSU80NG50YUlhanRGUFR6MDFvWTM2ajEyM2ptRmVnUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734932623),
('4ZcOLCPm6gd4hO5fPFgBL7gRb93BiTHFWhvVtjWY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEhPcDZzZWpjQXp0TG1aeXR1aWlCMDFKY1Zubml5UFJjSEZQUXJndSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734071549),
('4zxlVv293a8BwbPvMvgyqab1BhZxtAAN2acUvH1I', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFZWQlJabjN5ZHZMS1VPUnR6S3lSbHRTb1ZDVUg0RGdyRXhRRDRUQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvb3JkZXJzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1735196954),
('5CRmb50v5qxukuC3q6fP9Kn5AiyJxPMnc5nZaXoT', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlk4VUpGazFBcE04NWtkN1dPY0NmWnF4a2ZGdzd6QVU5UWJOS2x6RSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735102244),
('6eg13Esj1yX98LNfywmIcOLKLxxnfpj6mWeCgZZ9', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnFUd1B0OFhSZ211c2Q0R3d5NFU5SXBoZW5Vam43b2l2ZTltTzIyNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114824),
('6ubqzMwcqYRjmhDlYLV8WyKcfq0PtbnQyoBXDyxm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZVBGTDQxOHcxWWl4WHZRc0JaaHBxUFJXVlZxN1hVaDk3TzJJVGk0NyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735983632),
('6YPDCVhPdQNjdru4o245KxenheGSR6KRTfBjoTAN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicW5sQWRhZnk0N3hIVXdRZDhMY3drYmRvZjR2WmliOE5aaXgzcE5vRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734071540),
('75KBJPJ17Uph75lSzt88BnSFKeDAoCOD0Eum5EqY', NULL, '2a06:4880:3000::3e', 'Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3ZQWDN0MWx0S3VWZHQ4amxISHk4ZXh6MjdOT3FFZld4YXZuYWc1RiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733694945),
('8c1fql6eXozLtjldgsapXRkKHqWpp6RnYpxqjXiB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHIwTmVScHV2cWlaY1dsekNWS0lSNE5iaEtNRnFCTjY3Z21PcDllZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735564958),
('8LxHYvfaS4YgJ5AN6nHRbs1D1ukpXJ92AUqMToe7', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWgxbGdOTW1JNGdkbFI0NDQ2U1AxbUZSVnBKV0xTR0ZTcVg0b05zYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735056324),
('8pFb6Awig3XPXVgxz6NXTyKseHypqOEfMq2bC4Mf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0R1a3pXZDhGVjBFa2s2VE11cWpLNm9ibHJEcjNLWVhHbWk1ejRyUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735190289),
('9rK7tyJq1TraX5mBAzc3jjYqpSmLgFKTr9bvLrW9', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2V3cVIyQlRuQ2I5QXJCd0lhTlhnMkRBaWtzbE9UTTZFMk9DYkxVNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735802810),
('9TCQAk1ZIWqhw2DRVsDS918MjERvZnKlo28kn1u9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzJmd2EyYUh6ZXBRMHh0RnRZekVOdG9kVHY4TXhZMHhJTE5uRFo0SyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735983580),
('9VLyAFQF2bpYkfkUbF4k5HUwskpQGxIaTRWIqMWn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDA3R0daa1dQcDBxVzN4dFlndU1pdXo2T244ZVoyREh0cnVhekVTaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735056382),
('abq2LOQcMUD12hc97xO2sCqlPAfjZrNMLfkEgWwX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNE41cFFLcktKRWRZTzhKeFJobE00RGVNcFFKZ3h4U0sxVHdmN3lCaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735056382),
('aj7g7Ssaasagf1vZbl88fYM08befmxYdVRBoRGga', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFVxdW5lU1g2VWFESGtCS09KMVBIeVg2d2RST05OdVRXMEtCWE9MNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735983632),
('b1wUGR8hbM7cML9KlK7gpbf7JxJEa0coTuXWMU0d', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ0haN3RCVUJoZ2twczVHN0hTcFBWMExXaEI0OFJrb1U3eVk2anpjdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114671),
('b1ZLj877lW68NMwJ61rUMJP79B4Asisvqp6xPsor', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUTBzRUJyS3M5N3VRblBJZmFha1liaTZMVFdaUFh3S2JreGJQU3lXMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6OTE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9fbmV4dC9pbWFnZT9xPTc1JnVybD0lMkZpbWFnZXMlMkZCcml6SW5kaWElMjBMb2dvJTIwJTI4MSUyOS5wbmcmdz0xMjgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735379590),
('B2POW6cl4udj6zHQlFg7VDs3dDTjDp4of4XHnQku', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWViblJ1V2Y2bVRWQkdKOGRPQ0d0RllxOG1wUVRheHNmVUY1aHU1ZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734671357),
('B5DDMkq0kqxlir8HXg7eVjz1i6UzAofu9jMyLUyu', NULL, '157.230.97.25', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRE50Q0JldllMMTZwQndSS1J4ZkFWZ2RsSENsWDVXMlpoRnZlMXliUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4vYWRzLnR4dCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1733661582),
('bAWxKfQB2VojSaIQyc0uXysEL4r37PhHM9WL04GN', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQWIyeWNlNkRiRm1nYlVCQWE5SHY1RFlhOUpyMGkxUkNJbWlzT0h5ViI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733813125),
('bCHZzc7JIjsOGHnyC61CAoT0XrwUiEcTmOu5YGwi', NULL, '104.166.80.173', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZE1ZZDI5RWZudzdmY1ZqZ3Z4bHViYnU4UW1TR1FuSkt4NnZJdmVxSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733493371),
('C1tYEMPbryHHRvD39Kmdhrv6p8VMJf8WU2JBy4i3', NULL, '157.230.97.25', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmlLNmJsMWI3NnE4SzRsMWNTS2k3QU15UXp0em5vYjBsYUdWODE0MiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733661572),
('CQx3IoMPUfaHjJm0bPUpOEdM9zgio9TuEoQhzpX5', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmlLR09QeXpWZ2lDYmlyeFNBRnkxaFdYMEZINjBiRG81cm9kZVF3MiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735017763),
('CveQj4IphPOYHWslVp5PdQLlla4PoGcOmHl35npH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODFTVkFlOFB0dENNaGs5ck9PamR0RzFtYjdwYWg2OERnYVlZQVlvWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734697783),
('CybLrtQ42sCSAcHx2feID9eACfocYfLjSJyhaeHT', NULL, '104.166.80.40', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTNGUnVlTEpoZlIxODBwdzhHZTJJUGpIM2VLZzgzeTBrQ2FoeWlTMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733501811),
('DS6IOjCdPZGIq3tJmc32R1xlHCbyx8DyNye69J7N', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiN1B5SmdkUHdDUFBCVGhJdE5nVHlRY1NZTGZUWDlCQ0s3WFhqeEdmYSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733895907),
('DXkyhMneg7uFGHdP8p0CIlUYMbLd8i6BvqScK5QU', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlFMZW1weWNlVXh5RjFiWTFBWlZLSVhxa2RlcE5aTzdPbGRmeGxmQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735037302),
('ebhpJsP3TgcxJSrZah5qAsxrZ01JFfdNT9Kbmv1M', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieXZZbnZTR2VVNkxMZ3A5Z0dMb1lQMmFlRUF4cGZHTnZEN2YzY2RVRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733655358),
('EcILeVR9XRcDEe4JtUPT4thbMQBa9J31UdxxtuRb', NULL, '134.209.147.227', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmNUbFJiTWRBZ1A4Qk03RE9paDd0SkJYakJSWDFNSzdaaDFpYml3NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733640234),
('EDlSqVBo3SiGZzyViEWgmJseA98gTJOsyehctOPF', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMklYREhlb1Q2N1V6QUYwcnljckllSXRNSGs5T0lyOHdHRDZoeUQ1ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735056392),
('EDRpI69tBYz4qoF6w7FxWlIQ0elXbdEI1oTI8CWQ', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibEVvOHduc3lNZllVMTJlbG53Wkp0czhTWkFlOHJiMW9OUHJwT2lYcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735032246),
('EwanqFXmbNBjsw5Z76KrBNWhEWIDv0xZLyITnFhK', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZUkzZ3hBem5kN3ZrMUlpTDkyTTl4SVcxVTQwbWVBUFVYNGxQcVFvOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735116425),
('ExhQgHk8tsslX59JFvdTTk9MrTuZA0sozrLV4TrM', NULL, '127.0.0.1', 'PostmanRuntime/7.43.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVW52bzNGSnh5ZTdjYUVlSlZ2amN1dnVsTDVBb2FHcTI1bnI5V2h0QiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1734934739),
('fGGFt7utU34fshYF9AOUZxEjeI2yNTAaWyxbAscJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibzVmaWR0cllwWDllSFlHdTFVb0hYOWc3YVdacTI1cTh2WFoyN3d3ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734071550),
('FiXYggPqXGRhxZ6qmkvTJ2ZeQva16zQVmTGinJNg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWXo5UDcxaUZsTVpWd1R3V2lLZHhvdnVwa0w2SGFzUG1xbG0zS2xaeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC91bmRlZmluZWQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735565478),
('FMevq7G8kpA2HzIl9nQqy6m9eqfi5uFkt9CNY0g6', NULL, '46.17.174.172', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:98.0) Gecko/20100101 Firefox/98.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXNsZDNJQ2ppUzI5WTJqWXYwZFBLYXl3bmFDYzNUSk5PejZNZ2FoeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733993050),
('fYBkc7LYn5gUD8YGkONzfBcIOHZheS0dbn6GiB0E', NULL, '127.0.0.1', 'PostmanRuntime/7.43.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoickQzYTNZcjQ0blplRFo2WUsyc255eWhRWmJkQnh2YUZrUHRLUVZLeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYmlsbC1ucCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1734591347),
('G2fuRMpyyDGqdX25NzKo86hW3QmQ4Pm3nKDeHqWR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWVia1FoTVlONWZaSkJrZHlJYmFkM3Q4WjVobnN0ZE9meExHVGE5SyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734671358),
('g5yIVw2FT1M7IDPrChqG0MxLBuj0gAku3iHjvsD8', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidEx1VjhSeHFySmVhUUFmb084OU11dkliZVI3OG01NVkxbGxLd0xaUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114461),
('g6nMwUChfTJ7rtcqfNV2acDfUwjQ2W2NiovHMTp8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQnVNNFRLSWxwc2xrSmM1NzdCUFBhSm9SWkhSWEc0YWF4Wk5mUTFQOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734931850),
('GDOEdz223wZOwm4Bq1OhxyI4pZQ7I3LcVl6U5HCS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMEtuYVBpM2NjY2JJbW1UZzV1VmprbjB4RFc4OVcweUh2V010ekxVRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735984967),
('gzriLTyJ8RLX9nybowk8RUVCzuCENEOUdB35sLvs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiekxPOW53dnVGU2VlTFhPV1VuZHZMNFRhNGljZVVBRUdQRDBhNXc5RSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735983878),
('iFMFT4zkkhu2AF8ottGbAVtZEPNz7tYFOsJewbDQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFMxcThQNnZrQUdHYVZrak9VWTc4Wk9VaEJaWUxINGpXckZCejB2bSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735984644),
('Ifo4cgb8twSCwqr8qCZhNh1mSUaP9hg7C7fAxZRq', NULL, '104.152.52.72', 'curl/7.61.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRVRvY0t1VUs2cVNZU2o2aHVjZFY5b1p5eEpNUENad1pRMHY1WnZkYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733452827),
('iiXtydj6vFcRZqaTa8bWFeYeQhjP2ws4FOXhqPjm', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZDlSM0JuQWhlYVpwVjR6SHJYdlE3d3VRTDZ0YnZyRHRncjJuQjlBOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733712909),
('ImtHB1hlV5w307AT3B6lXytPNpUn1yWIBfkRHf8w', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVEVKbFZPQmdVTVJpbU1pY3VxZGtPdjM2MzJkaWY5cWk5VTBoNjBWYiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733569804),
('jbdnGLlqQSa8pnW3Rn7mDBybifmM15waA56FDfHN', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzFnT3hIbmRWcUZOODFZN0hDMmZNZVdyMzFXekI3YjlKUFpZRXNrUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735017730),
('KIgDRszzimHofgnBDc1laPrqo5TV8bxp15fdXMT1', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicEpGTkhXRktWNjlZaHhpTGhUVVdwTUdYd3ZKaENMWlBkaTVUWmI1cyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735056391),
('kO5WbjtdNXbVRMyFYUSvRq1sugTquvjo4RW4Bd7a', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3hUS0FkZlhoYnhhOUpXQ2l2dFhRRTJmVWJ5SFNPNDZEb2h4TVYyMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735017763),
('kXYvA5D1rLMwzwmmHUFFc8nHPQEwMNObLDW42kBU', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDk1eWVNNHdPdWFZUnBoTlRqSHJEQ0JaR1RJNmswRkMxVUV5WG03TSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735116428),
('lBQutxtYTRcZ8CTTpv23dyRpjd1S4swDbK78YtA4', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUdjRVFZc25Bbk5Rb0lVUzVqVUhvcnNUdUd2YnQ1dnYxZGowdElYVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114460),
('lH1llco4404sZhg2NDBaDkVtnyLjT0XDOsHUcOMh', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiclRZZUpjNEdjMmpMZElISWhTWUhxb25ueHRIVXVydW5GVXNXZ2NPcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114824),
('Lw7FMk7uqfUxLO6YtJIEAWASU9ycAXfWyDXDKE4w', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTFVQR1dwOGpsaXRYVWhqd2JVWjRrUXYxZEE0anpQc1BoaE1EdWJsYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735119191),
('m76SyJPMt8fAZT9UNVsTwgWn6N0Bw3EYo1SfTbht', NULL, '143.198.128.109', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlpSSUZwTGdrUGk1MVZTazZ5bEhUWGFkRzdPUWdFMnl0NFZVb2VaMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733468567),
('Mg7yIsn3M8BeiJr1Ff1UbPyRnfNdYnlpbUEHfU8B', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUkZDR0lYanpyRWRyRHR1NHkzVzF4SVFSREtQZm94NVVINGE1TU5GVSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1734001111),
('mVR4HywMN1LjymLTcA88c8GcXz8E0TAU99pX2nqq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmJNTmVXZ3dKM0tOd3B2MndhcXJXbWlJcXhlb25oYmN6VnFYVlJPSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735190289),
('NYlWuLSb3EEOKfnuPCKykdNz6OYGNqlEgZHbTugx', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzhNY3RYRURiU0FLaDF0bmJ5Z2wwODN5NmtWTWxGaURWMjJYaFkyUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735119190),
('oTExYtlJJsc7CYACxYFdufjImXXWeUz9b0oAwGew', NULL, '2409:4064:4d31:8475:baa7:4d6f:3903:43ca', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR1dwMU1FeGF4Q3FhWjNvVE1oRjBmelk2Wm9YaXNiOHZJUGpGN0lNMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4vdW5kZWZpbmVkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733797875),
('P1ROLnZQQWldn2XYkNNcNur8zaYBt6M4sLwyx00L', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibHBMZ2hRMm51eElTcVROUHpQeWM4YTkxdjV1MW5URUlvTFhoYUFScyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1735223303),
('P5IW5e17EYXs9erVag36HTvfxPE0x2QauVlGySkv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieHNkdmF1azhLeGNHTHd5NXRvNVZqVmd6T3JMMFNnWEpOZ2xubUxCNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1735223215),
('P9ueJ2v4Rzew8Olg4AZYOBhHy6Ka2ffn8mxYTOOp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiY211dGVQbUNEZ0VpMk9VdGR4azBoS2ZrekhSODdWVm9MdlRKZ2hScCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1734772157),
('plfufEGnCAYPIVUpZRaZFbzHIGjuNn2eFOjtjB0g', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQW1RQnZ1STB3eUY3MlNGZmVCYlg1OGd2YVFIaEZOU2QxN2MyMTZ1dSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735056243),
('PxvB6610ZLmIWZz8XosuarsXb4pP3T7JYklrjr7c', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic09XWjFDM0piMU10dGNYZHpaYzc0Q21MZENZNUM5MHRGQ1pIbTBVYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734071542),
('Q556I8OGR2rj9Lepv9dJnOhonKj8PYMJdRofoi6U', NULL, '104.166.80.247', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWpBT0dzOGZiOXB0dnVQcWRhcFAyTlpFUG4xMlRMSXVXQnc5YkszRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733934987),
('Qi6WKrKM1JLTkfZRvvqdrGDWprm3soD8WcSHt0Qr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUJPeDhwUHRkMjJhUnBFSXBOOXBUcENSMTdsTGk1TEpTaURpekowVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735056407),
('QJsXC3sF5MgcXMheqlHU4Agk20wqQdEdtdb0bvfo', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFZKM3Y4SlV2UFJmSzJsSjh0bmdRQkdleEdOY1hrWjVobzM5bVU4VyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114684),
('QOwzz3Zs1cWp5CydmnRSqYqV83rshJASpoN2uOmW', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3p2M3lKWHB5dlV0M0VQUkpyZU8zUEN1TmJvZzBRaFFwNzJrZnFnTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735037303),
('r31uJQnAI9nWyQeUGbzFt63DCveBY7ffi1gjQ3VL', NULL, '104.166.80.220', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR1ZFakJwdTVua0VMbU9ZZnBTWE80SHR0WVpwUlYxVVlFeUJpR0hqYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733668483),
('RGrFnhTswVzAuZmo2xoBSBPC53qRw2Uw2AhMgzgv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2tDaFd5ZEtSRlNNRGlPNkNKQ0NrTGtEN0lQWnB5eUhOWTVhZ2NFVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735984562),
('rrDp3MAlTmz51VCuf267AcLOtGNDLyUjvLYNezbc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWGE3UDl2a2huTzJlbEdsaGVLRWtHQzFhVXZpRWpuWUF5TGk4eFZhMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTMyOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzNDczXzE3MzMyMTc4MDFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDEyKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735056407),
('RrkjnIvLU1DfdwqdMrYMSM8wRv2nh7UzYE4lbLFW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFRkb3kxNWpkSUFBYUpLdWlYdno2aHE3b2FVY3lsaklrSUdsWWJ5MCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735983878),
('RSGPsGY17tgVkL7X0AZC8jifZxFBlhcGPR56xl9A', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNDNVOXVmNmtEd09hQ1c4SEc1b3R2SUNSa3JZcTVXUjl4RlpJWEswUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1734060664),
('sI63wtWtSPOvQW08xmE8Nd7QjKEDBOlGpsCroS2L', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUs3RWd0bzB0ME1vZzlReG00Y3VBRXVYVGhHV2g3ZWxBVnFqc0hKWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735983580),
('SPATg1JAjqg7Ava0wJgknCi9INCmGAADsCHbcB8O', NULL, '2409:4064:4d31:8475:317f:c53a:c0d4:4434', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVzVqaUYyVm42YXduUjlEU2lmeGZ5S2NMVXZRYlMxQkRUVms2YUxGMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4vdW5kZWZpbmVkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733747872),
('Svymz4nvsh9XD43JZXHrxjK8SbFFz0f1lbXijy0I', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRlVWUWlqTk9CbDhac1ltWTA3VTN1MnlHMWNYa1FEWm9vTXJ4T0oybCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735802810),
('t5dcSYtHS3EihxMk4Xdk8Zs3DKcgqbahqyW5HLLt', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibk1Da2xYa2ZrU2JWRGZUUHFkelFoT3RhNm5pWVhHaHB3V3hzTEM2TSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114671),
('tkxw5UGUySLEI7zPirdvcQB0ftkUpTX08DrRUTQl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUR6MUcwVjEwVTJlbHlBc29UTVIzYTluVkVlbmxnY1JVTEl6VXpRbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735984966),
('V5KLuCjPX7FyCZyOT2XRnKvqPiGoOJIto348FFud', NULL, '127.0.0.1', 'PostmanRuntime/7.43.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNmtBRTljWTB5U2wySTA0VEpueG8wcTFyQ0k1akc5NXJucjJLdkhJWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1734945820),
('VDkoJukKQ2r5iMhZyDIhb8P9F7geNUGdAaGvk3BK', NULL, '2a06:4880:b000::ba', 'Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibDBheFZSd1M5TEdhY1VuT3dFMmhoMUZHSVVPQWNSUnEybjVIUDhPMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733456928),
('WoSHmXeNFaO64j5KmQNjj67VsZERFpue3TN0poLp', NULL, '2a02:4780:11:c0de::21', 'Go-http-client/2.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZWpVazlMNjREYlB4SWoxOHZtMGtOaDhpZ3NHbGpIc0RyOTB0ZmZ4WiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1733449314),
('x3a3icwcLF3LoRduprU7JhDQoGEy2P7cFB3nH4M2', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieExYdFFpMXVKMU1uM1NRWVh6S0RTbFQ1UW1LcThjV2d1OW81cHNhTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735032825),
('X4nTSgXjrS06j2M7RtpF5O31lMWcuEriPY9kKojH', NULL, '104.166.80.162', 'Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/120.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNnlSOWpETFpNUkx2TW1zWkJCcDBGdGszVmJmSFUxZmVCeWx1SGVNTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733927460),
('XGkSLZJWsuTZNalPoYK7K2ENMnbn6sAP5vHZ0yMJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzdSZjdJcHBlaTY4WnJFc3A3cVJ0b3hDaFBYZVBQM1NhMnQ1WDZMYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734697782),
('XvcX0Cdh4H4vhmy3SJbYBoqxMS0rQPZX0d23tzjt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic3RGVEI1UE5vRVVYRzhhbzBySmNqTFpMMnZLRklzZVBOUHZhcGNxRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1734932623),
('Y5DbdGTRxMMWQtZjZsffuUdnLIl7tRC5YwUe7cCT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUFxYXZZc214VXJ4bm5jYkw1TEhjbVA0WFJtZmF0enExTkNlUlNjRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTM4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvc2xpZGVycy8xNzMzMzgzMjM1XzE3MzMzMDkyNzFfQ3JlYW0lMjBhbmQlMjBCcm93biUyMFBob3RvZ3JhcGhpYyUyMEJlYXV0eSUyMFNpdGUlMjBMYXVuY2glMjBXZWJzaXRlJTIwKDE2KSUyMCgxKS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1735564957),
('Yji4as16ftz99AUa7gHA38VIfLOOOY8axvQ36Luu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2lyaVRtcllwOXM1Yms0WHJIZlVLV1p5cXRkdXA3N3VrNzN3a0tkZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735984562),
('YLhLaVN7pXLdugY8MGC1gu9ewqSnhSp951lwdRH0', NULL, '54.206.127.151', '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicThLRmhSQkdDbnBrTGlSbXdNRVdBMFozNldOWG91VkcwMU9JUTR4dSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXBpLmVxdWkuY28uaW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1733793632),
('yS6SOxIcVBOlxVM2VHxvZdoX6P4eacUVn0ur3O7x', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUTFTRmpNem9GczBmUGZLbWtuMWpkZWVNRkpzTEtLYnhVU3NIcmdEUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1734072001),
('YsTrIE0LMncW2vJi4Oe9NixQwatHW9tN85QHzv5l', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWNFazFHTzI0T1dyVE9IN2R4aktibXZiOUd2b0ZSRk1OT2VwZFFkdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JTmR3eUZWUDJMcXNKMU1vNVdLRVppVXpLbFpGakhlT2R3WWZsQm53LmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735017730),
('z7eNbgVgK78NBLsxmEeEJGZAXAVbtq4ScjWFvtQ5', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZVMzT0tyaDFIa2YxMFF6SEtmSzZvNU5qNVVma2duNkxxSE5YRERiTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735114685),
('zb80VFcXwWJ9uMcvoClM7JbY0JbTW3UngvWcep8J', NULL, '127.0.0.1', 'node', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWk91MWh6SGVpUHNORkd3MVpoankzQjBTOGJWRVdua3Fyc1hvc1cyZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735056324),
('ZegR52ZzY0OpifuHdmEH7wURnn41DlNtsNeWJ3Xy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVJVdW41UzFUYXVrSjNVZFpEOXhFTWNSaFNSWmhod0JZcGxFZEpiSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1735223089),
('zz0UI2PC5Zh6WCg2JYQI5s9S7w7Ar6HI84JILUrG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ0hqT0pyT1VNMW9TVmV5cEd5TjU2NEMwV3NpY3lRTHkxdDlpMFJVMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdG9yYWdlL2ltYWdlcy9JcHBkQVFpaVVxNVJMdm5tbDNRZnhFQ08wb1NOYkFJRlJ6T0JnZ0dHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1735984644);

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `title`, `description`, `image`, `created_at`, `updated_at`) VALUES
(1, 'What is Lorem Ipsum?', 'simply dummy text of the printing and typesetting industry. Lorem Ipsum has been', 'sliders/1733383235_1733309271_Cream and Brown Photographic Beauty Site Launch Website (16) (1).jpg', '2024-11-30 00:00:45', '2024-12-05 07:20:35'),
(2, 'null', 'null', 'sliders/1733383473_1733217801_Cream and Brown Photographic Beauty Site Launch Website (12).jpg', '2024-12-02 23:54:21', '2024-12-05 07:24:33');

-- --------------------------------------------------------

--
-- Table structure for table `software_commissions`
--

CREATE TABLE `software_commissions` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `user_information_id` bigint UNSIGNED NOT NULL,
  `commission` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `software_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `solutions`
--

CREATE TABLE `solutions` (
  `id` bigint UNSIGNED NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invert` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `solutions`
--

INSERT INTO `solutions` (`id`, `image`, `title`, `description`, `invert`, `created_at`, `updated_at`) VALUES
(2, 'solutions/1733224312.gif', 'Retail', '<p>Our retail Sofware is build for grocery stores and clothing stores with the neccesary features.</p><ul><li>The software boasts an intuitive and user-friendly interface, allowing retail staff to quickly learn and navigate the system with ease.</li><li>It is much easier and more accurate to scan an item\'s barcode to check its current quantity and update it.</li></ul>', 1, '2024-11-30 00:14:03', '2024-12-03 05:41:52'),
(3, 'solutions/1733224210.gif', 'Salon', '<p>Swift Salon and Spa Billing: Effortless Management of Services and Payments.</p><ul><li>Get ahead with our speciliazed billing software dedicated toward Salon and spa establishments.</li><li>Empower Your Salon and Spa Business with Comprehensive Tools such as member wallet and stylist mangaement.</li><li>Simplify Multi-Branch Management: Effortlessly oversee multiple salon branches from a single centralized platform, streamlining your operations and boosting efficiency.</li></ul>', 0, '2024-11-30 00:15:50', '2024-12-03 05:40:10'),
(6, 'solutions/1733224287.gif', 'Jewellery', '<p>Elevate Your Jewellery Business with Advanced Billing Solutions: Simplify Transactions, Enhance Inventory Management, and Delight Your Customers.</p><ul><li>Create detailed invoices for exquisite jewelry pieces, capturing every intricate detail and ensuring accurate billing.</li><li>Manage rates and weights of gold, silver and diamond jewellery items with ease.</li><li>Maintain comprehensive records of customers\' preferences, purchase history, and custom design specifications, fostering personalized experiences.</li></ul>', 1, '2024-11-30 01:29:21', '2024-12-03 05:41:27'),
(7, 'solutions/1733224352.gif', 'Hotel Booking', '<p>build specially for retaurants and hotels Ten Restro delivers when it comes to features and service.</p><ul><li>KOT facility for diffrent tables.</li><li>Room dashboard feature for hotel booking.</li><li>Waiter can take orders on their smartphone.</li></ul>', 0, '2024-11-30 01:30:42', '2024-12-03 05:42:32'),
(8, 'solutions/1733224555_whatsaap   post  (2).gif', 'Restaurant Billing', '<p>Swift Salon and Spa Billing: Effortless Management of Services and Payments.</p><ul><li>Get ahead with our speciliazed billing software dedicated toward Salon and spa establishments.</li><li>Empower Your Salon and Spa Business with Comprehensive Tools such as member wallet and stylist mangaement.</li><li>Simplify Multi-Branch Management: Effortlessly oversee multiple salon branches from a single centralized platform, streamlining your operations and boosting efficiency.</li></ul>', 1, '2024-12-03 05:45:55', '2024-12-03 05:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` bigint UNSIGNED NOT NULL,
  `product_service_id` bigint UNSIGNED NOT NULL,
  `quantity` int DEFAULT '0',
  `gross_weight` int NOT NULL DEFAULT '0',
  `net_weight` int DEFAULT '0',
  `rate` int DEFAULT '0',
  `mrp` decimal(10,2) DEFAULT '0.00',
  `date` date DEFAULT NULL,
  `adj_status` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `product_service_id`, `quantity`, `gross_weight`, `net_weight`, `rate`, `mrp`, `date`, `adj_status`, `created_at`, `updated_at`) VALUES
(1, 1, 8, 88, 8, 5, 0.00, NULL, 0, '2024-12-25 00:04:58', '2024-12-25 00:04:58'),
(2, 1, 5, 8, 5, NULL, 0.00, '2024-12-08', 0, '2024-12-26 04:09:02', '2024-12-26 04:09:02'),
(3, 2, 5, 10, 9, NULL, 0.00, '2024-12-08', 0, '2024-12-26 04:27:21', '2024-12-26 04:27:21'),
(4, 1, 56, 20, 89, 500, 65.00, NULL, 0, '2024-12-26 04:29:00', '2024-12-26 04:29:00');

-- --------------------------------------------------------

--
-- Table structure for table `tabs`
--

CREATE TABLE `tabs` (
  `id` bigint UNSIGNED NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descrition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tabs`
--

INSERT INTO `tabs` (`id`, `image`, `title`, `descrition`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'images/tabs/1732944756_image.png', 'Pricing', 'abc', 'images/tabs/icons/1732944756_icon.png', '2024-11-30 00:02:36', '2024-11-30 00:02:36'),
(2, 'images/tabs/1732944825_image.png', 'POS System', 'd', 'images/tabs/icons/1732944825_icon.png', '2024-11-30 00:03:45', '2024-11-30 00:03:45'),
(3, 'images/tabs/1732944886_image.png', 'Business Intelligence', 'ws', 'images/tabs/icons/1732944886_icon.png', '2024-11-30 00:04:46', '2024-11-30 00:04:46'),
(4, 'images/tabs/1732944942_image.png', 'CRM & loyalty CRM & loyalty', 'wsa', 'images/tabs/icons/1732944985_icon.png', '2024-11-30 00:05:42', '2024-11-30 00:06:25'),
(5, 'images/tabs/1732950286_image.png', 'Data back-up and Security', 'h', 'images/tabs/icons/1732950286_icon.png', '2024-11-30 01:34:46', '2024-11-30 01:34:46'),
(6, 'images/tabs/1732950322_image.png', 'Integrated Accounting', 'dx', 'images/tabs/icons/1732950322_icon.png', '2024-11-30 01:35:22', '2024-11-30 01:35:22'),
(7, 'images/tabs/1732950351_image.png', 'Retail Software', 'sz', 'images/tabs/icons/1732950351_icon.png', '2024-11-30 01:35:51', '2024-11-30 01:35:51'),
(8, 'images/tabs/1732950377_image.png', 'Easy Barcoding', 'x', 'images/tabs/icons/1732950377_icon.png', '2024-11-30 01:36:17', '2024-11-30 01:36:17');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'demo', '2024-12-13 01:05:22', '2024-12-13 01:05:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'John Doe', 'admin@admin.com', NULL, '$2y$12$s.Qm2J2vv8aAzICTl3wQpuhDd/uNwKnv9sXQdkBE6uIXD6z.saBE2', NULL, '2024-12-03 06:56:07', '2024-12-03 06:56:07'),
(2, 'Oprah Duke', 'bybafu@mailinator.com', NULL, '$2y$12$QWcmuhX0zM6W.wsY/.cTA.mM7RtWo47YlpD0AYMgqjQSaaF0MaOuO', NULL, '2024-12-03 07:53:38', '2024-12-03 07:53:38'),
(6, 'surojit dey', 's@gmail.com', NULL, '$2y$10$nsvbuEdyVGUWw051agd9iO97nzOPgHY9xx5ecyhsoEkLSFlIimzPS', NULL, '2024-12-04 02:07:18', '2025-01-02 01:01:03'),
(8, 'surojit sinha', 's1@gmail.com', NULL, '$2y$12$o/bcQ0s0h3YcJWpZXlU0fOakt46ccVABkDIOE.Gg4E5e4PBjsGO/O', NULL, '2024-12-13 03:11:35', '2024-12-13 03:11:35'),
(9, 'Test User', 'test@example.com', '2024-12-26 07:19:48', '$2y$12$dJZuQuusVXsrevWP.SIhkuOBNtXQvgsrihDaG2LlPI5.3sTy8Btoq', 'bir73jmXOa', '2024-12-26 07:19:49', '2024-12-26 07:19:49'),
(11, 'Test User', 'test@admin.com', '2024-12-26 07:23:28', '$2y$12$s.Qm2J2vv8aAzICTl3wQpuhDd/uNwKnv9sXQdkBE6uIXD6z.saBE2', 'rwiy6Bpyo8', '2024-12-26 07:23:28', '2024-12-26 07:23:28'),
(12, 'Georgia Maynard', 'qosevok@mailinator.com', NULL, '$2y$12$.nPi7l.GYBh3fDi50QKjfeuv71S8C52v1ClN93LRLCWTxOAec9y3.', NULL, '2024-12-26 07:53:35', '2024-12-26 07:53:35'),
(13, 'Leslie Clements', 'xobav@mailinator.com', NULL, '$2y$12$oJpRNizxas2XxVtkeaPRdutABgCJdncYgxq8mX4CjUCH77sPMRlnu', NULL, '2024-12-28 07:06:10', '2024-12-28 07:06:10'),
(14, 'Leslie Clements', 'xobavd@mailinator.com', NULL, '$2y$12$eXzL9sF9t.8FxAkhulPp7.HiSnR1W0muGvCXqFjnzfG3FutOYNv.a', NULL, '2024-12-28 07:07:38', '2024-12-28 07:07:38'),
(15, 'Leslie Clements', 'xobavhd@mailinator.com', NULL, '$2y$12$ZHvh3LTh1JZLe2DeDbrbM.dvgTGOyjpwTLoSyi9kQUSJEE2EyITWu', NULL, '2024-12-28 07:16:05', '2024-12-28 07:16:05'),
(16, 'Marshall Cain', 'rywek@mailinator.com', NULL, '$2y$12$5kgTyHQ5wMZ3PpJQhB8MD.TW5S2sVoOlf1JsfJ.MnENlrsFfeTemG', NULL, '2025-01-02 07:05:36', '2025-01-02 07:05:36'),
(17, 'Blair Thomas', 'bexuvyb@mailinator.com', NULL, '$2y$12$BDtkTPIZ9lOG1ZVkl/9ifuydx88oDr.jbJW2xmn7R9W/zth4Qmc9C', NULL, '2025-01-02 07:05:57', '2025-01-02 07:05:57'),
(18, 'ww', 'k@kw.com', NULL, '$2y$12$Ruv7IljvV6tc7FKcS4K89OrcUjaRIZ8qwohQD7ETsLxsTxFEsae6q', NULL, '2025-01-04 01:24:37', '2025-01-04 01:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `user_information`
--

CREATE TABLE `user_information` (
  `id` bigint UNSIGNED NOT NULL,
  `mobile_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `landmark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agreed_to_terms` tinyint(1) NOT NULL DEFAULT '0',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_information`
--

INSERT INTO `user_information` (`id`, `mobile_number`, `email`, `first_name`, `last_name`, `category`, `business_name`, `address_1`, `address_2`, `landmark`, `pincode`, `country`, `state`, `city`, `agreed_to_terms`, `password`, `created_at`, `updated_at`) VALUES
(1, '1234567890', 'example@test.com', 'John', 'Doe', 'Business', 'Test Business', '123 Main Street', 'Suite 100', 'Near Central Park', '123456', 'USA', 'New York', 'New York City', 1, NULL, '2024-12-03 06:56:07', '2024-12-03 06:56:07'),
(2, '+1 (545) 228-7319', 'bybafu@mailinator.com', 'Oprah', 'Duke', 'CRM app', 'Debra Rice', '984 Old Boulevard', 'Pariatur Et quam ma', 'Lorem mollitia ea mo', 'Rerum qui Nam conseq', 'CU', '13', 'Contramaestre', 1, NULL, '2024-12-03 07:53:38', '2024-12-03 07:53:38'),
(3, '8901478985', 's@gmail.com', 'surojit', 'dey', 'Salon', 'demo', 'demo', 'demo', 'deo', '700008', 'IN', 'LD', 'Kavaratti', 1, NULL, '2024-12-04 02:06:13', '2024-12-04 02:06:13'),
(4, '8901478985', 's@gmail.com', 'surojit', 'dey', 'Salon', 'demo', 'demo', 'demo', 'deo', '700008', 'IN', 'LD', 'Kavaratti', 1, NULL, '2024-12-04 02:06:33', '2024-12-04 02:06:33'),
(5, '8901478985', 's@gmail.com', 'surojit', 'dey', 'Salon', 'demo', 'demo', 'demo', 'deo', '700008', 'IN', 'LD', 'Kavaratti', 1, NULL, '2024-12-04 02:06:59', '2024-12-04 02:06:59'),
(6, '8901478985', 's@gmail.com', 'surojit', 'dey', 'Salon', 'demo', 'demo', 'demo', 'deo', '700008', 'IN', 'LD', 'Kavaratti', 1, NULL, '2024-12-04 02:07:17', '2024-12-04 02:07:17');

-- --------------------------------------------------------

--
-- Table structure for table `user_infos`
--

CREATE TABLE `user_infos` (
  `id` bigint UNSIGNED NOT NULL,
  `mobile_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `landmark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agreed_to_terms` tinyint(1) NOT NULL DEFAULT '0',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accounts_customer_id_foreign` (`customer_id`),
  ADD KEY `accounts_created_by_foreign` (`created_by`);

--
-- Indexes for table `account_groups`
--
ALTER TABLE `account_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `account_masters`
--
ALTER TABLE `account_masters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adjust_stocks`
--
ALTER TABLE `adjust_stocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assign_clients`
--
ALTER TABLE `assign_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `coins`
--
ALTER TABLE `coins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commissions_purchase_id_foreign` (`purchase_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coni_purchases`
--
ALTER TABLE `coni_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coni_purchases_created_by_foreign` (`created_by`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_user_id_foreign` (`user_id`);

--
-- Indexes for table `customersub_types`
--
ALTER TABLE `customersub_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customersub_types_type_id_foreign` (`type_id`);

--
-- Indexes for table `customer_types`
--
ALTER TABLE `customer_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `distrubutrers`
--
ALTER TABLE `distrubutrers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `distrubutrers_user_id_foreign` (`user_id`);

--
-- Indexes for table `ecosydtems`
--
ALTER TABLE `ecosydtems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employees_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `form_otps`
--
ALTER TABLE `form_otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `karigaris`
--
ALTER TABLE `karigaris`
  ADD PRIMARY KEY (`id`),
  ADD KEY `karigaris_user_id_foreign` (`user_id`);

--
-- Indexes for table `karigari_items`
--
ALTER TABLE `karigari_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `karigari_items_karigari_id_foreign` (`karigari_id`);

--
-- Indexes for table `log_generates`
--
ALTER TABLE `log_generates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master_settings`
--
ALTER TABLE `master_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_created_by_foreign` (`created_by`),
  ADD KEY `orders_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_order_id_foreign` (`order_id`),
  ADD KEY `payments_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_services`
--
ALTER TABLE `product_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_services_code_unique` (`code`);

--
-- Indexes for table `product_service_groups`
--
ALTER TABLE `product_service_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchases_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_items_purchase_id_foreign` (`purchase_id`);

--
-- Indexes for table `rates`
--
ALTER TABLE `rates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sales_assigns`
--
ALTER TABLE `sales_assigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_assigns_user_id_foreign` (`user_id`),
  ADD KEY `sales_assigns_product_id_foreign` (`product_id`);

--
-- Indexes for table `sale_products`
--
ALTER TABLE `sale_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `software_commissions`
--
ALTER TABLE `software_commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `software_commissions_user_id_foreign` (`user_id`),
  ADD KEY `software_commissions_user_information_id_foreign` (`user_information_id`);

--
-- Indexes for table `solutions`
--
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tabs`
--
ALTER TABLE `tabs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_information`
--
ALTER TABLE `user_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_infos`
--
ALTER TABLE `user_infos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_infos_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `account_groups`
--
ALTER TABLE `account_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `account_masters`
--
ALTER TABLE `account_masters`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `adjust_stocks`
--
ALTER TABLE `adjust_stocks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assign_clients`
--
ALTER TABLE `assign_clients`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `coins`
--
ALTER TABLE `coins`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coni_purchases`
--
ALTER TABLE `coni_purchases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customersub_types`
--
ALTER TABLE `customersub_types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_types`
--
ALTER TABLE `customer_types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `distrubutrers`
--
ALTER TABLE `distrubutrers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ecosydtems`
--
ALTER TABLE `ecosydtems`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `form_otps`
--
ALTER TABLE `form_otps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `karigaris`
--
ALTER TABLE `karigaris`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `karigari_items`
--
ALTER TABLE `karigari_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_generates`
--
ALTER TABLE `log_generates`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_settings`
--
ALTER TABLE `master_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_services`
--
ALTER TABLE `product_services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_service_groups`
--
ALTER TABLE `product_service_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rates`
--
ALTER TABLE `rates`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sales_assigns`
--
ALTER TABLE `sales_assigns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale_products`
--
ALTER TABLE `sale_products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `software_commissions`
--
ALTER TABLE `software_commissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `solutions`
--
ALTER TABLE `solutions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tabs`
--
ALTER TABLE `tabs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_information`
--
ALTER TABLE `user_information`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_infos`
--
ALTER TABLE `user_infos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `commissions_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coni_purchases`
--
ALTER TABLE `coni_purchases`
  ADD CONSTRAINT `coni_purchases_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customersub_types`
--
ALTER TABLE `customersub_types`
  ADD CONSTRAINT `customersub_types_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `customer_types` (`id`);

--
-- Constraints for table `distrubutrers`
--
ALTER TABLE `distrubutrers`
  ADD CONSTRAINT `distrubutrers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `karigaris`
--
ALTER TABLE `karigaris`
  ADD CONSTRAINT `karigaris_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `karigari_items`
--
ALTER TABLE `karigari_items`
  ADD CONSTRAINT `karigari_items_karigari_id_foreign` FOREIGN KEY (`karigari_id`) REFERENCES `karigaris` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_assigns`
--
ALTER TABLE `sales_assigns`
  ADD CONSTRAINT `sales_assigns_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `sales_assigns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `software_commissions`
--
ALTER TABLE `software_commissions`
  ADD CONSTRAINT `software_commissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `software_commissions_user_information_id_foreign` FOREIGN KEY (`user_information_id`) REFERENCES `user_information` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
