# Docker Document
## Định nghĩa Docker 
Docker là một nền tảng cho developers và sysadmin để develop, deploy và run application với container. Nó cho phép tạo các môi trường độc lập và tách biệt để khởi chạy và phát triển ứng dụng và môi trường này được gọi là container. Khi cần deploy lên bất kỳ server nào chỉ cần run container của Docker thì application sẽ được khởi chạy ngay lập tức.

## Lợi ích của Docker 
* Tính dễ sử dụng : Docker được sử dụng để build test ứng dụng một cách nhanh chóng, ứng dụng có thể được đóng gói tên laptop của developer và chạy trên mọi nền tảng khác : trên máy tính khác, trên cloud,..
* Tốc độ : Docker rất nhẹ và nhanh, nó có thể được khởi tạo chỉ trong vài giây.
* Khả năng mở rộng : lập trình viên có thể chia nhỏ ứng dụng để chạy trong các container riêng rẽ, các container này được liên kết với nhau để tạo thành một ứng dụng, từ đó dễ dàng để update và nâng cấp các chức năng.

## Một số khái niệm của Docker 
![Docker Architecture](./Docker-architecture.png)

* Docker client: là cách người dùng tương tác với docker thông qua câu lệnh. Docker Client sẽ gửi các lệnh thông qua API tới docker daemon.
* Docker host: là một docker server quản lý các container , image , volume và network trong docker host.
* Images: là một khuôn mẫu để tạo một docker container. Thường image sẽ tạo khuôn mẫu từ image có sẵn với các tùy chỉnh thêm, ví dụ có thể tạo image từ dựa trên image ubuntu để chạy các ứng dụng trên được xây dựng trên ubuntu.
* Container: là một thực thể của image. Người dùng có thể  run, start, stop một container từ docker client.
* Docker registry : là nơi lưu trữ của docker image. Người dùng có thể cấu hình để sử dụng registry của cá nhân hoặc của các nhà cung cấp như google cloud, AWS,...Người dùng có thể pull image từ các registry này. Docker hub là nơi lưu trữ mặc định của các docker image.
* Docker networking : các container riêng rẽ có thể liên kết với nhau thông qua network. Network này được cấu hình bởi người dùng.

## Docker file 
Là một file gồm các chỉ dẫn để tạo nên một docker image. Thông thường các image được xây dựng từ image cơ bản, sau đó các lớp sau sẽ được xếp trồng lên image cơ bản.

### Các config :

* FROM — chỉ định image gốc: python, unbutu, alpine…
* LABEL — cung cấp metadata cho image. Có thể sử dụng để add thông tin maintainer. Để xem các label của images, dùng lệnh docker inspect.
* ENV — thiết lập một biến môi trường.
* RUN — Có thể tạo một lệnh khi build image. Được sử dụng để cài đặt các package vào container.
* COPY — Sao chép các file và thư mục vào container.
* ADD — Sao chép các file và thư mục vào container.
* CMD — Cung cấp một lệnh và đối số cho container thực thi. Các tham số có thể được ghi đè và chỉ có một CMD.
* WORKDIR — Thiết lập thư mục đang làm việc cho các chỉ thị khác như: RUN, CMD, ENTRYPOINT, COPY, ADD,…
* ARG — Định nghĩa giá trị biến được dùng trong lúc build image.
* ENTRYPOINT — cung cấp lệnh và đối số cho một container thực thi.
* EXPOSE — khai báo port lắng nghe của image.
* VOLUME — tạo một điểm gắn thư mục để truy cập và lưu trữ data.

## Ví dụ Docker file 
Docker file của ứng dụng chatapp :


|Câu lệnh|Ý nghĩa|
|:-----|:----|
|FROM golang| Build image dựa trên image golang ban đầu|
|ENV GO111MODULE=on | Cho phép sử dụng go111module. Module này dùng để quản lý các package để chay ứng dụng golang.|
|RUN mkdir /docker_test| Tạo thư mục có tên docker_test trong image|
|RUN mkdir -p /docker_test/route_chat |Tạo thư mục con trong thư mục docker_test|
|WORKDIR /docker_test| Đặt thư mục docker_test là thư mục làm việc hiện tại|
|COPY ./route_chat/route_chat.pb.go /docker_test/route_chat | Copy file route_chat.pb.go vào thư mục route_chat vừa tạo trong image.|
|COPY  ./server/main.go /docker_test | Copy file main.go vào thư mục docker_test vừa tạo|
|COPY go.mod . | Copy file go.mod vào thư mục làm việc hiện tại|
|COPY go.sum .| Copy file go.mod vào thư mục làm việc hiện tại|
|RUN go mod download | Download các package cần thiết được khai báo trong file go.mod|
|RUN go build -o docker_test . | Build file main.go thành file |docker_test|
|EXPOSE 8080| Cho phép cổng 8080 được hoạt động|
|CMD ./docker_test | Chaỵ file docker_test vừa được build|


Sau khi có docker file, đầu tiên phải build file này với câu lệnh như sau :

        Docker build --tag <output> <Docker file>
Câu lệnh này sẽ build Docker file và tạo ra file **output** trong thư mục làm việc hiện tại. Để chạy docker file từ **output** của câu lệnh build, ta thực hiện câu lệnh :

        Docker run  --pulish <hostPort>:<containerPort> --detach --name <containerName> <buildfile>

Câu lệnh trên thực hiện việc chạy image **buildfile** là đầu ra của câu lệnh "docker build" thành 1 container có tên là **containerName**, đồng thời nó forword các kết nối từ **hostPort** trên máy host đến **containerPort** trên container, container được chạy trên background với cờ --detach.

## Docker Compose
Là một công cụ để định nghĩa và chạy nhiều container cùng một lúc.
Nó cho phép người dùng tạo một file YAML dùng để định nghĩa các service chạy trên ứng dụng và định nghĩa các bước, cấu hình cần thiết để chạy các image và kết nối chúng với nhau.

## Docker Compose Networking
Mặc đinh docker compose sẽ tạo một network cho ứng dụng. Mỗi container của một service sẽ join vào network này và có thể được nhìn thấy bởi các container khác trong ứng dụng.

Ví dụ Docker Compose file :

    version: "3.8"
    services:    
        chatapp:
            build: .
            ports: 
                - "8080:8080"
            environment: 
                FLASK_ENV: development
        database:
            image: mcr.microsoft.com/mssql/server:2019-latest
            container_name: mssqlserver
            restart: always
            hostname: mssql
            environment: 
                SA_PASSWORD: Vinhdongdo123@
                ACCEPT_EULA: Y   
            ports: 
                - "1733:1433"

Trong ví dụ này, sau khi chạy câu lệnh docker-compose run, một default network của ứng dụng được khởi tạo, 2 container tương ứng khai báo trong phần service sẽ được join vào network. Container được cấu hình bởi service chatapp sẽ có thể kết nối với database thông qua địa chỉ : <mssqlserver:1733>.

 Trong đó **mssqlserver** chính là tên của container chứa database, port **1733** là port trên máy host được forward tới port 1433 là port mặc định của sqlserver trên container. 

Trong service **database**, ta cấu hình **restart: always** có ý nghĩa : service này sẽ luôn được tự động restart bất cứ khi nào nó bị crash. 


