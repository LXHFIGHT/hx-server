<!--
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
-->
# NodeJS 辅助知识

## 一、CentOS 服务器软件安装及其他初始化

#### 1. 安装gcc
```bash
yum install -y gcc
```
#### 2. 安装git
```bash
yum install -y git
```
#### 3. 安装 NodeJS 和 forever守护进程
```bash
# Step1. 下载NodeJS v10的Yum镜像
curl —silent —location https://rpm.nodesource.com/setup_14.x | bash -

# Step2. 通过镜像下载NodeJS 并安装
sudo yum install -y nodejs

# Step3. 安装完成后，查看NodeJS版本
node -v

# Step4. 全局安装 forever
npm i -g forever

# Ps: 如果在中国大陆地区，可以使用 cnpm 包替代 npm
npm i -g cnpm
```

#### 4. 生成 `ssh-keygen`
```bash
 ssh-keygen -t rsa -C "注释（一般可以是邮箱）"
 # 执行后在 ~/.ssh/目录下就生成了 id_rsa 和 id_rsa.pub 文件
```

## 二. Mysql 篇
#### 1. 检查是否安装 `mysql`
```bash
yum list installed | grep mysql
```

#### 2. 安装 Mysql 8.0
```bash
# Step1. 创建目录
mkdir /usr/local/mysql

# Step2. 获取 Mysql 8.0 YUM源
wget https://repo.mysql.com//mysql80-community-release-el7-1.noarch.rpm

# Step3. 安装 Mysql源
yum -y install mysql80-community-release-el7-1.noarch.rpm

# Step4. 安装 Mysql
yum module disable mysql
yum -y install mysql-community-server

# Step5. 卸载 Mysql 源
yum -y remove mysql80-community-release-el7-1.noarch
```

#### 3. Mysql 服务以及配置

```bash
# Step1. 查看 Mysql 当前状态
systemctl status mysqld.service

# Step2. 启动 Mysql
systemctl start mysqld.service

# Step3. 首次登录 Mysql 获取临时密码
grep "password" /var/log/mysqld.log #  格式如右： A temporary passwor is generated for root@localhost: rlqWKiqFD8_V

# Step4. 登录 Mysql
mysql -u root -p

# Step5. 修改密码（登录后）
mysql> use mysql;
mysql> ALTER user 'root'@'localhost' IDENTIFIED BY '你的密码';
```

#### 4. 允许远程访问云数据库
```bash
# Step1. 修改mysql表中，设置登录IP为%
mysql> use mysql;
mysql> update user set host='%' where user = 'root';
mysql> select host, user from user; # 查看是否修改成功

# Step2. Mysql8.0不再支持当前用户为自己修改授权，此时需要新建一个用户，
# 然后再授权远程主机访问权限: 例如，你想myuser使用mypassword密码从任何主机连接到mysql服务器的话
# 添加新的用户
mysql> create user '用户名'@'%' IDENTIFIED BY '用户密码';
# 授权对应的权限
mysql> GRANT ALL PRIVILEGES ON *.* TO '用户名'@'%';
# 刷新权限缓存
mysql> FLUSH PRIVILEGES;
# 注意！！ root用户没有SYSTEM_USER权限，把权限加入后即可修改其他用户的密码
mysql> GRANT system_user ON *.* TO 'root';
# 修改密码类型为 mysql_native_password，方便数据库客户端可以访问
mysql> alter user '用户名'@'%' identified with mysql_native_password by '用户密码';
# 再次刷新权限缓存
mysql> FLUSH PRIVILEGES;
```

#### 5.授权命令详解：
```bash
mysql> GRANT ALL PRIVILEGES ON *.* TO '用户名'@'%';
# GRANT 权限1,权限2,…权限n ON 数据库名称.表名称 TO 用户名@用户地址;
```
- `权限1,权限2,…权限n` 代表 *select*, *insert*, *update*, *delete*, *create*, *drop*, *index*, *alter*, *grant*, *references*, *reload*, *shutdown*, *process*, *file* 等14个权限。其中当权限1,权限2,…权限n被 `all privileges` 或者 `all` 代替，表示赋予用户全部权限。

- 当 `数据库名称.表名` 称被 `*.*` 代替，表示赋予用户操作服务器上所有数据库所有表的权限。

- 用户地址可以是 `localhost`，也可以是ip地址、机器名字、域名。也可以用 `'%'` 表示从任何地址连接。



## 三. Nginx 篇
**Step 1.** 安装yum工具包
```bash
sudo yum install -y yum-utils
```
**Step 2.** 为了设置yum仓库，需要依据此路径创建一个文件 `/etc/yum.repos.d/nginx.repo`, 同时保存以下内容：
```bash
touch /etc/yum.repos.d/nginx.repo
vi /etc/yum.repos.d/nginx.repo
```
```bash
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```
**Step 3.** 安装nginx包
```bash
sudo yum install nginx -y
```


## 四、Redis 篇
#### 1.安装Redis
```bash
#Step1. 下载稳定版redis安装包
cd ~
wget http://download.redis.io/releases/redis-6.2.3.tar.gz 

#Step2. 解压缩安装包并安装
tar xzf redius-6.2.3.tar.gz
cd redis-6.2.3
make
make install
```

#### 2.配置 redis 到环境变量中
> 由于每次执行脚本都要到指定目录，很麻烦，所以可以配置环境变量，后面需要使用redis命令就可以全局操作。

```bash
#Step1. 进入环境变量配置文件
sudo vim /etc/profile 

#Step2. 文件末尾增加这两行，其中 REDIS_HOME 填redis包所在的目录，
export REDIS_HOME=/root/redis-6.2.3/
export PATH=$PATH:$REDIS_HOME/src/

#Step3. 刷新配置信息
source /etc/profile
```

#### 3. 初始化 redis 密码

```bash
openssl rand -base64 24 # 生成强密码
cd /root/redis-6.2.3/
vi redis.conf
# 找到 requirepass 项，配置强密码进去， 重启redis-server生效
```

#### 4. redis常用命令
```bash
# 启动redis服务和redis客户端， 【注意带上配置文件，否则无法用到持久化密码】
redis-server /root/redis-6.2.3/redis.conf

# 链接客户端
redis-cli -h {host} -p {port} -a {password}
redis-cli # 连接本地客户端

# 关闭客户端
127.0.0.1:6379> shutdown

# 访问后输入密码
127.0.0.1:6379> auth "密码"
```

## 五、总结
#### 1. 开机自启动脚本【包含上述所有软件】

