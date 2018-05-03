/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 80011
Source Host           : localhost:3306
Source Database       : project

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2018-05-03 13:50:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'maliut', 'maliut', '2ec618a4bf70ea4094703393a9a6537f84d397fcdd42fa6a1040454aa7875f5a', 'bff49090-4e01-11e8-bec0-4780ebe407bb');
INSERT INTO `users` VALUES ('2', 'ltl', 'ltl', '1f0caa3ac631115d7bbf93fc840c9d2c119ffb7edef69762cf2c9181e03906d0', '7fb64770-4e07-11e8-b4ae-ab05a3484fec');
