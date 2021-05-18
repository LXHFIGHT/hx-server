<!--
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
-->
# NodeJS 辅助知识

## 一、CentOS 服务器部署

#### 1. 安装gcc
```bash
yum install gcc
```
#### 2. 安装NodeJS和forever守护进程
#### 3. mysql
1. 安装 mysql
```bash
# 安装 mysql
yum install mysql

# 官网下载安装 mysql-server
wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm
rpm -ivh mysql-community-release-el7-5.noarch.rpm
yum install mysql-community-server

# 安装 mysql-devel
yum install mysql-devel
```
2. 启动 mysql 服务
```bash
service mysqld start
```


