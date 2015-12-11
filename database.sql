-- MySQL dump 10.13  Distrib 5.7.9, for osx10.11 (x86_64)
--
-- Host:     Database:
-- ------------------------------------------------------
-- Server version	5.6.27-0ubuntu0.15.04.1

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
-- Table structure for table `auction`
--

DROP TABLE IF EXISTS `auction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auction` (
  `AuctionID` int(11) NOT NULL AUTO_INCREMENT,
  `BidIncrement` decimal(13,2) DEFAULT NULL,
  `MinimumBid` decimal(13,2) DEFAULT NULL,
  `CopiesSold` int(11) DEFAULT NULL,
  `Monitor` int(11) NOT NULL,
  `ItemID` int(11) NOT NULL,
  `MaxBid` int(11) DEFAULT NULL,
  PRIMARY KEY (`AuctionID`),
  KEY `Monitor` (`Monitor`),
  KEY `ItemID` (`ItemID`),
  CONSTRAINT `auction_ibfk_1` FOREIGN KEY (`Monitor`) REFERENCES `employee` (`EmployeeID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `auction_ibfk_2` FOREIGN KEY (`ItemID`) REFERENCES `item` (`ItemID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bid`
--

DROP TABLE IF EXISTS `bid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bid` (
  `CustomerID` int(11) NOT NULL DEFAULT '0',
  `AuctionID` int(11) DEFAULT NULL,
  `ItemID` int(11) NOT NULL DEFAULT '0',
  `BidTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `BidPrice` decimal(13,2) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`,`ItemID`,`BidTime`),
  KEY `ItemID` (`ItemID`),
  KEY `AuctionID` (`AuctionID`),
  CONSTRAINT `bid_ibfk_1` FOREIGN KEY (`ItemID`) REFERENCES `item` (`ItemID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `bid_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `bid_ibfk_3` FOREIGN KEY (`AuctionID`) REFERENCES `auction` (`AuctionID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `Rating` int(11) DEFAULT NULL,
  `creditcardnum` bigint(20) DEFAULT NULL,
  `CustomerID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`CustomerID`),
  CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `person` (`SSN`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `StartDate` datetime DEFAULT NULL,
  `HourlyRate` decimal(15,2) DEFAULT NULL,
  `Level` int(11) DEFAULT NULL,
  `EmployeeID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`EmployeeID`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `person` (`SSN`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item` (
  `ItemID` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) DEFAULT NULL,
  `Name` char(255) NOT NULL,
  `Type` char(6) DEFAULT NULL,
  `NumCopies` int(11) DEFAULT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `SSN` int(9) NOT NULL DEFAULT '0',
  `LastName` char(20) NOT NULL,
  `FirstName` char(20) NOT NULL,
  `Address` char(255) DEFAULT NULL,
  `ZipCode` int(11) DEFAULT NULL,
  `telephone` bigint(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(255) NOT NULL,
  PRIMARY KEY (`SSN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `CustomerID` int(11) NOT NULL DEFAULT '0',
  `AuctionID` int(11) NOT NULL DEFAULT '0',
  `ExpireDate` datetime DEFAULT NULL,
  `PostDate` datetime DEFAULT NULL,
  `ReservePrice` decimal(13,2) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`,`AuctionID`),
  KEY `AuctionID` (`AuctionID`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `post_ibfk_2` FOREIGN KEY (`AuctionID`) REFERENCES `auction` (`AuctionID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `BuyerID` int(11) NOT NULL,
  `SellerID` int(11) NOT NULL,
  `Price` decimal(13,2) NOT NULL,
  `Date` datetime NOT NULL,
  `ItemID` int(11) NOT NULL,
  `AuctionID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`AuctionID`),
  KEY `BuyerID` (`BuyerID`),
  KEY `SellerID` (`SellerID`),
  KEY `ItemID` (`ItemID`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`BuyerID`) REFERENCES `customer` (`CustomerID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`SellerID`) REFERENCES `customer` (`CustomerID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`AuctionID`) REFERENCES `auction` (`AuctionID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_4` FOREIGN KEY (`ItemID`) REFERENCES `item` (`ItemID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-11  9:10:33
