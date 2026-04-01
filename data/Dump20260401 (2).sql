-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: stackgen
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fieldvalidations`
--

DROP TABLE IF EXISTS `fieldvalidations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fieldvalidations` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `formFieldId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `validationType` enum('required','minLength','maxLength','min','max','regex') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `errorMessage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `formFieldId` (`formFieldId`),
  CONSTRAINT `fieldvalidations_ibfk_1` FOREIGN KEY (`formFieldId`) REFERENCES `formfields` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fieldvalidations`
--

LOCK TABLES `fieldvalidations` WRITE;
/*!40000 ALTER TABLE `fieldvalidations` DISABLE KEYS */;
/*!40000 ALTER TABLE `fieldvalidations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formconfigs`
--

DROP TABLE IF EXISTS `formconfigs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formconfigs` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `menuId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workspaceId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tableName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `publishedAt` timestamp NULL DEFAULT NULL,
  `publishedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menuId` (`menuId`),
  KEY `fk_formConfigs_workspace` (`workspaceId`),
  CONSTRAINT `fk_formConfigs_workspace` FOREIGN KEY (`workspaceId`) REFERENCES `workspace` (`id`) ON DELETE CASCADE,
  CONSTRAINT `formconfigs_ibfk_1` FOREIGN KEY (`menuId`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formconfigs`
--

LOCK TABLES `formconfigs` WRITE;
/*!40000 ALTER TABLE `formconfigs` DISABLE KEYS */;
/*!40000 ALTER TABLE `formconfigs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formfields`
--

DROP TABLE IF EXISTS `formfields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formfields` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `formConfigId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workspaceId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fieldName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fieldLabel` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fieldType` enum('text','textarea','number','decimal','boolean','date','datetime','select','multiselect','file','email','phone') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `options` json DEFAULT NULL,
  `isRequired` tinyint(1) DEFAULT '0',
  `isUnique` tinyint(1) DEFAULT '0',
  `sortOrder` int DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_formFields_name_form` (`formConfigId`,`fieldName`),
  CONSTRAINT `formfields_ibfk_1` FOREIGN KEY (`formConfigId`) REFERENCES `formconfigs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formfields`
--

LOCK TABLES `formfields` WRITE;
/*!40000 ALTER TABLE `formfields` DISABLE KEYS */;
/*!40000 ALTER TABLE `formfields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workspaceId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tableName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_menus_workspace_table` (`workspaceId`,`tableName`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `fk_menus_workspace` FOREIGN KEY (`workspaceId`) REFERENCES `workspace` (`id`) ON DELETE CASCADE,
  CONSTRAINT `menus_ibfk_2` FOREIGN KEY (`parentId`) REFERENCES `menus` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES ('9bdb0f6e-2db4-11f1-b0f0-b06ebf82bf89','520d5277-2db0-11f1-b0f0-b06ebf82bf89','Project Menu','projects','optional-icon-name',NULL,0,1,0,NULL,'2026-04-01 10:21:55',NULL,'2026-04-01 10:21:55',NULL);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('ffaa30dc-2d99-11f1-b0f0-b06ebf82bf89','superadmin','Full platform access',0,NULL,'2026-04-01 07:11:26','system','2026-04-01 07:11:26',NULL),('ffaa48ae-2d99-11f1-b0f0-b06ebf82bf89','admin','Company admin',0,NULL,'2026-04-01 07:11:26','system','2026-04-01 07:11:26',NULL),('ffaa54e5-2d99-11f1-b0f0-b06ebf82bf89','user','Standard user',0,NULL,'2026-04-01 07:11:26','system','2026-04-01 07:11:26',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userroles` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_userRoles_user_role` (`userId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workspaceId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `lastLoginAt` timestamp NULL DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `fk_users_role` (`roleId`),
  KEY `fk_users_workspace` (`workspaceId`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_users_workspace` FOREIGN KEY (`workspaceId`) REFERENCES `workspace` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('76b7d819-2db0-11f1-b0f0-b06ebf82bf89',NULL,'ffaa48ae-2d99-11f1-b0f0-b06ebf82bf89','admin@test.com','$2b$10$mnlBS/IVbSSXj09zakqVh.T4j5j5MVbzDsemAz.W.Cf8evdwGsgC2','Admin User',NULL,NULL,1,NULL,0,NULL,'2026-04-01 09:52:15',NULL,'2026-04-01 09:52:15',NULL),('b4090a80-2da8-11f1-b0f0-b06ebf82bf89',NULL,'ffaa30dc-2d99-11f1-b0f0-b06ebf82bf89','superadmin@gmail.com','$2b$10$9ux.K4e86bvmaSa0JJYaDOwT4BqUZzkBclA2V.PU5DJGCOHGISuvi','SuperAdmin',NULL,NULL,1,NULL,0,NULL,'2026-04-01 08:56:42',NULL,'2026-04-01 08:56:42',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workspace`
--

DROP TABLE IF EXISTS `workspace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workspace` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logoUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_companies_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workspace`
--

LOCK TABLES `workspace` WRITE;
/*!40000 ALTER TABLE `workspace` DISABLE KEYS */;
INSERT INTO `workspace` VALUES ('520d5277-2db0-11f1-b0f0-b06ebf82bf89','Test Workspace','workspace@test.com','1234567890','https://example.com/logo.png','123 Test Street, Test City',1,0,NULL,'2026-04-01 09:51:13',NULL,'2026-04-01 09:51:13',NULL);
/*!40000 ALTER TABLE `workspace` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 16:46:43
