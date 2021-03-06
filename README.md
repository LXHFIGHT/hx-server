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

# Step4. 全局安装 forever, 及forever常用命令
npm i -g forever
forever list # 查看所有的forever启动进程， 状态为STOPPED表示启动失败可以查看log
forever stopall # 关闭所有守护进程
forever stop # 关闭指定ID的守护进程


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
#### 1. 安装 Nginx 
```bash
# Step1. 安装yum工具包
sudo yum install -y yum-utils

# Step2. 为了设置yum仓库，需要依据此路径创建一个文件 /etc/yum.repos.d/nginx.repo, 同时保存以下内容：
touch /etc/yum.repos.d/nginx.repo
vi /etc/yum.repos.d/nginx.repo

# 一般建议推荐安装nginx稳定版
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

# Step 3. 安装nginx包
sudo yum install nginx -y
```

#### 2.Nginx常用命令
```bash
# 启动 Nginx 服务
nginx

# 检测 Nginx 脚本是否正确
nginx -t

# 重启 nginx
nginx -s reload

# 退出 nginx： quit 是一个优雅的关闭方式，nginx会在退出前完成已经接受的连接请求。
nginx -s quit

# 关闭 nginx: stop 是快速关闭，不管有没有正在处理的请求。
nginx -s stop
```
#### 3. Nodejs服务完整配置方案
1） 查看 `/etc/nginx/nginx.conf` （这里的`/etc/nginx`是默认配置存放目录，如果放置在别的地方可以通过 *nginx -t* 命令查找)

```nginx
http {
  # ...其他配置
  gzip on;  # 打开gzip
  gzip_min_length 1k; # 最小需要gzip压缩的大小
  gzip_comp_level 3; # gzip压缩等级 建议设置3
  gzip_types text/plain application/javascript application/json text/css application/xml text/javascript application/x-httpd-php;
  gzip_vary on; # 是否在http header中添加Vary: Accept-Encoding
  gzip_proxied any; # 无条件压缩所有反向代理结果数据

  include /etc/nginx/conf.d/*.conf; # 允许引入 conf.d 录下的conf文件中配置的server
}
```
2） 举例我们解析了 **http://api.lxhfight.com** 作为Node服务端的域名，并需要反向代理, 此时创建 `/etc/nginx/conf.d/api.lxhfight.com.conf` 文件, 并作如下配置：
```nginx
# 配置 80 端口，并反向代理到本地node服务所在端口
server {
  listen 80;
  server_name api.lxhfight.com;
  location / {
    proxy_pass http://127.0.0.1:8080;
  }
}

# 配置 443 端口（HTTPS），并反向代理到本地node服务所在端口
server {
  listen 443 ssl;
  # 配置HTTPS的默认访问端口为443。
  # 如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
  # 如果您使用Nginx 1.15.0及以上版本，请使用listen 443 ssl代替listen 443和ssl on。
  server_name api.lxhfight.com; # 需要提前为此域名绑定SSL证书。
  root html;
  index index.html index.htm;
  ssl_certificate cert/cert-file-name.pem; # 需要将cert-file-name.pem替换成已上传的证书文件的名称。
  ssl_certificate_key cert/cert-file-name.key; # 需要将cert-file-name.key替换成已上传的证书密钥文件的名称。
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
  #表示使用的加密套件的类型。
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #表示使用的TLS协议的类型。
  ssl_prefer_server_ciphers on;
  location / {
    proxy_pass http://127.0.0.1:8080;
  }
}
```

3） 如果需要支持 **HTTP** 请求自动跳转到 **HTTPS**， 将以下配置文本替代上面 80端口的 server
```
server {
    listen 80;
    server_name api.lxhfight.com; 
    rewrite ^(.*)$ https://$host$1; # 将所有HTTP请求通过rewrite指令重定向到HTTPS。
    location / {
        index index.html index.htm;
    }
}
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
```bash
# 启动 nginx
nginx

# 启动 redis 服务器
redis-server /root/redis-6.2.3/redis.conf

# 启动 mysql 服务
systemctl start mysqld.service

# 启动 node 服务端
cd {具体服务器路径}
npm run start:prod
```

