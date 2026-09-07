# KẾ HOẠCH KIỂM THỬ PHẦN MỀM QUẢN LÝ VÀNG BẠC TRANG SỨC

**Dự án:** Hệ thống quản lý chuỗi cửa hàng vàng bạc trang sức  
**Mô hình:** 1 Công ty - Nhiều chi nhánh - Đa cấp nhân viên  
**Phiên bản tài liệu:** 1.0  
**Ngày tạo:** [DD/MM/YYYY]

---

## 1. Giới thiệu (Introduction)

### 1.1. Mục đích

Kế hoạch này nhằm định hướng toàn bộ hoạt động kiểm thử cho dự án phần mềm quản lý vàng bạc, trang sức. Mục tiêu là đảm bảo phần mềm:

- Đáp ứng đầy đủ nghiệp vụ kinh doanh vàng bạc đặc thù.
- Vận hành ổn định, chính xác trên mô hình nhiều chi nhánh.
- An toàn tuyệt đối về dữ liệu và tài sản.
- Thân thiện với người dùng (nhân viên bán hàng, quản lý, chủ doanh nghiệp).

### 1.2. Phạm vi kiểm thử

Kế hoạch bao gồm kiểm thử toàn bộ hệ thống:

- **Nghiệp vụ cốt lõi:** Quản lý kho, bán hàng, điều chuyển vàng giữa các chi nhánh.
- **Giao diện:** Ứng dụng trên máy tính bán hàng (POS), ứng dụng quản lý, báo cáo.
- **Tích hợp phần cứng:** Máy in hóa đơn, máy quét mã vạch, cân điện tử.
- **Tích hợp hệ thống:** Đồng bộ dữ liệu giữa chi nhánh và trung tâm.

### 1.3. Tài liệu tham khảo

- Đặc tả yêu cầu phần mềm (SRS) – Phiên bản 1.x.
- Sơ đồ luồng nghiệp vụ kinh doanh vàng bạc.
- Tài liệu thiết kế cơ sở dữ liệu.
- Tài liệu hướng dẫn sử dụng.

---

## 2. Các hạng mục kiểm thử (Test Items)

### 2.1. Chức năng cần kiểm thử

#### Quản lý kho hàng đa chi nhánh

- Theo dõi tồn kho theo thời gian thực (vàng miếng, vàng nguyên liệu, trang sức thành phẩm).
- Nhập kho, xuất kho, kiểm kê định kỳ.
- Điều chuyển hàng hóa giữa các chi nhánh và kho trung tâm.

#### Quản lý bán hàng (POS)

- Tìm kiếm sản phẩm nhanh (mã vạch, tên sản phẩm, mã sản phẩm).
- Tạo đơn hàng với nhiều sản phẩm, nhiều phương thức thanh toán (tiền mặt, chuyển khoản, trả góp).
- Tính giá dựa trên trọng lượng, tuổi vàng, phí gia công.
- In hóa đơn bán hàng.

#### Quản lý khách hàng thân thiết

- Lưu trữ lịch sử mua hàng.
- Quản lý điểm tích lũy, đổi quà/ưu đãi.
- Chương trình khách hàng VIP.

#### Quản lý tài chính & báo cáo

- Báo cáo doanh thu theo ngày/tháng/quý/năm.
- Báo cáo lợi nhuận theo từng chi nhánh.
- Báo cáo công nợ với khách hàng/nhà cung cấp.
- Báo cáo tồn kho (số lượng, giá trị).

#### Tích hợp phần cứng

- Kết nối và in hóa đơn từ máy in nhiệt.
- Quét mã vạch sản phẩm.
- Kết nối cân điện tử để đo trọng lượng vàng.

#### Quản lý phân quyền (RBAC)

- Phân quyền chức năng theo vai trò: Chủ doanh nghiệp, Giám đốc điều hành, Quản lý chi nhánh, Nhân viên bán hàng, Kế toán.
- Kiểm soát các giao dịch có giá trị lớn (cần phê duyệt từ quản lý).

### 2.2. Chức năng không cần kiểm thử (trong phạm vi này)

- Các tính năng quản trị hệ thống cơ bản (khởi tạo database, cài đặt email server) – đã được kiểm thử ở dự án nền tảng.
- Các API của bên thứ ba (ví dụ: cổng thanh toán trung gian) – kiểm thử riêng.

---

## 3. Phương pháp tiếp cận kiểm thử (Test Approach)

Chiến lược kết hợp các cấp độ, loại hình và kỹ thuật kiểm thử đa dạng.

### 3.1. Các cấp độ kiểm thử

| Cấp độ | Người thực hiện | Mục tiêu chính |
| :--- | :--- | :--- |
| **Unit Testing** | Developers | Kiểm tra từng hàm, module nhỏ (tính giá vàng, logic kiểm kê). |
| **Integration Testing** | QA Engineers | Kiểm tra giao tiếp giữa module Kho, Bán hàng, Báo cáo và phần cứng. |
| **System Testing** | QA Engineers | Kiểm tra toàn bộ luồng End-to-End (tạo đơn -> điều chuyển -> báo cáo). |
| **User Acceptance Testing (UAT)** | End-users (NV bán hàng, Quản lý) | Xác nhận phần mềm đáp ứng nghiệp vụ thực tế tại cửa hàng. |

### 3.2. Các loại kiểm thử

| Loại kiểm thử | Mục đích | Áp dụng cho |
| :--- | :--- | :--- |
| **Functional Testing** | Đảm bảo các chức năng hoạt động đúng như yêu cầu | Toàn bộ chức năng ở mục 2.1 |
| **Performance Testing** | Mô phỏng tải cao điểm (giờ vàng, lễ Tết), kiểm tra tốc độ xử lý | API tạo đơn, API điều chuyển, Báo cáo tổng hợp |
| **Security Testing** | Kiểm tra phân quyền, chống tấn công SQL Injection, bảo mật dữ liệu | Module phân quyền, thanh toán, dữ liệu khách hàng |
| **Usability Testing** | Đánh giá giao diện dễ dùng, thao tác nhanh | Giao diện POS cho nhân viên bán hàng |
| **Compatibility Testing** | Kiểm tra trên nhiều trình duyệt, cấu hình máy tính khác nhau | Giao diện quản trị trên PC, tablet |
| **Data Migration Testing** | Kiểm tra dữ liệu cũ (từ Excel/Phần mềm cũ) chuyển sang hệ thống mới | Cơ sở dữ liệu sản phẩm, khách hàng |

### 3.3. Kỹ thuật thiết kế ca kiểm thử

- **BVA (Boundary Value Analysis):** Áp dụng cho các trường số (giá trị đơn hàng tối thiểu, ngưỡng giảm giá, số lượng tồn tối đa).
- **Decision Table (Bảng quyết định):** Áp dụng cho các quy tắc phức hợp (tính giá vàng theo tuổi, trọng lượng, phí gia công, chiết khấu).
- **State Transition:** Áp dụng cho trạng thái đơn hàng, phiếu điều chuyển, phiếu kiểm kê.
- **Checklist-based Testing:** Áp dụng cho kiểm thử hồi quy (Regression), kiểm thử giao diện UI.
- **Error Guessing:** Dựa trên kinh nghiệm dự đoán các lỗi thường gặp (nhập sai tuổi vàng, quên cập nhật tồn kho, mất kết nối giữa chi nhánh).
- **Exploratory Testing:** Sử dụng để khám phá các lỗi luồng nghiệp vụ phức tạp mà test case cố định không bắt được.
- **Pair Testing (QA + Dev):** Áp dụng cho các module nhạy cảm (tính toán vàng, tích hợp phần cứng).
- **Mob Testing:** Tổ chức cuối Sprint để kiểm thử tích hợp toàn hệ thống với sự tham gia của cả Dev, QA, BA, PO.

### 3.4. Tự động hóa kiểm thử (Test Automation)

| Cấp độ | Công cụ dự kiến | Phạm vi |
| :--- | :--- | :--- |
| **API Testing** | Postman / Rest Assured | Tự động hóa 100% các API quan trọng (tạo đơn, điều chuyển, kiểm kê) |
| **UI Regression** | Selenium / Katalon | Tự động hóa các luồng chính (login, tạo đơn, in hóa đơn) |
| **Performance** | JMeter | Tạo kịch bản tải mô phỏng N chi nhánh cùng lúc |

---

## 4. Môi trường và dữ liệu kiểm thử

### 4.1. Môi trường kiểm thử

- **Staging Server:** Cấu hình giống với Production.
- **Mạng nội bộ:** Mô phỏng kết nối của 1 công ty + nhiều chi nhánh (có độ trễ, băng thông khác nhau).
- **Phần cứng:** Máy in hóa đơn, máy quét mã vạch, cân điện tử được kết nối và cấu hình.

### 4.2. Dữ liệu kiểm thử

- **Sản phẩm:** Đa dạng về loại vàng (24K, 18K, 14K), trọng lượng (1 chỉ, 2 chỉ, 5 chỉ...), tuổi vàng, mẫu mã, giá gia công.
- **Khách hàng:** Khách hàng mới, khách hàng VIP, khách hàng có nợ.
- **Chi nhánh:** Tối thiểu 3 chi nhánh ảo với quy mô khác nhau.
- **Giao dịch:** Mô phỏng các ca bán hàng đơn giản, phức hợp, trả hàng, hủy đơn, điều chuyển.

> **Lưu ý:** Dữ liệu test phải được làm sạch và không chứa thông tin thật của khách hàng để đảm bảo bảo mật (GDPR compliance).

---

## 5. Lịch trình và nguồn lực

### 5.1. Nhân sự & Phân công trách nhiệm

| Vai trò | Trách nhiệm |
| :--- | :--- |
| **Chủ doanh nghiệp / Sponsor** | Phê duyệt ngân sách, quyết định phát hành dựa trên báo cáo cuối cùng. |
| **Trưởng phòng QA (QA Lead)** | Xây dựng kế hoạch, quản lý tiến độ, đào tạo thành viên, báo cáo chất lượng. |
| **Kỹ sư kiểm thử (QC/Tester)** | Thiết kế ca kiểm thử, thực thi, ghi nhận và theo dõi lỗi. |
| **Kỹ sư tự động hóa (Automation)** | Xây dựng và bảo trì bộ test tự động. |
| **Đại diện khách hàng (PO/BA)** | Tham gia Three Amigos, UAT, xác nhận tiêu chí chấp nhận. |
| **Quản lý chi nhánh / NV bán hàng** | Tham gia kiểm thử thực tế (UAT) để đánh giá tính phù hợp. |

### 5.2. Đào tạo

- **Đào tạo tester:** Hướng dẫn đặc tả kỹ thuật, nghiệp vụ vàng bạc.
- **Đào tạo nhân viên cửa hàng:** Lịch đào tạo 3-5 ngày trước khi vào UAT và triển khai chính thức.

### 5.3. Lịch trình dự kiến

| Giai đoạn | Khoảng thời gian | Mốc giao nhận |
| :--- | :--- | :--- |
| **Lập kế hoạch & Chuẩn bị** | Tuần 1 | Test Plan, Test Data |
| **Kiểm thử đơn vị & Tích hợp** | Tuần 2-3 | Báo cáo lỗi module |
| **Kiểm thử hệ thống (System Test)** | Tuần 4 | Báo cáo lỗi toàn hệ thống |
| **Kiểm thử hiệu suất & Bảo mật** | Tuần 5 | Báo cáo hiệu năng, bảo mật |
| **Kiểm thử chấp nhận (UAT)** | Tuần 6 | Phản hồi người dùng |
| **Triển khai thí điểm (Pilot)** | Tuần 7 | Đánh giá Pilot |
| **Triển khai toàn bộ chi nhánh** | Tuần 8 | Go-live |

---

## 6. Quản lý rủi ro (Risk Management)

### 6.1. Danh sách rủi ro & Kế hoạch giảm thiểu

| Rủi ro | Mức độ ảnh hưởng | Kế hoạch giảm thiểu |
| :--- | :--- | :--- |
| **Yêu cầu nghiệp vụ không rõ ràng (đặc biệt là tính giá vàng)** | Cao | Tổ chức họp Three Amigos trước mỗi User Story; làm việc trực tiếp với chủ tiệm vàng để hiểu quy trình. |
| **Lỗi đồng bộ dữ liệu giữa chi nhánh và trung tâm do mạng yếu** | Cao | Kiểm thử với mô phỏng network latency; thiết kế cơ chế retry và queuing. |
| **Nhân viên cửa hàng từ chối sử dụng phần mềm do quen dùng Excel** | Trung bình | Đào tạo bài bản, triển khai thí điểm 1-2 chi nhánh để lấy feedback tích cực; xây dựng chính sách khen thưởng. |
| **Dữ liệu migration sai (sai tuổi vàng, sai trọng lượng)** | Rất cao | Chạy script kiểm tra đối chiếu giữa dữ liệu cũ và mới; kiểm thử Migration với dữ liệu thật (đã mã hóa). |
| **Máy in hóa đơn / máy quét không tương thích với driver mới** | Thấp | Kiểm thử tích hợp phần cứng trên nhiều cấu hình máy tính thực tế. |
| **Không đủ thời gian để hoàn thành kiểm thử** | Trung bình | Tự động hóa các luồng quan trọng; ưu tiên kiểm thử các chức năng có rủi ro cao nhất (Risk-based testing). |

---

## 7. Tiêu chí và Báo cáo (Criteria & Reporting)

### 7.1. Tiêu chí bắt đầu (Entry Criteria)

- Môi trường kiểm thử đã được cài đặt và cấu hình.
- Dữ liệu kiểm thử đã được chuẩn bị sẵn.
- Build phần mềm mới nhất đã được deploy lên môi trường test.
- Các Unit Test của Dev đã pass.

### 7.2. Tiêu chí kết thúc / Thoát (Exit Criteria - DONE)

Áp dụng cho từng giai đoạn:

- **100% ca kiểm thử ưu tiên (P0, P1)** đã được thực thi.
- **0 lỗi Critical (Kịch bản: Không thể tiếp tục làm việc)** còn tồn tại.
- **0 lỗi Major (Kịch bản: Tính toán sai số tiền)** còn tồn tại.
- **Tỷ lệ pass > 95%** cho các ca kiểm thử tự động.
- **Tất cả các lỗi đã được tracking** và có kế hoạch fix rõ ràng.

### 7.3. Các loại báo cáo

| Loại báo cáo | Định kỳ | Đối tượng |
| :--- | :--- | :--- |
| **Báo cáo lỗi (Bug Report)** | Hàng ngày | Dev Team, QA Lead |
| **Báo cáo tiến độ (Daily/Weekly Status)** | Cuối ngày/Tuần | Project Manager, Các bên liên quan |
| **Báo cáo chất lượng hệ thống (Test Summary Report)** | Sau mỗi Sprint/Release | Ban Giám đốc, Sponsor |

---

## 8. Phê duyệt (Approvals)

Kế hoạch kiểm thử cần được các bên liên quan phê duyệt trước khi thực hiện.

| Vai trò | Họ tên | Ngày ký | Chữ ký (nếu có) |
| :--- | :--- | :--- | :--- |
| **Trưởng phòng QA** | [Họ tên QA Lead] | ..../..../.... | |
| **Trưởng dự án (PM)** | [Họ tên PM] | ..../..../.... | |
| **Đại diện Chủ doanh nghiệp** | [Họ tên Sponsor] | ..../..../.... | |
| **Đại diện Chi nhánh (UAT)** | [Họ tên] | ..../..../.... | |

---

## 9. Phụ lục (Appendix)

- **Phụ lục A:** Mẫu báo cáo lỗi (Bug Report Template).
- **Phụ lục B:** Danh sách kiểm tra (Checklist) cho kiểm thử hồi quy.
- **Phụ lục C:** Kịch bản cho kiểm thử hiệu năng (JMeter Scripts).
- **Phụ lục D:** Hướng dẫn cấu hình môi trường test.
