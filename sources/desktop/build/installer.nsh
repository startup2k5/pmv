!macro customInstall
  MessageBox MB_OK "customInstall đã chạy! Đường dẫn cài đặt: $INSTDIR"
  
  ; Tạo thêm thư mục con trong thư mục cài đặt
  CreateDirectory "$INSTDIR\\Data"
  CreateDirectory "$INSTDIR\\Logs"
  
  ; Ví dụ: tạo file config mẫu
  FileOpen $0 "$INSTDIR\\config.json" w
  FileWrite $0 '{ "version": "1.0.0", "firstRun": true }'
  FileClose $0
!macroend

!macro customUnInstall
  MessageBox MB_OK "customUnInstall đã chạy! Đường dẫn: $INSTDIR"
  
  ; Hỏi người dùng có muốn xóa dữ liệu không
  MessageBox MB_YESNO "Bạn có muốn xóa toàn bộ dữ liệu cấu hình không?" IDYES delete_data IDNO skip_delete
  
  delete_data:
    RMDir /r "$APPDATA\\SMG2026"
    RMDir /r "$INSTDIR\\Data"
    RMDir /r "$INSTDIR\\Logs"
    Delete "$INSTDIR\\config.json"
  skip_delete:
!macroend

!macro customWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "Chào mừng đến với SMG2026"
  !define MUI_WELCOMEPAGE_TEXT "Ứng dụng này sẽ được cài đặt trên máy tính của bạn.$\r$\n$\r$\nNhấn Next để tiếp tục."
  !insertmacro MUI_PAGE_WELCOME
!macroend

!macro customUnWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "Gỡ cài đặt SMG2026"
  !define MUI_WELCOMEPAGE_TEXT "Bạn có chắc chắn muốn gỡ bỏ ứng dụng này không?"
  !insertmacro MUI_UNPAGE_WELCOME
!macroend