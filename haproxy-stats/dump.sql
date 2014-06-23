-- MySQL dump 10.13  Distrib 5.6.17, for Win64 (x86_64)
--
-- Host: localhost    Database: haproxy_nodejs
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `haproxy_nodejs`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `haproxy_nodejs` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `haproxy_nodejs`;

--
-- Table structure for table `url_haproxy`
--

DROP TABLE IF EXISTS `url_haproxy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `url_haproxy` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `url` varchar(200) DEFAULT NULL,
  `pxname` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `svname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `url_haproxy`
--

LOCK TABLES `url_haproxy` WRITE;
/*!40000 ALTER TABLE `url_haproxy` DISABLE KEYS */;
INSERT INTO `url_haproxy` VALUES (18,'http://healthkart:adw38&6cdQE@healthkart.com/haproxy?stats;csv;norefresh','healthkart_resources','prod','server-214'),(27,'http://healthkart:adw38&6cdQE@healthkart.com/haproxy?stats;csv;norefresh','healthkart','prod','prod-spkd-0214-U'),(28,'http://healthkart:adw38&6cdQE@healthkart.com/haproxy?stats;csv;norefresh','healthkart','prod','prod-spkd-0215-T'),(29,'http://healthkart:adw38&6cdQE@healthkart.com/haproxy?stats;csv;norefresh','healthkart','prod','prod-vmn-265-P'),(30,'http://healthkart:adw38&6cdQE@healthkart.com/haproxy?stats;csv;norefresh','healthkart','prod','prod-vmn-400-Q');
/*!40000 ALTER TABLE `url_haproxy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_auth`
--

DROP TABLE IF EXISTS `user_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_auth` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) NOT NULL,
  `pass` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_auth`
--

LOCK TABLES `user_auth` WRITE;
/*!40000 ALTER TABLE `user_auth` DISABLE KEYS */;
INSERT INTO `user_auth` VALUES (1,'vikas','vikas@123');
/*!40000 ALTER TABLE `user_auth` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-06-23 12:57:54
